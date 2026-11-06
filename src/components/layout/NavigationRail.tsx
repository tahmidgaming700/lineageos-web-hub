import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  DownloadCloud,
  Archive,
  Layers,
  Cpu,
  ShieldCheck,
  Wrench,
  BookOpen,
  Activity,
  BookmarkCheck,
} from 'lucide-react';
import { AppSection } from '../../types';

interface NavigationRailProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  savedCount: number;
}

interface NavItem {
  id: AppSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentSection,
  onNavigate,
  savedCount,
}) => {
  const items: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices', label: 'Device Explorer', icon: Smartphone },
    { id: 'downloads', label: 'ROM Downloads', icon: DownloadCloud },
    { id: 'archive', label: 'Historical Archives', icon: Archive },
    { id: 'gsi', label: 'Treble GSI', icon: Layers },
    { id: 'compatibility', label: 'Compatibility Lab', icon: Cpu },
    { id: 'recovery', label: 'Harmony Recovery', icon: ShieldCheck },
    { id: 'toolbox', label: 'Dev Toolbox', icon: Wrench },
    { id: 'guides', label: 'Installation Guides', icon: BookOpen },
    { id: 'releases', label: 'Release Tracker', icon: Activity },
    { id: 'bookmarks', label: 'Saved & Notes', icon: BookmarkCheck, badge: savedCount },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#F2F5F6] dark:bg-[#171D1E] border-r border-slate-200 dark:border-slate-800/80 p-3 select-none">
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Android Ecosystem
        </div>
        {items.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-teal-700/15 dark:bg-teal-400/20 text-teal-900 dark:text-teal-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-300' : ''}`} />
              <span className="truncate flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-600 text-white font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-4 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Tools & References
        </div>
        {items.slice(7).map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-teal-700/15 dark:bg-teal-400/20 text-teal-900 dark:text-teal-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-300' : ''}`} />
              <span className="truncate flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-600 text-white font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Disclaimers & Info */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 px-3 text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
        <div>Independent community platform.</div>
        <div className="text-[10px] text-slate-400/80">Powered by Puter.js & Material 3</div>
      </div>
    </aside>
  );
};
