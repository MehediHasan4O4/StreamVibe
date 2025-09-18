import { getActivePlaylists } from '@/services/playlistService';

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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
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
          
          // Extract tvg-id for better identification
          const tvgIdMatch = info.match(/tvg-id="([^"]+)"/);
          const tvgId = tvgIdMatch ? tvgIdMatch[1] : null;
          
          // Clean up channel name (remove extra quotes and formatting)
          name = name.replace(/"/g, '').trim();
          
          // Generate unique ID
          const channelId = tvgId || `channel_${channels.length + 1}_${Date.now()}`;
          
          const channel: M3UChannel = {
            id: channelId,
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
    throw new Error(`Failed to parse M3U playlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Load playlists ONLY from Firebase Admin Panel
export const loadPlaylists = async (): Promise<M3UPlaylist[]> => {
  try {
    // Get active playlists from Firebase ONLY
    const adminPlaylists = await getActivePlaylists();
    
    if (adminPlaylists.length === 0) {
      console.log('No active playlists found in admin panel');
      return [];
    }
    
    const playlists: M3UPlaylist[] = [];
    
    for (const playlist of adminPlaylists) {
      try {
        const channels = await parseM3U(playlist.url);
        playlists.push({
          name: playlist.name,
          url: playlist.url,
          channels
        });
      } catch (error) {
        console.error(`Error loading playlist ${playlist.name}:`, error);
        // Continue with other playlists even if one fails
      }
    }
    
    return playlists;
  } catch (error) {
    console.error('Error loading playlists from Firebase:', error);
    return []; // Return empty array if Firebase fails
  }
};

// Validate M3U URL format
export const validateM3UUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:'];
    const validExtensions = ['.m3u', '.m3u8'];
    
    if (!validProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    const pathname = urlObj.pathname.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    const isRawGithub = urlObj.hostname === 'raw.githubusercontent.com';
    
    return hasValidExtension || isRawGithub;
  } catch {
    return false;
  }
};
