import React from 'react';
import { Search, Bot, Moon, Sun, Monitor, User, LogOut } from 'lucide-react';
import { AppSection } from '../../types';
import { ThemeMode } from '../../lib/theme';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  user: { username: string; email?: string } | null;
  onSignInPuter: () => void;
  onSignOutPuter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  onOpenSearch,
  onOpenAssistant,
  theme,
  onToggleTheme,
  user,
  onSignInPuter,
  onSignOutPuter,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 bg-[#F8FAFB]/95 dark:bg-[#0F1415]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2 cursor-pointer"
      >
        <span className="w-7 h-7 rounded-lg bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white text-xs font-black shadow-xs">
          L
        </span>
        <span>LineageOS Web Hub</span>
      </button>

      {/* Zone 2: 4-5 Clean Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => onNavigate('devices')}
          className={`hover:text-teal-700 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentSection === 'devices' ? 'text-teal-700 dark:text-teal-400 font-semibold' : ''
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => onNavigate('downloads')}
          className={`hover:text-teal-700 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentSection === 'downloads' ? 'text-teal-700 dark:text-teal-400 font-semibold' : ''
          }`}
        >
          ROM Downloads
        </button>
        <button
          onClick={() => onNavigate('gsi')}
          className={`hover:text-teal-700 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentSection === 'gsi' || currentSection === 'compatibility' ? 'text-teal-700 dark:text-teal-400 font-semibold' : ''
          }`}
        >
          Treble GSI
        </button>
        <button
          onClick={() => onNavigate('toolbox')}
          className={`hover:text-teal-700 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentSection === 'toolbox' ? 'text-teal-700 dark:text-teal-400 font-semibold' : ''
          }`}
        >
          Dev Toolbox
        </button>
        <button
          onClick={() => onNavigate('guides')}
          className={`hover:text-teal-700 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentSection === 'guides' ? 'text-teal-700 dark:text-teal-400 font-semibold' : ''
          }`}
        >
          Guides
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search trigger button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
          title="Search devices, builds, tools (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-sm">
            ⌘K
          </kbd>
        </button>

        {/* ROM Assistant */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800/60 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Ask ROM Assistant"
        >
          <Bot className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="hidden sm:inline">Assistant</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          title={`Theme: ${theme}`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-teal-400" />
          ) : theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Monitor className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Puter User Profile / Sign in */}
        {user ? (
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
            <span
              className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[90px] truncate"
              title={user.username}
            >
              {user.username}
            </span>
            <button
              onClick={onSignOutPuter}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-full transition-colors cursor-pointer"
              title="Sign out of Puter"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignInPuter}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Sign in with Puter for Cloud Sync"
          >
            <User className="w-3.5 h-3.5" />
            <span>Puter Sync</span>
          </button>
        )}

        {/* PWA Install Button */}
        <PWAInstallButton />
      </div>
    </header>
  );
};
