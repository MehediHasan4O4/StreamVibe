import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Link as LinkIcon, 
  Home, 
  Play, 
  LogOut,
  RefreshCw,
  CheckCircle,
  XCircle,
  TestTube,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  addPlaylist, 
  getPlaylists, 
  updatePlaylist, 
  deletePlaylist,
  testPlaylistUrl,
  AdminPlaylist 
} from "@/services/playlistService";

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<AdminPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<AdminPlaylist | null>(null);
  const [testingUrl, setTestingUrl] = useState(false);
  
  // Form states
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load playlists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setPlaylistName('');
    setPlaylistUrl('');
    setPlaylistDescription('');
    setIsActive(true);
    setEditingPlaylist(null);
  };

  const handleTestUrl = async () => {
    if (!playlistUrl.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a playlist URL to test",
        variant: "destructive",
      });
      return;
    }

    setTestingUrl(true);
    try {
      const result = await testPlaylistUrl(playlistUrl);
      if (result.success) {
        toast({
          title: "URL Test Successful",
          description: `Found ${result.channelCount} channels in the playlist`,
        });
      } else {
        toast({
          title: "URL Test Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test the playlist URL",
        variant: "destructive",
      });
    } finally {
      setTestingUrl(false);
    }
  };

  const handleAddPlaylist = async () => {
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
      const result = await addPlaylist({
        name: playlistName,
        url: playlistUrl,
        description: playlistDescription,
        isActive
      });

      toast({
        title: "Playlist Added",
        description: `${playlistName} added with ${result.channelCount} channels`,
      });

      resetForm();
      loadPlaylists();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add playlist. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEditPlaylist = (playlist: AdminPlaylist) => {
    setEditingPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistUrl(playlist.url);
    setPlaylistDescription(playlist.description || '');
    setIsActive(playlist.isActive);
  };

  const handleUpdatePlaylist = async () => {
    if (!editingPlaylist || !playlistName.trim() || !playlistUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updatePlaylist(editingPlaylist.id!, {
        name: playlistName,
        url: playlistUrl,
        description: playlistDescription,
        isActive
      });

      toast({
        title: "Playlist Updated",
        description: `${playlistName} has been updated successfully`,
      });

      resetForm();
      loadPlaylists();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update playlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await deletePlaylist(id);
      toast({
        title: "Playlist Deleted",
        description: `${name} has been deleted successfully`,
      });
      loadPlaylists();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (playlist: AdminPlaylist) => {
    try {
      await updatePlaylist(playlist.id!, {
        isActive: !playlist.isActive
      });
      
      toast({
        title: playlist.isActive ? "Playlist Deactivated" : "Playlist Activated",
        description: `${playlist.name} is now ${!playlist.isActive ? 'active' : 'inactive'}`,
      });
      
      loadPlaylists();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update playlist status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Play className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-glow"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StreamVibe Admin
                </h1>
                <p className="text-sm text-muted-foreground">M3U Playlist Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
                Dashboard
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="playlists" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="playlists">Manage Playlists</TabsTrigger>
            <TabsTrigger value="add">Add New Playlist</TabsTrigger>
          </TabsList>

          {/* Add/Edit Playlist Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingPlaylist ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editingPlaylist ? 'Edit Playlist' : 'Add New M3U Playlist'}
                </CardTitle>
                <CardDescription>
                  {editingPlaylist ? 'Update playlist information' : 'Add a new M3U playlist to your streaming platform'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="playlist-name">Playlist Name *</Label>
                    <Input
                      id="playlist-name"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="My Awesome Playlist"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      disabled={loading}
                    />
                    <Label htmlFor="is-active">Active (visible to users)</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="playlist-url">M3U Playlist URL *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="playlist-url"
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      placeholder="https://example.com/playlist.m3u"
                      disabled={loading}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleTestUrl}
                      disabled={loading || testingUrl || !playlistUrl.trim()}
                    >
                      {testingUrl ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="playlist-description">Description (Optional)</Label>
                  <Textarea
                    id="playlist-description"
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    placeholder="Brief description of this playlist..."
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={editingPlaylist ? handleUpdatePlaylist : handleAddPlaylist}
                    disabled={loading || !playlistName.trim() || !playlistUrl.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : editingPlaylist ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {editingPlaylist ? 'Update Playlist' : 'Add Playlist'}
                  </Button>
                  
                  {editingPlaylist && (
                    <Button variant="outline" onClick={resetForm} disabled={loading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
     
         {/* Manage Playlists Tab */}
         
          <TabsContent value="playlists" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">M3U Playlists</h2>
                <p className="text-muted-foreground">Manage your streaming playlists</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadPlaylists} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => {
                  resetForm();
                  // Switch to add tab
                  const addTab = document.querySelector('[value="add"]') as HTMLElement;
                  addTab?.click();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Playlist
                </Button>
              </div>
            </div>

            {loading && playlists.length === 0 ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading playlists...</p>
              </div>
            ) : playlists.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Playlists Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first M3U playlist to start streaming content
                  </p>
                  <Button onClick={() => {
                    resetForm();
                    const addTab = document.querySelector('[value="add"]') as HTMLElement;
                    addTab?.click();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Playlist
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {playlists.map((playlist) => (
                  <Card key={playlist.id} className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {playlist.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              {playlist.isActive ? (
                                <Badge variant="default" className="bg-success text-success-foreground">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactive
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {playlist.channelCount} channels
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 break-all">
                            {playlist.url}
                          </p>
                          
                          {playlist.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {playlist.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Created: {playlist.createdAt?.toLocaleDateString()}
                            </span>
                            <span>
                              Updated: {playlist.updatedAt?.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(playlist)}
                            disabled={loading}
                          >
                            {playlist.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleEditPlaylist(playlist);
                              const addTab = document.querySelector('[value="add"]') as HTMLElement;
                              addTab?.click();
                            }}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePlaylist(playlist.id!, playlist.name)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
