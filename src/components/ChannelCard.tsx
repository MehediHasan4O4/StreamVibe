import { useState } from 'react';
import { Play, Users, Zap } from 'lucide-react';

interface ChannelCardProps {
  name: string;
  category: string;
  viewers?: string;
  isLive?: boolean;
  isPremium?: boolean;
  image?: string;
  onClick?: () => void;
}

const ChannelCard = ({ 
  name, 
  category, 
  viewers, 
  isLive = true, 
  isPremium = false, 
  image,
  onClick 
}: ChannelCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Card Container */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 glass rounded-full p-1 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 card-shadow">
        {/* Channel Image/Logo */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
          {image && !imageError ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-foreground text-center px-1 leading-tight">
                {name.split(' ').map(word => word[0]).join('').slice(0, 3)}
              </span>
            </div>
          )}
          
          {/* Overlay with Play Button */}
          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <Play className="h-6 w-6 text-primary fill-current animate-pulse" />
          </div>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
            LIVE
          </div>
        )}

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute -top-1 -left-1 bg-gradient-to-r from-primary to-secondary p-1 rounded-full">
            <Zap className="h-3 w-3 text-primary-foreground fill-current" />
          </div>
        )}
      </div>

      {/* Channel Info */}
      <div className="mt-3 text-center">
        <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-tight">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{category}</p>
        
        {/* Viewers Count */}
        {viewers && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{viewers}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelCard;