export interface M3UChannel {
  id: string;
  name: string;
  logo?: string;
  group?: string;
  url: string;
  category: string;
  viewers?: string;
  isLive: boolean;
}

export interface M3UPlaylist {
  name: string;
  url: string;
  channels: M3UChannel[];
}

export const parseM3U = async (url: string): Promise<M3UChannel[]> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const channels: M3UChannel[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('#EXTINF:')) {
        const nextLine = lines[i + 1];
        if (nextLine && !nextLine.startsWith('#')) {
          const info = line.substring(8); // Remove '#EXTINF:'
          
          // Extract channel name (after the comma)
          const commaIndex = info.indexOf(',');
          let name = commaIndex > -1 ? info.substring(commaIndex + 1).trim() : 'Unknown Channel';
          
          // Extract logo from tvg-logo attribute
          const logoMatch = info.match(/tvg-logo="([^"]+)"/);
          const logo = logoMatch ? logoMatch[1] : undefined;
          
          // Extract group from group-title attribute
          const groupMatch = info.match(/group-title="([^"]+)"/);
          const group = groupMatch ? groupMatch[1] : 'General';
          
          // Clean up channel name (remove extra quotes and formatting)
          name = name.replace(/"/g, '').trim();
          
          const channel: M3UChannel = {
            id: `channel_${channels.length + 1}`,
            name,
            logo,
            group,
            url: nextLine,
            category: group || 'General',
            viewers: `${Math.floor(Math.random() * 1000) + 100}K`,
            isLive: true
          };
          
          channels.push(channel);
          i++; // Skip the URL line since we processed it
        }
      }
    }
    
    return channels;
  } catch (error) {
    console.error('Error parsing M3U playlist:', error);
    return [];
  }
};

export const loadPlaylists = async (): Promise<M3UPlaylist[]> => {
  const playlistUrls = [
    {
      name: 'Mix Channels',
      url: 'https://raw.githubusercontent.com/srpremiumbd/SR_PREMIUM_BD/226a25d0bc00dc46d3c5cecc2bf082664b148b41/Mix%20M3u8'
    },
    {
      name: 'NS Player',
      url: 'https://raw.githubusercontent.com/abusaeeidx/Toffee-playlist/refs/heads/main/NS_player.m3u'
    }
  ];
  
  const playlists: M3UPlaylist[] = [];
  
  for (const playlist of playlistUrls) {
    try {
      const channels = await parseM3U(playlist.url);
      playlists.push({
        name: playlist.name,
        url: playlist.url,
        channels
      });
    } catch (error) {
      console.error(`Error loading playlist ${playlist.name}:`, error);
    }
  }
  
  return playlists;
};