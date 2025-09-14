import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import { useToast } from '@/components/ui/use-toast';

// Sample data for different categories
const sportsChannels = [
  { id: '1', name: 'Sports Network 1', category: 'Sports', viewers: '45K', isLive: true, isPremium: false },
  { id: '2', name: 'Football Central', category: 'Football', viewers: '38K', isLive: true, isPremium: true },
  { id: '3', name: 'Basketball Live', category: 'Basketball', viewers: '29K', isLive: true, isPremium: false },
  { id: '4', name: 'Tennis Channel', category: 'Tennis', viewers: '15K', isLive: true, isPremium: false },
  { id: '5', name: 'Olympics 2024', category: 'Olympics', viewers: '62K', isLive: true, isPremium: true },
  { id: '6', name: 'Cricket World', category: 'Cricket', viewers: '41K', isLive: true, isPremium: false },
  { id: '7', name: 'Racing Network', category: 'Racing', viewers: '23K', isLive: true, isPremium: false },
  { id: '8', name: 'Golf Masters', category: 'Golf', viewers: '18K', isLive: true, isPremium: true },
];

const movieChannels = [
  { id: '9', name: 'Action Movies', category: 'Action', viewers: '52K', isLive: true, isPremium: false },
  { id: '10', name: 'Comedy Central', category: 'Comedy', viewers: '34K', isLive: true, isPremium: false },
  { id: '11', name: 'Drama Plus', category: 'Drama', viewers: '28K', isLive: true, isPremium: true },
  { id: '12', name: 'Sci-Fi Network', category: 'Sci-Fi', viewers: '31K', isLive: true, isPremium: false },
  { id: '13', name: 'Horror Zone', category: 'Horror', viewers: '19K', isLive: true, isPremium: true },
  { id: '14', name: 'Classic Cinema', category: 'Classic', viewers: '22K', isLive: true, isPremium: false },
  { id: '15', name: 'Family Movies', category: 'Family', viewers: '37K', isLive: true, isPremium: false },
  { id: '16', name: 'Indie Films', category: 'Independent', viewers: '14K', isLive: true, isPremium: true },
];

const entertainmentChannels = [
  { id: '17', name: 'Music Videos', category: 'Music', viewers: '41K', isLive: true, isPremium: false },
  { id: '18', name: 'Reality TV', category: 'Reality', viewers: '33K', isLive: true, isPremium: false },
  { id: '19', name: 'Game Shows', category: 'Games', viewers: '26K', isLive: true, isPremium: false },
  { id: '20', name: 'Talk Shows', category: 'Talk', viewers: '29K', isLive: true, isPremium: false },
  { id: '21', name: 'Variety Show', category: 'Variety', viewers: '24K', isLive: true, isPremium: true },
  { id: '22', name: 'Awards Live', category: 'Awards', viewers: '48K', isLive: true, isPremium: true },
  { id: '23', name: 'Celebrity News', category: 'News', viewers: '17K', isLive: true, isPremium: false },
  { id: '24', name: 'Lifestyle TV', category: 'Lifestyle', viewers: '21K', isLive: true, isPremium: false },
];

const newsChannels = [
  { id: '25', name: 'Global News', category: 'World News', viewers: '67K', isLive: true, isPremium: false },
  { id: '26', name: 'Business Today', category: 'Business', viewers: '32K', isLive: true, isPremium: true },
  { id: '27', name: 'Tech Updates', category: 'Technology', viewers: '28K', isLive: true, isPremium: false },
  { id: '28', name: 'Weather Live', category: 'Weather', viewers: '19K', isLive: true, isPremium: false },
  { id: '29', name: 'Local News', category: 'Local', viewers: '35K', isLive: true, isPremium: false },
  { id: '30', name: 'Health News', category: 'Health', viewers: '22K', isLive: true, isPremium: false },
  { id: '31', name: 'Breaking News', category: 'Breaking', viewers: '54K', isLive: true, isPremium: true },
  { id: '32', name: 'Political Desk', category: 'Politics', viewers: '39K', isLive: true, isPremium: false },
];

const Index = () => {
  const { toast } = useToast();

  const handleChannelClick = (channel: any) => {
    if (channel.isPremium) {
      toast({
        title: "Premium Content",
        description: `${channel.name} requires a premium subscription to watch.`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Now Playing",
        description: `Streaming ${channel.name} - ${channel.viewers} viewers watching`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Live Channels Categories */}
        <div className="space-y-4">
          <CategorySection
            title="Sports Channels"
            channels={sportsChannels}
            onChannelClick={handleChannelClick}
          />

          <CategorySection
            title="Movie Channels"
            channels={movieChannels}
            onChannelClick={handleChannelClick}
          />

          <CategorySection
            title="Entertainment Channels"
            channels={entertainmentChannels}
            onChannelClick={handleChannelClick}
          />

          <CategorySection
            title="News & Information"
            channels={newsChannels}
            onChannelClick={handleChannelClick}
          />
        </div>

        {/* Footer Section */}
        <footer className="glass border-t border-border/50 mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                StreamVibe
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your ultimate destination for premium streaming content. Watch anywhere, anytime.
              </p>
              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">About</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Support</a>
              </div>
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  © 2024 StreamVibe. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;