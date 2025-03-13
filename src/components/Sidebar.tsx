
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileBadge, HelpCircle, FileCheck, BarChart4, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items: SidebarItem[] = [
    {
      icon: <Home size={20} />,
      label: 'Inicio',
      path: '/',
    },
    {
      icon: <Users size={20} />,
      label: 'Detalle Cliente',
      path: '/customer',
    },
    {
      icon: <FileBadge size={20} />,
      label: 'Info Comercial',
      path: '/commercial',
    },
    {
      icon: <HelpCircle size={20} />,
      label: 'Preguntas',
      path: '/faq',
    },
    {
      icon: <FileCheck size={20} />,
      label: 'Contratación',
      path: '/contracting',
    },
    {
      icon: <BarChart4 size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
    },
  ];

  return (
    <div
      className={cn(
        'h-screen bg-sidebar transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <div className="font-semibold text-sidebar-foreground">FinancialApp</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/80 hover:text-sidebar-foreground p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        <nav className="px-2 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path === '/' && location.pathname === '/index');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center py-2.5 px-3 rounded-md transition-colors group",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center", 
                  collapsed ? "w-full" : "w-8"
                )}>
                  {item.icon}
                </div>
                {!collapsed && <span className="ml-2">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            AG
          </div>
          {!collapsed && (
            <div className="text-sm">
              <div className="font-medium text-sidebar-foreground">Adrián García</div>
              <div className="text-sidebar-foreground/70 text-xs">Asesor Financiero</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
