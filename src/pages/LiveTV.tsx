import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CategorySection from '@/components/CategorySection';
import VideoPlayer from '@/components/VideoPlayer';
import { parseM3U, loadPlaylists, M3UChannel, M3UPlaylist } from '@/utils/m3u-parser';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const LiveTV = () => {
  const { toast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playlists, setPlaylists] = useState<M3UPlaylist[]>([]);
  const [allChannels, setAllChannels] = useState<M3UChannel[]>([]);
  const [searchResults, setSearchResults] = useState<M3UChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadM3UPlaylists();
  }, []);

  const loadM3UPlaylists = async () => {
    setLoading(true);
    try {
      const loadedPlaylists = await loadPlaylists();
      setPlaylists(loadedPlaylists);
      
      const combined = loadedPlaylists.flatMap(playlist => playlist.channels);
      setAllChannels(combined);
      
      toast({
        title: "Live TV Loaded",
        description: `${combined.length} channels available`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load live TV channels",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const filtered = allChannels.filter(channel => 
      channel.name.toLowerCase().includes(query.toLowerCase()) ||
      channel.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered.slice(0, 10));
  };

  const handleChannelClick = (channel: any) => {
    setSelectedChannel(channel);
    setIsPlayerOpen(true);
    toast({
      title: "Now Playing",
      description: channel.name,
      duration: 2000,
    });
  };

  const channelsByCategory = playlists.length > 0 ? 
    playlists.reduce((acc, playlist) => {
      const groupedByCategory = playlist.channels.reduce((catAcc, channel) => {
        const category = channel.category || 'General';
        if (!catAcc[category]) {
          catAcc[category] = [];
        }
        catAcc[category].push(channel);
        return catAcc;
      }, {} as Record<string, M3UChannel[]>);
      
      Object.keys(groupedByCategory).forEach(category => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category] = [...acc[category], ...groupedByCategory[category]];
      });
      
      return acc;
    }, {} as Record<string, M3UChannel[]>) : {};

  const categories = ['All', ...Object.keys(channelsByCategory)];
  
  const filteredChannels = selectedCategory === 'All' 
    ? channelsByCategory 
    : { [selectedCategory]: channelsByCategory[selectedCategory] || [] };

  const getRelatedChannels = (currentChannel: any) => {
    const categoryChannels = channelsByCategory[currentChannel?.category] || [];
    return categoryChannels.filter(ch => ch.id !== currentChannel?.id).slice(0, 8);
  };

  return (
    <Layout
      onSearch={handleSearch}
      searchResults={searchResults}
      onChannelSelect={handleChannelClick}
    >
      <div className="pb-20 lg:pb-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Live TV
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Watch live channels from around the world
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>{allChannels.length} channels available</span>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  {category}
                  {category !== 'All' && channelsByCategory[category] && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {channelsByCategory[category].length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading live channels...</p>
            </div>
          </div>
        ) : (
          <main className="container mx-auto px-4 py-8 space-y-8">
            {Object.entries(filteredChannels).map(([category, channels]) => (
              <CategorySection
                key={category}
                title={category}
                channels={channels}
                onChannelClick={handleChannelClick}
              />
            ))}
            
            {Object.keys(filteredChannels).length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No channels in this category</p>
                <Button onClick={() => setSelectedCategory('All')} variant="outline">
                  View All Channels
                </Button>
              </div>
            )}
          </main>
        )}

        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          channel={selectedChannel}
          relatedChannels={getRelatedChannels(selectedChannel)}
          onChannelSelect={handleChannelClick}
        />
      </div>
    </Layout>
  );
};

export default LiveTV;