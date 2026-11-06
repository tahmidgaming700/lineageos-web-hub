import React from 'react';
import { Search, Bot, Moon, Sun, Monitor, User, LogOut, Bookmark } from 'lucide-react';
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
  savedCount?: number;
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
  savedCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-6 px-4 sm:px-8 py-3.5 bg-white/85 dark:bg-[#060708]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors">
      {/* Zone 1: Umbrel-Style Minimalist Brand Mark */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2.5 cursor-pointer"
      >
        {/* Sleek Lineage / Umbrel-inspired curved insignia */}
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-teal-600 to-cyan-400 flex items-center justify-center text-white shadow-xs">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 0-10 10c0 4.4 2.8 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.8 9.8 0 0 1 5.2 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12A10 10 0 0 0 12 2z" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold tracking-tight leading-tight">DroidROM Hub</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-normal -mt-0.5">Lineage · dotOS · Pixel UI</span>
        </div>
      </button>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-[#8E95A0]">
        <button
          onClick={() => onNavigate('devices')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
            currentSection === 'devices' ? 'text-slate-900 dark:text-white font-bold' : ''
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => onNavigate('downloads')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
            currentSection === 'downloads' ? 'text-slate-900 dark:text-white font-bold' : ''
          }`}
        >
          Downloads
        </button>
        <button
          onClick={() => onNavigate('dotos')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
            currentSection === 'dotos' ? 'text-red-500 font-bold' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>dotOS</span>
        </button>
        <button
          onClick={() => onNavigate('pixelui')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
            currentSection === 'pixelui' ? 'text-blue-500 font-bold' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Pixel UI</span>
        </button>
        <button
          onClick={() => onNavigate('gsi')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
            currentSection === 'gsi' || currentSection === 'compatibility' ? 'text-slate-900 dark:text-white font-bold' : ''
          }`}
        >
          Treble GSI
        </button>
        <button
          onClick={() => onNavigate('toolbox')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
            currentSection === 'toolbox' ? 'text-slate-900 dark:text-white font-bold' : ''
          }`}
        >
          Toolbox
        </button>
        <button
          onClick={() => onNavigate('guides')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
            currentSection === 'guides' ? 'text-slate-900 dark:text-white font-bold' : ''
          }`}
        >
          Guides
        </button>
      </nav>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#15171A] hover:bg-slate-200 dark:hover:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-full transition-colors cursor-pointer"
          title="Search devices & builds (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline text-[9px] font-mono px-1 py-0.2 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-sm">
            ⌘K
          </kbd>
        </button>

        {/* Bookmarks Counter Button */}
        <button
          onClick={() => onNavigate('bookmarks')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-[#15171A] hover:bg-slate-200 dark:hover:bg-[#1E2226] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          title="View saved devices & bookmarks"
        >
          <Bookmark className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-mono text-[11px]">{savedCount}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E2226] border border-transparent dark:border-white/5 transition-colors cursor-pointer"
          title={`Theme: ${theme}`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-slate-200" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Puter User Profile */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
            <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[80px] truncate">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-[#15171A] hover:bg-slate-200 dark:hover:bg-[#1E2226] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            title="Sign in with Puter"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Puter Sync</span>
          </button>
        )}

        {/* PWA Install Button */}
        <PWAInstallButton />
      </div>
    </header>
  );
};
