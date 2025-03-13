
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
      <div className="flex space-x-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "tab-button",
              activeTab === tab.id ? "active" : ""
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              activeTab === tab.id ? "block" : "hidden"
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
