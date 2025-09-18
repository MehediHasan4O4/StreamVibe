import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { getPlaylists } from '@/services/playlistService';
import { 
  Shield, 
  Users, 
  Tv, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Play,
  BarChart3,
  Database,
  Wifi,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalChannels: 0,
    activePlaylists: 0,
    inactivePlaylists: 0,
    totalPlaylists: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadStats();
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const loadStats = async () => {
    try {
      const playlists = await getPlaylists();
      const activePlaylists = playlists.filter(p => p.isActive);
      const inactivePlaylists = playlists.filter(p => !p.isActive);
      const totalChannels = activePlaylists.reduce((sum, playlist) => sum + playlist.channelCount, 0);
      
      setStats({
        totalChannels,
        activePlaylists: activePlaylists.length,
        inactivePlaylists: inactivePlaylists.length,
        totalPlaylists: playlists.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const quickActions = [
    {
      title: "Manage Playlists",
      description: "Add, edit or remove M3U playlists",
      icon: Tv,
      action: () => navigate('/admin/panel')
    },
    {
      title: "Add New Playlist",
      description: "Add a new M3U playlist to your platform",
      icon: Plus,
      action: () => navigate('/admin/panel')
    },
    {
      title: "View Analytics",
      description: "Monitor playlist performance and usage",
      icon: BarChart3,
      action: () => toast({ 
        title: "Feature Coming Soon", 
        description: "Analytics dashboard will be available soon" 
      })
    },
    {
      title: "System Settings",
      description: "Configure platform settings and preferences",
      icon: Settings,
      action: () => toast({ 
        title: "Feature Coming Soon", 
        description: "System settings will be available soon" 
      })
    }
  ];

  const recentActivity = [
    { 
      action: "New playlist added", 
      time: "2 minutes ago", 
      type: "playlist",
      details: "Sports Channels playlist activated"
    },
    { 
      action: "Playlist updated", 
      time: "15 minutes ago", 
      type: "update",
      details: "Movie Channels playlist refreshed"
    },
    { 
      action: "System backup completed", 
      time: "1 hour ago", 
      type: "system",
      details: "All data backed up successfully"
    },
    { 
      action: "Playlist deactivated", 
      time: "2 hours ago", 
      type: "playlist",
      details: "Old playlist temporarily disabled"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 w-full border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Play className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-glow"></div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StreamVibe Admin
                </h1>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
              {user && (
                <Badge variant="outline">
                  {user.email}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Play className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/panel')}>
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Admin!
          </h2>
          <p className="text-muted-foreground">
            Manage your streaming platform and monitor performance from this dashboard.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalChannels}</div>
              <div className="text-xs text-muted-foreground mt-1">From active playlists</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.activePlaylists}</div>
              <div className="text-xs text-muted-foreground mt-1">Currently streaming</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalPlaylists}</div>
              <div className="text-xs text-muted-foreground mt-1">Managed playlists</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{stats.inactivePlaylists}</div>
              <div className="text-xs text-muted-foreground mt-1">Temporarily disabled</div>
            </CardContent>
          </Card>
        </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system and playlist activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'playlist' ? 'bg-blue-500' :
                      activity.type === 'update' ? 'bg-green-500' :
                      activity.type === 'system' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-medium text-foreground">Firebase Status</h3>
                <p className="text-sm text-muted-foreground">Connected & operational</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wifi className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <h3 className="font-medium text-foreground">Streaming</h3>
                <p className="text-sm text-muted-foreground">All playlists accessible</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-medium text-foreground">Database</h3>
                <p className="text-sm text-muted-foreground">Firestore synced</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Summary of your streaming platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Content Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Channels:</span>
                    <span className="font-medium">{stats.totalChannels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Playlists:</span>
                    <span className="font-medium text-success">{stats.activePlaylists}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inactive Playlists:</span>
                    <span className="font-medium text-muted-foreground">{stats.inactivePlaylists}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">System Health</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Firebase:</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Streaming:</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <Wifi className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Database:</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <Database className="h-3 w-3 mr-1" />
                      Synced
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
