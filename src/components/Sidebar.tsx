
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
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-item',
                location.pathname === item.path && 'active',
                collapsed && 'justify-center px-0'
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary-foreground">
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
