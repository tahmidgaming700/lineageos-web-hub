import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  DownloadCloud,
  Layers,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { AppSection } from '../../types';

interface BottomNavProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentSection, onNavigate }) => {
  const items: { id: AppSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'downloads', label: 'ROMs', icon: DownloadCloud },
    { id: 'gsi', label: 'GSI', icon: Layers },
    { id: 'toolbox', label: 'Toolbox', icon: Wrench },
    { id: 'guides', label: 'Guides', icon: BookOpen },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#060708]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'text-slate-900 dark:text-white font-bold'
                : 'text-slate-500 dark:text-[#8E95A0]'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-colors ${
                isActive ? 'bg-slate-200 dark:bg-white/15 text-slate-900 dark:text-white' : 'bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
