import ChannelCard from './ChannelCard';

interface Channel {
  id: string;
  name: string;
  category: string;
  viewers?: string;
  isLive?: boolean;
  isPremium?: boolean;
  image?: string;
}

interface CategorySectionProps {
  title: string;
  channels: Channel[];
  onChannelClick?: (channel: Channel) => void;
}

const CategorySection = ({ title, channels, onChannelClick }: CategorySectionProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {title}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 sm:gap-6 md:gap-8">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              name={channel.name}
              category={channel.category}
              viewers={channel.viewers}
              isLive={channel.isLive}
              isPremium={channel.isPremium}
              image={channel.image}
              onClick={() => onChannelClick?.(channel)}
            />
          ))}
        </div>

        {/* View More Button */}
        {channels.length >= 8 && (
          <div className="flex justify-center mt-8">
            <button className="glass px-6 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-card-secondary transition-all duration-300 hover:scale-105">
              View All {title}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;