import React, { useState } from 'react';
import {
  BookmarkCheck,
  Smartphone,
  DownloadCloud,
  Trash2,
  ExternalLink,
  Edit3,
  Cloud,
  Save,
  Download,
} from 'lucide-react';
import { UserPreferences, LineageDevice } from '../../types';

interface BookmarksViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  devices: LineageDevice[];
  onSelectDeviceForDownload: (codename: string) => void;
  isSignedInPuter: boolean;
  username?: string;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  preferences,
  onUpdatePreferences,
  devices,
  onSelectDeviceForDownload,
  isSignedInPuter,
  username,
}) => {
  const [activeNoteDevice, setActiveNoteDevice] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');

  const savedDeviceList = devices.filter((d) =>
    preferences.savedDevices.includes(d.model)
  );

  const handleRemoveDevice = (codename: string) => {
    onUpdatePreferences({
      ...preferences,
      savedDevices: preferences.savedDevices.filter((c) => c !== codename),
    });
  };

  const handleRemoveBuild = (filename: string) => {
    onUpdatePreferences({
      ...preferences,
      bookmarkedBuilds: preferences.bookmarkedBuilds.filter((b) => b.filename !== filename),
    });
  };

  const handleOpenNote = (codename: string) => {
    setActiveNoteDevice(codename);
    setNoteContent(preferences.personalNotes[codename] || '');
  };

  const handleSaveNote = () => {
    if (!activeNoteDevice) return;
    onUpdatePreferences({
      ...preferences,
      personalNotes: {
        ...preferences.personalNotes,
        [activeNoteDevice]: noteContent,
      },
    });
    setActiveNoteDevice('');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(preferences, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'lineage_web_hub_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-teal-600" />
            <span>Saved Devices & Bookmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Personal collection of saved devices, bookmarked ROM releases, and hardware notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Cloud Sync indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <Cloud className={`w-3.5 h-3.5 ${isSignedInPuter ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>{isSignedInPuter ? `Puter KV Synced (${username})` : 'Local Browser Storage'}</span>
          </div>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export configuration as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Saved Devices Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-teal-600" />
          <span>Saved Devices ({savedDeviceList.length})</span>
        </h2>

        {savedDeviceList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedDeviceList.map((dev) => {
              const hasNote = !!preferences.personalNotes[dev.model];
              return (
                <div
                  key={dev.model}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs text-slate-400">{dev.oem}</div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {dev.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemoveDevice(dev.model)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove device"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2 text-xs font-mono text-teal-700 dark:text-teal-300">
                      codename: <strong>{dev.model}</strong>
                    </div>

                    {/* Note Preview */}
                    {hasNote && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 italic">
                        "{preferences.personalNotes[dev.model]}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onSelectDeviceForDownload(dev.model)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>View ROMs</span>
                    </button>
                    <button
                      onClick={() => handleOpenNote(dev.model)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs cursor-pointer"
                      title="Add or edit personal device note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No devices saved yet. Click the bookmark icon on any card in the Device Explorer to pin your phone here.
          </div>
        )}
      </div>

      {/* Bookmarked ROM Builds */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <DownloadCloud className="w-4 h-4 text-teal-600" />
          <span>Bookmarked ROM Packages ({preferences.bookmarkedBuilds.length})</span>
        </h2>

        {preferences.bookmarkedBuilds.length > 0 ? (
          <div className="space-y-2.5">
            {preferences.bookmarkedBuilds.map((build, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-300 text-xs">
                      {build.codename}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{build.date}</span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white mt-0.5 truncate max-w-lg">
                    {build.filename}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {build.url && (
                    <a
                      href={build.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleRemoveBuild(build.filename)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No ROM packages bookmarked. Click the bookmark icon on any build in the ROM Download Centre.
          </div>
        )}
      </div>

      {/* Note Editing Modal */}
      {activeNoteDevice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#1B2122] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Hardware Notes for {activeNoteDevice}
            </h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="e.g. Requires Magisk v27.0 with zygisk-lsposed. Stock firmware needed: V14.0.5.0."
              rows={4}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveNoteDevice('')}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
