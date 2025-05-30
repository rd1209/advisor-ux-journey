
import React from 'react';
import Sidebar from './Sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ChatWidget } from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <SidebarInset className="flex-1 overflow-y-auto">
          {children}
        </SidebarInset>
        <ChatWidget />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
