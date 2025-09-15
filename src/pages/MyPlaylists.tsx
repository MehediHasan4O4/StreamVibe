import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Plus, Upload, Link, Trash2, Play, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { parseM3U } from '@/utils/m3u-parser';

interface UserPlaylist {
  id: string;
  name: string;
  url?: string;
  channels: any[];
  createdAt: string;
  type: 'url' | 'file' | 'manual';
}

const MyPlaylists = () => {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistContent, setPlaylistContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserPlaylists();
  }, []);

  const loadUserPlaylists = () => {
    const saved = localStorage.getItem('user_playlists');
    if (saved) {
      try {
        setPlaylists(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load playlists:', error);
      }
    }
  };

  const saveUserPlaylists = (updatedPlaylists: UserPlaylist[]) => {
    setPlaylists(updatedPlaylists);
    localStorage.setItem('user_playlists', JSON.stringify(updatedPlaylists));
  };

  const addPlaylistFromUrl = async () => {
    if (!playlistName.trim() || !playlistUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const channels = await parseM3U(playlistUrl);
      const newPlaylist: UserPlaylist = {
        id: `playlist_${Date.now()}`,
        name: playlistName,
        url: playlistUrl,
        channels,
        createdAt: new Date().toISOString(),
        type: 'url'
      };

      const updated = [...playlists, newPlaylist];
      saveUserPlaylists(updated);

      toast({
        title: "Playlist Added",
        description: `${channels.length} channels loaded from ${playlistName}`,
      });

      setIsAddDialogOpen(false);
      setPlaylistName('');
      setPlaylistUrl('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load playlist from URL",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPlaylistFromContent = async () => {
    if (!playlistName.trim() || !playlistContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create a temporary blob URL for parsing
      const blob = new Blob([playlistContent], { type: 'text/plain' });
      const tempUrl = URL.createObjectURL(blob);
      
      const channels = await parseM3U(tempUrl);
      URL.revokeObjectURL(tempUrl);

      const newPlaylist: UserPlaylist = {
        id: `playlist_${Date.now()}`,
        name: playlistName,
        channels,
        createdAt: new Date().toISOString(),
        type: 'manual'
      };

      const updated = [...playlists, newPlaylist];
      saveUserPlaylists(updated);

      toast({
        title: "Playlist Added",
        description: `${channels.length} channels loaded from ${playlistName}`,
      });

      setIsAddDialogOpen(false);
      setPlaylistName('');
      setPlaylistContent('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse playlist content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = (playlistId: string) => {
    const updated = playlists.filter(p => p.id !== playlistId);
    saveUserPlaylists(updated);
    
    toast({
      title: "Playlist Deleted",
      description: "Playlist has been removed",
    });
  };

  const exportPlaylist = (playlist: UserPlaylist) => {
    const content = JSON.stringify(playlist, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Playlist Exported",
      description: `${playlist.name} has been downloaded`,
    });
  };

  return (
    <Layout>
      <div className="pb-20 lg:pb-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                My Playlists
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Manage your personal M3U playlists
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span>{playlists.length} playlists</span>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Playlist</DialogTitle>
                      <DialogDescription>
                        Add a playlist from URL or paste M3U content directly.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="playlist-name">Playlist Name</Label>
                        <Input
                          id="playlist-name"
                          value={playlistName}
                          onChange={(e) => setPlaylistName(e.target.value)}
                          placeholder="My Awesome Playlist"
                        />
                      </div>

                      <Tabs defaultValue="url">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="url">From URL</TabsTrigger>
                          <TabsTrigger value="content">Paste Content</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="url" className="space-y-4">
                          <div>
                            <Label htmlFor="playlist-url">M3U URL</Label>
                            <Input
                              id="playlist-url"
                              type="url"
                              value={playlistUrl}
                              onChange={(e) => setPlaylistUrl(e.target.value)}
                              placeholder="https://example.com/playlist.m3u"
                            />
                          </div>
                          <Button 
                            onClick={addPlaylistFromUrl} 
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? "Loading..." : "Add from URL"}
                          </Button>
                        </TabsContent>
                        
                        <TabsContent value="content" className="space-y-4">
                          <div>
                            <Label htmlFor="playlist-content">M3U Content</Label>
                            <Textarea
                              id="playlist-content"
                              value={playlistContent}
                              onChange={(e) => setPlaylistContent(e.target.value)}
                              placeholder="#EXTM3U&#10;#EXTINF:-1,Channel Name&#10;http://example.com/stream.m3u8"
                              rows={6}
                            />
                          </div>
                          <Button 
                            onClick={addPlaylistFromContent} 
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? "Processing..." : "Add from Content"}
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-8">
          {playlists.length === 0 ? (
            <div className="text-center max-w-md mx-auto py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <List className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No Playlists Yet</h2>
              <p className="text-muted-foreground mb-8">
                Create your first playlist by adding M3U URLs or pasting content directly.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="glass hover:bg-card-secondary transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{playlist.name}</span>
                      <Badge variant={playlist.type === 'url' ? 'default' : 'secondary'}>
                        {playlist.type === 'url' ? <Link className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {playlist.channels.length} channels • Added {new Date(playlist.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {playlist.url && (
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {playlist.url}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(playlist.channels.map(ch => ch.category))).slice(0, 3).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {Array.from(new Set(playlist.channels.map(ch => ch.category))).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Array.from(new Set(playlist.channels.map(ch => ch.category))).length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      View Channels
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportPlaylist(playlist)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deletePlaylist(playlist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default MyPlaylists;