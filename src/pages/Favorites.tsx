import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ChannelCard from '@/components/ChannelCard';
import VideoPlayer from '@/components/VideoPlayer';
import { useToast } from "@/hooks/use-toast";
import { Heart, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FavoriteChannel {
  id: string;
  name: string;
  category: string;
  viewers?: string;
  isLive: boolean;
  url?: string;
  addedAt: string;
}

const Favorites = () => {
  const { toast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteChannel[]>([]);
  const [searchResults, setSearchResults] = useState<FavoriteChannel[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorite_channels');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const filtered = favorites.filter(channel => 
      channel.name.toLowerCase().includes(query.toLowerCase()) ||
      channel.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  const handleChannelClick = (channel: any) => {
    setSelectedChannel(channel);
    setIsPlayerOpen(true);
    
    // Add to recently watched
    const recentlyWatched = JSON.parse(localStorage.getItem('recently_watched') || '[]');
    const updated = [channel, ...recentlyWatched.filter((ch: any) => ch.id !== channel.id)].slice(0, 20);
    localStorage.setItem('recently_watched', JSON.stringify(updated));
    
    toast({
      title: "Now Playing",
      description: channel.name,
      duration: 2000,
    });
  };

  const removeFavorite = (channelId: string) => {
    const updated = favorites.filter(ch => ch.id !== channelId);
    setFavorites(updated);
    localStorage.setItem('favorite_channels', JSON.stringify(updated));
    
    toast({
      title: "Removed from Favorites",
      description: "Channel has been removed from your favorites",
      duration: 2000,
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorite_channels');
    
    toast({
      title: "Favorites Cleared",
      description: "All favorite channels have been removed",
      duration: 2000,
    });
  };

  const groupedFavorites = favorites.reduce((acc, channel) => {
    const category = channel.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, FavoriteChannel[]>);

  return (
    <Layout
      onSearch={handleSearch}
      searchResults={searchResults}
      onChannelSelect={handleChannelClick}
    >
      <div className="pb-20 lg:pb-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
                My Favorites
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your saved channels for quick access
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{favorites.length} favorite channels</span>
                </div>
                {favorites.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFavorites}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {favorites.length === 0 ? (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No Favorites Yet</h2>
              <p className="text-muted-foreground mb-8">
                Start adding channels to your favorites for quick access. Look for the heart icon on any channel.
              </p>
              <Button asChild>
                <a href="/live">
                  <Play className="h-4 w-4 mr-2" />
                  Browse Channels
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <main className="container mx-auto px-4 py-8">
            {Object.entries(groupedFavorites).map(([category, channels]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                  <span className="text-sm text-muted-foreground">{channels.length} channels</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="relative group">
                      <ChannelCard
                        name={channel.name}
                        category={channel.category}
                        viewers={channel.viewers}
                        isLive={channel.isLive}
                        onClick={() => handleChannelClick(channel)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(channel.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

export default Favorites;