import { ReactNode } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  searchResults?: any[];
  onChannelSelect?: (channel: any) => void;
}

const Layout = ({ children, onSearch, searchResults, onChannelSelect }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={onSearch}
        searchResults={searchResults}
        onChannelSelect={onChannelSelect}
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Layout;