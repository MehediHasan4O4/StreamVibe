import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CategorySection from '@/components/CategorySection';
import VideoPlayer from '@/components/VideoPlayer';
import { parseM3U, loadPlaylists, M3UChannel, M3UPlaylist } from '@/utils/m3u-parser';
import { useToast } from "@/hooks/use-toast";
import { Film, Star, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Movies = () => {
  const { toast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [movieChannels, setMovieChannels] = useState<M3UChannel[]>([]);
  const [searchResults, setSearchResults] = useState<M3UChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieChannels();
  }, []);

  const loadMovieChannels = async () => {
    setLoading(true);
    try {
      const playlists = await loadPlaylists();
      const allChannels = playlists.flatMap(playlist => playlist.channels);
      
      // Filter movie-related channels
      const movies = allChannels.filter(channel => 
        channel.category.toLowerCase().includes('movie') ||
        channel.category.toLowerCase().includes('cinema') ||
        channel.category.toLowerCase().includes('film') ||
        channel.name.toLowerCase().includes('movie') ||
        channel.name.toLowerCase().includes('cinema')
      );
      
      setMovieChannels(movies);
      
      toast({
        title: "Movies Loaded",
        description: `${movies.length} movie channels found`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load movie channels",
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
    
    const filtered = movieChannels.filter(channel => 
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

  const movieCategories = movieChannels.reduce((acc, channel) => {
    const category = channel.category || 'Movies';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, M3UChannel[]>);

  const featuredMovies = [
    {
      title: "Action Movies",
      description: "High-octane films with thrilling sequences",
      icon: Film,
      count: movieCategories['Action']?.length || 0
    },
    {
      title: "Comedy Movies", 
      description: "Laugh-out-loud entertainment",
      icon: Star,
      count: movieCategories['Comedy']?.length || 0
    },
    {
      title: "Drama Movies",
      description: "Compelling stories and characters",
      icon: Clock,
      count: movieCategories['Drama']?.length || 0
    },
    {
      title: "Classic Movies",
      description: "Timeless cinematic masterpieces",
      icon: Calendar,
      count: movieCategories['Classic']?.length || 0
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
        <section className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Movies
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing films from every genre
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                <span>{movieChannels.length} movie channels</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>HD Quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMovies.map((category, index) => {
                const Icon = category.icon;
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
                        <h3 className="font-semibold text-foreground">{category.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.count} channels
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
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
              <p className="text-lg text-muted-foreground">Loading movie channels...</p>
            </div>
          </div>
        ) : (
          <main className="container mx-auto px-4 py-8 space-y-8">
            {Object.entries(movieCategories).map(([category, channels]) => (
              <CategorySection
                key={category}
                title={category}
                channels={channels}
                onChannelClick={handleChannelClick}
              />
            ))}
            
            {Object.keys(movieCategories).length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No movie channels found</p>
                <Button onClick={loadMovieChannels} variant="outline">
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

export default Movies;