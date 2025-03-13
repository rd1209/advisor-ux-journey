
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabViewProps {
  tabs: {
    id: string;
    label: React.ReactNode;
    content: React.ReactNode;
  }[];
  className?: string;
}

const TabView: React.FC<TabViewProps> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in transition-all">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-opacity duration-200",
              activeTab === tab.id ? "block opacity-100" : "hidden opacity-0"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabView;
