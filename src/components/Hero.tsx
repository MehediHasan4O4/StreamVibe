import { Button } from '@/components/ui/button';
import { Play, Sparkles, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">Premium Streaming Experience</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Stream Your
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent block sm:inline sm:ml-4">
              Favorite Content
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover thousands of movies, TV shows, live sports, and premium channels. 
            Stream anywhere, anytime with crystal clear quality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="default" size="lg" className="text-base px-8 py-6 h-auto">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Start Watching Free
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto">
              Browse Channels
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Movies & Shows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">200+</div>
              <div className="text-sm text-muted-foreground">Live Channels</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-5 w-5 text-success" />
                <div className="text-2xl sm:text-3xl font-bold text-primary">4K</div>
              </div>
              <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;