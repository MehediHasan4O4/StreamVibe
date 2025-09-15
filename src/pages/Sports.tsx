import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CategorySection from '@/components/CategorySection';
import VideoPlayer from '@/components/VideoPlayer';
import { parseM3U, loadPlaylists, M3UChannel, M3UPlaylist } from '@/utils/m3u-parser';
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Sports = () => {
  const { toast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [sportsChannels, setSportsChannels] = useState<M3UChannel[]>([]);
  const [searchResults, setSearchResults] = useState<M3UChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSportsChannels();
  }, []);

  const loadSportsChannels = async () => {
    setLoading(true);
    try {
      const playlists = await loadPlaylists();
      const allChannels = playlists.flatMap(playlist => playlist.channels);
      
      // Filter sports-related channels
      const sports = allChannels.filter(channel => 
        channel.category.toLowerCase().includes('sport') ||
        channel.category.toLowerCase().includes('football') ||
        channel.category.toLowerCase().includes('cricket') ||
        channel.category.toLowerCase().includes('basketball') ||
        channel.category.toLowerCase().includes('tennis') ||
        channel.name.toLowerCase().includes('sport') ||
        channel.name.toLowerCase().includes('espn') ||
        channel.name.toLowerCase().includes('fox sport')
      );
      
      setSportsChannels(sports);
      
      toast({
        title: "Sports Loaded",
        description: `${sports.length} sports channels found`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sports channels",
        variant: "destructive",
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
    
    const filtered = sportsChannels.filter(channel => 
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

  const sportsCategories = sportsChannels.reduce((acc, channel) => {
    const category = channel.category || 'Sports';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, M3UChannel[]>);

  const featuredSports = [
    {
      title: "Football",
      description: "Live matches and highlights",
      icon: Trophy,
      count: sportsCategories['Football']?.length || 0
    },
    {
      title: "Cricket", 
      description: "International cricket coverage",
      icon: Target,
      count: sportsCategories['Cricket']?.length || 0
    },
    {
      title: "Basketball",
      description: "NBA and international games",
      icon: Zap,
      count: sportsCategories['Basketball']?.length || 0
    },
    {
      title: "Live Sports",
      description: "Live sporting events 24/7",
      icon: Clock,
      count: sportsChannels.filter(ch => ch.isLive).length
    }
  ];

  return (
    <Layout
      onSearch={handleSearch}
      searchResults={searchResults}
      onChannelSelect={handleChannelClick}
    >
      <div className="pb-20 lg:pb-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Sports
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Never miss your favorite sporting events
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>{sportsChannels.length} sports channels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Live Coverage</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Sports */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Popular Sports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSports.map((sport, index) => {
                const Icon = sport.icon;
                return (
                  <div
                    key={index}
                    className="glass rounded-xl p-6 hover:bg-card-secondary transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{sport.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {sport.count} channels
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{sport.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading sports channels...</p>
            </div>
          </div>
        ) : (
          <main className="container mx-auto px-4 py-8 space-y-8">
            {Object.entries(sportsCategories).map(([category, channels]) => (
              <CategorySection
                key={category}
                title={category}
                channels={channels}
                onChannelClick={handleChannelClick}
              />
            ))}
            
            {Object.keys(sportsCategories).length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No sports channels found</p>
                <Button onClick={loadSportsChannels} variant="outline">
                  Retry Loading
                </Button>
              </div>
            )}
          </main>
        )}

        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          channel={selectedChannel}
          relatedChannels={[]}
          onChannelSelect={handleChannelClick}
        />
      </div>
    </Layout>
  );
};

export default Sports;