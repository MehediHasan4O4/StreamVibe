import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Users, Wifi, Settings, SkipForward, RotateCcw, Download, Share, PictureInPicture } from 'lucide-react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  channel: {
    id: string;
    name: string;
    category: string;
    viewers?: string;
    isLive?: boolean;
  } | null;
  relatedChannels?: Array<{
    id: string;
    name: string;
    category: string;
    viewers?: string;
    isLive?: boolean;
  }>;
  onChannelSelect?: (channel: any) => void;
  videoUrl: string;
}

const VideoPlayer = ({ 
  isOpen, 
  onClose, 
  channel, 
  relatedChannels = [], 
  onChannelSelect,
  videoUrl 
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [showSettings, setShowSettings] = useState(false);
  const [isPip, setIsPip] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

    let hls: Hls | null = null;

    const setupVideo = () => {
      if (videoUrl.endsWith('.m3u8')) {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        } else {
          video.src = videoUrl;
          video.play().catch(() => {});
        }
      } else {
        video.src = videoUrl;
        video.play().catch(() => {});
      }
    };

    setupVideo();

    return () => {
      if (hls) hls.destroy();
      video.pause();
      video.src = '';
    };
  }, [isOpen, videoUrl]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen().catch(console.error);
    }
  };

  const togglePip = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPip(false);
    } else if (videoRef.current) {
      try {
        await videoRef.current.requestPictureInPicture();
        setIsPip(true);
      } catch (error) {
        console.error('PIP error:', error);
      }
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl mx-auto glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-destructive">LIVE</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{channel.name}</h2>
              <p className="text-sm text-muted-foreground">{channel.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {channel.viewers && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{channel.viewers} watching</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black group" ref={containerRef}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
          />
          
          {/* Live Stream Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            <Wifi className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-white">Live Stream</span>
          </div>

          {/* Quality Badge */}
          <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <span className="text-xs font-medium text-white">{quality}</span>
          </div>

          {/* Video Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePip}
                  className="text-white hover:bg-white/20"
                >
                  <PictureInPicture className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Share className="h-4 w-4" />
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-[150px]">
                      <div className="space-y-2">
                        <div className="text-xs text-white/70">Quality</div>
                        <div className="space-y-1">
                          {['Auto', '4K', 'HD', 'SD'].map((q) => (
                            <button
                              key={q}
                              onClick={() => {setQuality(q); setShowSettings(false);}}
                              className={`block w-full text-left text-sm px-2 py-1 rounded hover:bg-white/20 ${quality === q ? 'text-primary' : 'text-white'}`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div className="p-4 bg-card-secondary border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground mb-1">Now Streaming: {channel.name}</h3>
              <p className="text-sm text-muted-foreground">
                High quality live stream • {channel.category} • Free to watch
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">{quality} Quality</span>
            </div>
          </div>
        </div>

        {/* Related Channels */}
        {relatedChannels.length > 0 && (
          <div className="p-4 bg-card">
            <h4 className="text-lg font-semibold text-foreground mb-4">More from {channel?.category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatedChannels.slice(0, 8).map((relatedChannel) => (
                <div
                  key={relatedChannel.id}
                  onClick={() => onChannelSelect?.(relatedChannel)}
                  className="group cursor-pointer bg-card-secondary rounded-lg p-3 transition-all duration-300 hover:bg-card-secondary/80 hover:scale-105"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-2 flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h5 className="text-sm font-medium text-foreground truncate">{relatedChannel.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {relatedChannel.isLive ? 'LIVE' : 'OFFLINE'}
                    </Badge>
                    {relatedChannel.viewers && (
                      <span className="text-xs text-muted-foreground">{relatedChannel.viewers}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
