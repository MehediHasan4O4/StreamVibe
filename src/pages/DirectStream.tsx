import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Settings, ChevronDown, History, Trash2, Link } from 'lucide-react';

interface StreamHistory {
  id: string;
  url: string;
  name?: string;
  playedAt: string;
  userAgent?: string;
  referer?: string;
  cookies?: string;
}

const DirectStream = () => {
  const { toast } = useToast();
  const [streamUrl, setStreamUrl] = useState('');
  const [streamName, setStreamName] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [referer, setReferer] = useState('');
  const [cookies, setCookies] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [streamHistory, setStreamHistory] = useState<StreamHistory[]>([]);
  
  const presetUserAgents = [
    { name: 'Chrome (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    { name: 'Chrome (Android)', value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' },
    { name: 'Safari (iPhone)', value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    { name: 'Smart TV', value: 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 4.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 TV Safari/537.36' },
    { name: 'VLC Player', value: 'VLC/3.0.16 LibVLC/3.0.16' }
  ];

  useEffect(() => {
    loadStreamHistory();
  }, []);

  const loadStreamHistory = () => {
    const saved = localStorage.getItem('stream_history');
    if (saved) {
      try {
        setStreamHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load stream history:', error);
      }
    }
  };

  const saveToHistory = (url: string, name?: string) => {
    const newEntry: StreamHistory = {
      id: `stream_${Date.now()}`,
      url,
      name: name || `Stream ${new Date().toLocaleTimeString()}`,
      playedAt: new Date().toISOString(),
      userAgent,
      referer,
      cookies
    };

    const updated = [newEntry, ...streamHistory.filter(s => s.url !== url)].slice(0, 10);
    setStreamHistory(updated);
    localStorage.setItem('stream_history', JSON.stringify(updated));
  };

  const playStream = () => {
    if (!streamUrl.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a stream URL",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(streamUrl); // Validate URL
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid stream URL",
        variant: "destructive",
      });
      return;
    }

    const channel = {
      id: `direct_${Date.now()}`,
      name: streamName || 'Direct Stream',
      category: 'Direct Stream',
      url: streamUrl,
      isLive: true,
      userAgent,
      referer,
      cookies
    };

    setSelectedChannel(channel);
    setIsPlayerOpen(true);
    saveToHistory(streamUrl, streamName);

    toast({
      title: "Playing Stream",
      description: channel.name,
      duration: 2000,
    });
  };

  const playFromHistory = (historyItem: StreamHistory) => {
    setStreamUrl(historyItem.url);
    setStreamName(historyItem.name || '');
    setUserAgent(historyItem.userAgent || '');
    setReferer(historyItem.referer || '');
    setCookies(historyItem.cookies || '');
    
    const channel = {
      id: `history_${historyItem.id}`,
      name: historyItem.name || 'Direct Stream',
      category: 'Direct Stream',
      url: historyItem.url,
      isLive: true,
      userAgent: historyItem.userAgent,
      referer: historyItem.referer,
      cookies: historyItem.cookies
    };

    setSelectedChannel(channel);
    setIsPlayerOpen(true);

    toast({
      title: "Playing from History",
      description: channel.name,
      duration: 2000,
    });
  };

  const clearHistory = () => {
    setStreamHistory([]);
    localStorage.removeItem('stream_history');
    
    toast({
      title: "History Cleared",
      description: "Stream history has been cleared",
      duration: 2000,
    });
  };

  const removeFromHistory = (streamId: string) => {
    const updated = streamHistory.filter(s => s.id !== streamId);
    setStreamHistory(updated);
    localStorage.setItem('stream_history', JSON.stringify(updated));
  };

  return (
    <Layout>
      <div className="pb-20 lg:pb-4">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Direct Stream
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Play any stream URL directly with advanced options
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Link className="h-4 w-4" />
                <span>Supports M3U8, MPD, MP4 and more formats</span>
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stream Input */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Stream Player
                  </CardTitle>
                  <CardDescription>
                    Enter any stream URL to start playing immediately
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stream-url">Stream URL *</Label>
                    <Input
                      id="stream-url"
                      type="url"
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      placeholder="https://example.com/stream.m3u8"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stream-name">Stream Name (Optional)</Label>
                    <Input
                      id="stream-name"
                      value={streamName}
                      onChange={(e) => setStreamName(e.target.value)}
                      placeholder="My Custom Stream"
                      className="mt-2"
                    />
                  </div>

                  {/* Advanced Options */}
                  <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Options
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="user-agent">User Agent</Label>
                        <Select value={userAgent} onValueChange={setUserAgent}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select or enter custom user agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {presetUserAgents.map((preset) => (
                              <SelectItem key={preset.name} value={preset.value}>
                                {preset.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea
                          value={userAgent}
                          onChange={(e) => setUserAgent(e.target.value)}
                          placeholder="Custom user agent string"
                          className="mt-2"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="referer">Referer</Label>
                        <Input
                          id="referer"
                          value={referer}
                          onChange={(e) => setReferer(e.target.value)}
                          placeholder="https://example.com"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cookies">Cookies</Label>
                        <Textarea
                          id="cookies"
                          value={cookies}
                          onChange={(e) => setCookies(e.target.value)}
                          placeholder="session_id=abc123; auth_token=xyz789"
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Button onClick={playStream} className="w-full" size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Play Stream
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Stream History */}
            <div>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Recent Streams
                    </div>
                    {streamHistory.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearHistory}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Your recently played streams
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {streamHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent streams</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {streamHistory.map((item) => (
                        <div
                          key={item.id}
                          className="group p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => playFromHistory(item)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {item.url}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(item.playedAt).toLocaleString()}
                              </p>
                              {(item.userAgent || item.referer || item.cookies) && (
                                <div className="flex gap-1 mt-2">
                                  {item.userAgent && <Badge variant="outline" className="text-xs">UA</Badge>}
                                  {item.referer && <Badge variant="outline" className="text-xs">Ref</Badge>}
                                  {item.cookies && <Badge variant="outline" className="text-xs">Cookie</Badge>}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromHistory(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          channel={selectedChannel}
          relatedChannels={[]}
          onChannelSelect={() => {}}
        />
      </div>
    </Layout>
  );
};

export default DirectStream;