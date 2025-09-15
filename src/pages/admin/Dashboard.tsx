import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
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
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalChannels: 0,
    activeUsers: 0,
    categories: 0,
    playlists: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }

    // Load dashboard stats
    loadStats();
  }, [navigate]);

  const loadStats = () => {
    // In a real app, this would fetch from your backend/Firebase
    const savedCategories = localStorage.getItem('admin_categories');
    const savedPlaylists = localStorage.getItem('user_playlists');
    
    const categories = savedCategories ? JSON.parse(savedCategories) : [];
    const playlists = savedPlaylists ? JSON.parse(savedPlaylists) : [];
    
    setStats({
      totalChannels: 150, // Mock data
      activeUsers: 45, // Mock data
      categories: categories.length,
      playlists: playlists.length
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/admin');
  };

  const quickActions = [
    {
      title: "Manage Categories",
      description: "Add, edit or remove channel categories",
      icon: Tv,
      action: () => toast({ title: "Feature Coming Soon", description: "Category management will be available soon" })
    },
    {
      title: "User Analytics",
      description: "View user engagement and statistics",
      icon: BarChart3,
      action: () => toast({ title: "Feature Coming Soon", description: "Analytics dashboard will be available soon" })
    },
    {
      title: "App Settings",
      description: "Configure app appearance and behavior",
      icon: Settings,
      action: () => toast({ title: "Feature Coming Soon", description: "App settings will be available soon" })
    },
    {
      title: "Add Playlist",
      description: "Add new channel playlists",
      icon: Plus,
      action: () => navigate('/playlists')
    }
  ];

  const recentActivity = [
    { action: "New user registered", time: "2 minutes ago", type: "user" },
    { action: "Channel playlist updated", time: "15 minutes ago", type: "content" },
    { action: "Category 'Sports' modified", time: "1 hour ago", type: "admin" },
    { action: "System backup completed", time: "2 hours ago", type: "system" }
  ];

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
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Play className="h-4 w-4 mr-2" />
                View App
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalChannels}</div>
              <div className="text-xs text-muted-foreground mt-1">Across all playlists</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.activeUsers}</div>
              <div className="text-xs text-muted-foreground mt-1">Last 24 hours</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.categories}</div>
              <div className="text-xs text-muted-foreground mt-1">Channel categories</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">User Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.playlists}</div>
              <div className="text-xs text-muted-foreground mt-1">Created by users</div>
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
              <CardDescription>Latest system and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'content' ? 'bg-green-500' :
                      activity.type === 'admin' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
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
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-medium text-foreground">API Status</h3>
                <p className="text-sm text-muted-foreground">All systems operational</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-medium text-foreground">Streaming</h3>
                <p className="text-sm text-muted-foreground">99.9% uptime</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-medium text-foreground">Database</h3>
                <p className="text-sm text-muted-foreground">Connected & synced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;