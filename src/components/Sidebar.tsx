

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings as SettingsIcon, 
  Bell, 
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  X,
  ChevronDown,
  ChevronRight,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './UserProfile';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ currentView, onViewChange, onCollapseChange }: SidebarProps) => {
  const { hasPermission } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    management: true,
    reports: true
  });

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'dashboard.view' },
  ];

  const managementItems = [
    { id: 'members', label: 'Members', icon: Users, permission: 'members.view' },
    { id: 'checkin', label: 'Check-In', icon: Calendar, permission: 'checkin.view' },
    { id: 'payments', label: 'Payments', icon: CreditCard, permission: 'payments.view' },
    { id: 'staff', label: 'Staff Management', icon: UserCog, permission: '*' },
  ];

  const reportsItems = [
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'reports.view' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, permission: 'settings.view' },
  ];

  const filterItemsByPermission = (items: any[]) => {
    return items.filter(item => !item.permission || hasPermission(item.permission));
  };

  const renderMenuSection = (title: string, items: any[], sectionKey: keyof typeof expandedSections) => {
    const filteredItems = filterItemsByPermission(items);
    
    if (filteredItems.length === 0) return null;

    if (isCollapsed) {
      return filteredItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={cn(
            "w-full flex items-center justify-center p-3 hover:bg-green-700 transition-all duration-200",
            currentView === item.id && "bg-green-700 border-r-4 border-white"
          )}
          title={item.label}
        >
          <item.icon size={20} />
        </button>
      ));
    }

    return (
      <Collapsible open={expandedSections[sectionKey]} onOpenChange={() => toggleSection(sectionKey)}>
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2 text-green-200 hover:text-white hover:bg-green-700 transition-colors">
          <span className="text-sm font-medium">{title}</span>
          {expandedSections[sectionKey] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center px-6 py-2 text-left hover:bg-green-700 transition-all duration-200",
                currentView === item.id && "bg-green-700 border-r-4 border-white"
              )}
            >
              <item.icon size={18} className="min-w-[18px]" />
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={cn(
      "bg-gradient-to-b from-green-900 to-green-800 text-white fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-10",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-green-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold">FitTrack Pro</h1>
          )}
          <button 
            onClick={handleToggleCollapse}
            className="p-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Users size={20} />
          </button>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 space-y-2">
        {renderMenuSection("Main", mainItems, "main")}
        {renderMenuSection("Management", managementItems, "management")}
        {renderMenuSection("Analytics", reportsItems, "reports")}
      </nav>
      
      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-t border-green-700">
          <UserProfile onViewChange={onViewChange} />
        </div>
      )}
      
      {!isCollapsed && showQuickStats && (
        <div className="flex-shrink-0 p-4">
          <div className="bg-green-700 rounded-lg p-3 text-sm relative">
            <button
              onClick={() => setShowQuickStats(false)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-green-600 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="flex items-center mb-2">
              <Bell size={16} />
              <span className="ml-2 font-medium">Quick Stats</span>
            </div>
            <p className="text-green-200">Active Members: 247</p>
            <p className="text-green-200">Due Today: 12</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

