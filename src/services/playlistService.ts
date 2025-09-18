import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { parseM3U } from '@/utils/m3u-parser';

export interface AdminPlaylist {
  id?: string;
  name: string;
  url: string;
  description?: string;
  isActive: boolean;
  channelCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add new playlist
export const addPlaylist = async (playlistData: Omit<AdminPlaylist, 'id' | 'createdAt' | 'updatedAt' | 'channelCount'>) => {
  try {
    // Parse M3U to get channel count
    const channels = await parseM3U(playlistData.url);
    
    const docRef = await addDoc(collection(db, 'playlists'), {
      ...playlistData,
      channelCount: channels.length,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { id: docRef.id, channelCount: channels.length };
  } catch (error) {
    console.error('Error adding playlist:', error);
    throw error;
  }
};

// Get all playlists
export const getPlaylists = async (): Promise<AdminPlaylist[]> => {
  try {
    const q = query(collection(db, 'playlists'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as AdminPlaylist[];
  } catch (error) {
    console.error('Error getting playlists:', error);
    throw error;
  }
};

// Update playlist
export const updatePlaylist = async (id: string, data: Partial<AdminPlaylist>) => {
  try {
    const playlistRef = doc(db, 'playlists', id);
    
    // If URL is being updated, reparse to get new channel count
    let updateData = { ...data, updatedAt: new Date() };
    if (data.url) {
      const channels = await parseM3U(data.url);
      updateData.channelCount = channels.length;
    }
    
    await updateDoc(playlistRef, updateData);
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

// Delete playlist
export const deletePlaylist = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'playlists', id));
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

// Get active playlists for public use
export const getActivePlaylists = async () => {
  try {
    const playlists = await getPlaylists();
    return playlists.filter(playlist => playlist.isActive);
  } catch (error) {
    console.error('Error getting active playlists:', error);
    return [];
  }
};

// Test playlist URL
export const testPlaylistUrl = async (url: string) => {
  try {
    const channels = await parseM3U(url);
    return {
      success: true,
      channelCount: channels.length,
      sampleChannels: channels.slice(0, 3) // Return first 3 channels as sample
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse playlist'
    };
  }
};
