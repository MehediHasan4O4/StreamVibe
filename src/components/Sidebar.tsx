import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Tv, 
  Film, 
  Trophy, 
  Heart, 
  List, 
  Play,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Live TV', path: '/live', icon: Tv },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Sports', path: '/sports', icon: Trophy },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'My Playlists', path: '/playlists', icon: List },
    { name: 'Direct Stream', path: '/direct', icon: Play },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-border/50 z-40 hidden lg:block">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
      </div>
    </aside>
  );
};

export default Sidebar;