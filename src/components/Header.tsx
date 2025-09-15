import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchResults?: any[];
  onChannelSelect?: (channel: any) => void;
}

const Header = ({ onSearch, searchResults = [], onChannelSelect }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navItems = [
    { name: 'Live', href: '#', active: true },
    { name: 'Movies', href: '#' },
    { name: 'Series', href: '#' },
    { name: 'Sports', href: '#' },
    { name: 'News', href: '#' },
  ];

  useEffect(() => {
    if (searchQuery && onSearch) {
      onSearch(searchQuery);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery, onSearch]);

  const handleChannelClick = (channel: any) => {
    onChannelSelect?.(channel);
    setSearchQuery('');
    setShowSearch(false);
    setShowResults(false);
  };

  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Play className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-glow"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StreamVibe
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
                  item.active 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Search */}
          <div className="flex items-center gap-4 flex-1 mx-8">
            {showSearch && (
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search channels, movies, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base glass border-border/50 bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-primary/50 rounded-xl"
                  autoFocus
                />
                
                {/* Search Results */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => handleChannelClick(channel)}
                        className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0 transition-colors"
                      >
                        <div className="w-12 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center">
                          <Play className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{channel.name}</div>
                          <div className="text-sm text-muted-foreground">{channel.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col gap-4 pt-4">              
              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      item.active 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;