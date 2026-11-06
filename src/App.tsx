import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { AppSection, LineageDevice, UserPreferences } from './types';
import { applyTheme, initThemeWatcher, ThemeMode } from './lib/theme';
import { puterService } from './lib/puter';
import { fetchDevices } from './lib/api';

import { Header } from './components/layout/Header';
import { NavigationRail } from './components/layout/NavigationRail';
import { BottomNav } from './components/layout/BottomNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { Footer } from './components/layout/Footer';

import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { DeviceExplorer } from './components/devices/DeviceExplorer';
import { RomDownloadCenter } from './components/downloads/RomDownloadCenter';
import { DotOsExplorer } from './components/roms/DotOsExplorer';
import { PixelUiExplorer } from './components/roms/PixelUiExplorer';
import { HistoricalArchiveExplorer } from './components/archive/HistoricalArchiveExplorer';
import { GsiDiscoveryCenter } from './components/gsi/GsiDiscoveryCenter';
import { GsiCompatibilityLab } from './components/gsi/GsiCompatibilityLab';
import { HarmonyRecoveryCenter } from './components/recovery/HarmonyRecoveryCenter';
import { DeveloperToolbox } from './components/toolbox/DeveloperToolbox';
import { InstallationGuides } from './components/guides/InstallationGuides';
import { ReleaseTracker } from './components/releases/ReleaseTracker';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { RomAssistantModal } from './components/assistant/RomAssistantModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedDeviceCodename, setSelectedDeviceCodename] = useState<string>('akita');
  const [selectedDeviceObject, setSelectedDeviceObject] = useState<LineageDevice | null>(null);
  const [archiveTargetDevice, setArchiveTargetDevice] = useState<string>('');
  const [toolboxParams, setToolboxParams] = useState<{
    toolId?: string;
    expectedHash?: string;
    filename?: string;
  }>({});

  const [devices, setDevices] = useState<LineageDevice[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    savedDevices: ['akita', 'alioth', 'aston', 'bramble'],
    bookmarkedBuilds: [],
    personalNotes: {},
  });
  const [user, setUser] = useState<{ username: string; email?: string } | null>(null);

  // Initialize Puter user and preferences
  useEffect(() => {
    puterService.initUser().then((u) => {
      if (u) setUser(u);
    });

    puterService.loadPreferences().then((prefs) => {
      setPreferences(prefs);
      if (prefs.theme) {
        setTheme(prefs.theme);
        applyTheme(prefs.theme);
      }
    });

    fetchDevices()
      .then(setDevices)
      .catch((err) => console.warn('App fetch devices error:', err));

    const cleanup = initThemeWatcher(() => {
      if (theme === 'system') applyTheme('system');
    });

    return cleanup;
  }, []);

  // Update theme
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode =
      theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    const updated = { ...preferences, theme: nextTheme };
    setPreferences(updated);
    puterService.savePreferences(updated);
  };

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Puter Auth Handlers
  const handleSignInPuter = async () => {
    try {
      const signedInUser = await puterService.signIn();
      if (signedInUser) {
        setUser(signedInUser);
        const remotePrefs = await puterService.loadPreferences();
        setPreferences(remotePrefs);
      }
    } catch (err) {
      console.warn('Puter sign in cancelled or error:', err);
    }
  };

  const handleSignOutPuter = async () => {
    await puterService.signOut();
    setUser(null);
  };

  const handleUpdatePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    puterService.savePreferences(newPrefs);
  };

  const handleToggleSaveDevice = (codename: string) => {
    const exists = preferences.savedDevices.includes(codename);
    const updated = {
      ...preferences,
      savedDevices: exists
        ? preferences.savedDevices.filter((c) => c !== codename)
        : [...preferences.savedDevices, codename],
    };
    handleUpdatePreferences(updated);
  };

  const handleToggleBookmarkBuild = (buildInfo: any) => {
    const exists = preferences.bookmarkedBuilds.some((b) => b.filename === buildInfo.filename);
    const updated = {
      ...preferences,
      bookmarkedBuilds: exists
        ? preferences.bookmarkedBuilds.filter((b) => b.filename !== buildInfo.filename)
        : [...preferences.bookmarkedBuilds, buildInfo],
    };
    handleUpdatePreferences(updated);
  };

  // Global Navigation Helper
  const handleNavigate = (section: AppSection, meta?: any) => {
    if (meta?.toolId) {
      setToolboxParams({ toolId: meta.toolId });
    }
    if (meta?.codename) {
      setSelectedDeviceCodename(meta.codename);
    }
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Target jumps
  const handleSelectDeviceForDownload = (codename: string) => {
    setSelectedDeviceCodename(codename);
    setCurrentSection('downloads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDeviceForCompatibility = (device: LineageDevice) => {
    setSelectedDeviceObject(device);
    setSelectedDeviceCodename(device.model);
    setCurrentSection('compatibility');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArchive = (codename: string) => {
    setArchiveTargetDevice(codename);
    setCurrentSection('archive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToVerifier = (expectedHash: string, filename: string) => {
    setToolboxParams({
      toolId: 'verifier',
      expectedHash,
      filename,
    });
    setCurrentSection('toolbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060708] text-slate-900 dark:text-[#f3f4f6] transition-colors selection:bg-teal-500/20">
      {/* Top Bar Header */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        user={user}
        onSignInPuter={handleSignInPuter}
        onSignOutPuter={handleSignOutPuter}
      />

      {/* Main Container with Sidebar Navigation Rail */}
      <div className="flex-1 flex w-full">
        <NavigationRail
          currentSection={currentSection}
          onNavigate={handleNavigate}
          savedCount={preferences.savedDevices.length + preferences.bookmarkedBuilds.length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto min-h-[calc(100vh-140px)]">
          {currentSection === 'dashboard' && (
            <HomeDashboard
              onNavigate={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              onSelectDeviceForDownload={handleSelectDeviceForDownload}
            />
          )}

          {currentSection === 'devices' && (
            <DeviceExplorer
              onSelectDeviceForDownload={handleSelectDeviceForDownload}
              onSelectDeviceForCompatibility={handleSelectDeviceForCompatibility}
              savedDevices={preferences.savedDevices}
              onToggleSaveDevice={handleToggleSaveDevice}
            />
          )}

          {currentSection === 'downloads' && (
            <RomDownloadCenter
              initialCodename={selectedDeviceCodename}
              onNavigateToArchive={handleNavigateToArchive}
              onNavigateToVerifier={handleNavigateToVerifier}
              bookmarkedBuilds={preferences.bookmarkedBuilds}
              onToggleBookmarkBuild={handleToggleBookmarkBuild}
            />
          )}

          {currentSection === 'dotos' && (
            <DotOsExplorer
              onSelectDeviceForDownload={handleSelectDeviceForDownload}
              onNavigateToVerifier={handleNavigateToVerifier}
            />
          )}

          {currentSection === 'pixelui' && (
            <PixelUiExplorer
              onSelectDeviceForDownload={handleSelectDeviceForDownload}
              onNavigateToVerifier={handleNavigateToVerifier}
            />
          )}

          {currentSection === 'archive' && (
            <HistoricalArchiveExplorer
              initialDevice={archiveTargetDevice}
              onNavigateToVerifier={handleNavigateToVerifier}
            />
          )}

          {currentSection === 'gsi' && (
            <GsiDiscoveryCenter
              onNavigateToLab={() => setCurrentSection('compatibility')}
              onNavigateToVerifier={handleNavigateToVerifier}
            />
          )}

          {currentSection === 'compatibility' && (
            <GsiCompatibilityLab
              initialDevice={selectedDeviceObject}
              onNavigateToGsi={() => setCurrentSection('gsi')}
            />
          )}

          {currentSection === 'recovery' && <HarmonyRecoveryCenter />}

          {currentSection === 'toolbox' && (
            <DeveloperToolbox
              initialToolId={toolboxParams.toolId || 'sha256'}
              initialExpectedHash={toolboxParams.expectedHash || ''}
              initialFilename={toolboxParams.filename || ''}
            />
          )}

          {currentSection === 'guides' && <InstallationGuides />}

          {currentSection === 'releases' && <ReleaseTracker />}

          {currentSection === 'bookmarks' && (
            <BookmarksView
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              devices={devices}
              onSelectDeviceForDownload={handleSelectDeviceForDownload}
              isSignedInPuter={!!user}
              username={user?.username}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <BottomNav currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Global Command Search Overlay */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Umbrel Floating ROM Assistant Launcher Button */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-40 w-12 h-12 rounded-full bg-slate-900 dark:bg-[#15181C] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-slate-700/60 dark:border-white/15 hover:border-teal-500/50 group"
        title="Open LineageOS Assistant"
        aria-label="Open LineageOS Assistant"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 dark:ring-[#15181C] animate-pulse" />
        </div>
      </button>

      {/* ROM Assistant Slide-Over Drawer */}
      <RomAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeDeviceCodename={selectedDeviceCodename}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
