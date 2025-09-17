import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Upload, Link as LinkIcon, Home, Settings as SettingsIcon, Tv, FileText, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState([
    { id: 1, name: 'Live TV', type: 'live', channels: [] },
    { id: 2, name: 'Movies', type: 'movies', channels: [] },
    { id: 3, name: 'Sports', type: 'sports', channels: [] }
  ]);

  const handleAddSection = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Connect to Supabase to enable full admin functionality",
      variant: "default",
    });
  };

  const handleAddChannel = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Connect to Supabase to enable database operations",
      variant: "default",
    });
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
                <p className="text-sm text-muted-foreground">Content Management System</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">

        {/* Backend Notice */}
        <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
              <SettingsIcon className="h-5 w-5" />
              <div>
                <p className="font-medium">Backend Integration Required</p>
                <p className="text-sm">Connect to Supabase to enable full admin functionality including authentication, database operations, and content management.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sections" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Sections Management */}
          <TabsContent value="sections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Content Sections</h2>
              <Button onClick={handleAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Type: {section.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Channels: {section.channels.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Channel Management */}
          <TabsContent value="channels" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Channel Management</h2>
              <Button onClick={handleAddChannel}>
                <Plus className="h-4 w-4 mr-2" />
                Add Channel
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add New Channel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="channel-name">Channel Name</Label>
                    <Input id="channel-name" placeholder="Channel name" />
                  </div>
                  <div>
                    <Label htmlFor="channel-section">Section</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stream-url">Stream URL (M3U8)</Label>
                  <Input id="stream-url" placeholder="https://example.com/stream.m3u8" />
                </div>

                <div>
                  <Label htmlFor="channel-logo">Channel Logo URL</Label>
                  <Input id="channel-logo" placeholder="https://example.com/logo.png" />
                </div>

                <Button className="w-full" onClick={handleAddChannel}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Save Channel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlist Management */}
          <TabsContent value="playlists" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">M3U Playlist Management</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Add Playlist by URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="playlist-url">M3U Playlist URL</Label>
                    <Input id="playlist-url" placeholder="https://example.com/playlist.m3u" />
                  </div>
                  <div>
                    <Label htmlFor="playlist-name">Playlist Name</Label>
                    <Input id="playlist-name" placeholder="My Playlist" />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Import Playlist
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload M3U File
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="playlist-file">M3U File</Label>
                    <Input id="playlist-file" type="file" accept=".m3u,.m3u8" />
                  </div>
                  <div>
                    <Label htmlFor="uploaded-playlist-name">Playlist Name</Label>
                    <Input id="uploaded-playlist-name" placeholder="Uploaded Playlist" />
                  </div>
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Process
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Site Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input id="site-title" defaultValue="StreamVibe" />
                </div>
                
                <div>
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea id="site-description" defaultValue="Premium IPTV Streaming Platform" />
                </div>
                
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input id="logo-url" placeholder="https://example.com/logo.png" />
                </div>

                  <Button className="w-full">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;