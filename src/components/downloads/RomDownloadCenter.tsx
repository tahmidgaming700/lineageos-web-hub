import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  Search,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Archive,
  AlertCircle,
  FileCode,
  HardDrive,
  Calendar,
  Layers,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { LineageBuild, LineageDevice } from '../../types';
import { fetchBuilds, fetchDevices } from '../../lib/api';

interface RomDownloadCenterProps {
  initialCodename?: string;
  onNavigateToArchive: (codename: string) => void;
  onNavigateToVerifier: (expectedHash: string, filename: string) => void;
  bookmarkedBuilds: any[];
  onToggleBookmarkBuild: (buildInfo: any) => void;
}

export const RomDownloadCenter: React.FC<RomDownloadCenterProps> = ({
  initialCodename = 'akita',
  onNavigateToArchive,
  onNavigateToVerifier,
  bookmarkedBuilds,
  onToggleBookmarkBuild,
}) => {
  const [deviceCodename, setDeviceCodename] = useState<string>(initialCodename);
  const [searchInput, setSearchInput] = useState<string>(initialCodename);
  const [availableDevices, setAvailableDevices] = useState<LineageDevice[]>([]);
  const [builds, setBuilds] = useState<LineageBuild[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices()
      .then(setAvailableDevices)
      .catch((err) => console.warn('Failed to load device list:', err));
  }, []);

  useEffect(() => {
    if (initialCodename) {
      setDeviceCodename(initialCodename);
      setSearchInput(initialCodename);
    }
  }, [initialCodename]);

  useEffect(() => {
    if (!deviceCodename) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchBuilds(deviceCodename)
      .then((data) => {
        if (mounted) {
          setBuilds(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Could not load official builds for this device');
          setBuilds([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [deviceCodename]);

  const handleSelectDevice = (code: string) => {
    setDeviceCodename(code);
    setSearchInput(code);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const currentDevice = availableDevices.find(
    (d) => d.model.toLowerCase() === deviceCodename.toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <DownloadCloud className="w-6 h-6 text-teal-600" />
          <span>ROM Download Centre</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Direct upstream access to official LineageOS nightlies, SHA-256 checksums, and recovery images.
        </p>
      </div>

      {/* Device Picker Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Target Device Selection
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput.trim()) {
                  handleSelectDevice(searchInput.trim());
                }
              }}
              placeholder="Enter device codename (e.g. akita, alioth, aston, shiba)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => searchInput.trim() && handleSelectDevice(searchInput.trim())}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Query
            </button>
          </div>

          {/* Quick select popular codenames */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {['akita', 'alioth', 'aston', 'bramble', 'sweet', 'shiba'].map((code) => (
              <button
                key={code}
                onClick={() => handleSelectDevice(code)}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  deviceCodename.toLowerCase() === code
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Current Device Profile Bar */}
        {currentDevice && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {currentDevice.name}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{currentDevice.oem}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-teal-700 dark:text-teal-300">{currentDevice.model}</span>
            </div>

            {currentDevice.wiki_url && (
              <a
                href={currentDevice.wiki_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                <span>Device Installation Wiki</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Contacting download.lineageos.org API for {deviceCodename}...</div>
        </div>
      )}

      {/* Error / Missing Official Builds */}
      {!loading && (error || builds.length === 0) && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Current Official LineageOS Nightlies Found for "{deviceCodename}"
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              LineageOS only maintains current nightlies for active build targets. Older or legacy devices are archived.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigateToArchive(deviceCodename)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              <span>Search Historical Archive for {deviceCodename}</span>
            </button>
          </div>
        </div>
      )}

      {/* Builds List */}
      {!loading && builds.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500">
            Available Builds ({builds.length})
          </div>

          {builds.map((build, index) => {
            const romZip = build.files.find((f) => f.filename.endsWith('.zip')) || build.files[0];
            const companionFiles = build.files.filter((f) => f.filename !== romZip.filename);
            const isBookmarked = bookmarkedBuilds.some((b) => b.filename === romZip.filename);

            const romSizeFormatted = romZip.size
              ? (romZip.size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
              : 'Unknown';

            return (
              <div
                key={build.datetime || index}
                className="p-5 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                {/* Build Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Build Date: {build.date}
                      </span>
                      <span className="text-slate-400 text-xs ml-2">
                        ({build.type || 'nightly'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {romZip.os_patch_level && (
                      <span className="text-xs text-slate-500">
                        Patch: {romZip.os_patch_level}
                      </span>
                    )}
                    <button
                      onClick={() =>
                        onToggleBookmarkBuild({
                          codename: deviceCodename,
                          filename: romZip.filename,
                          version: build.version || 'Nightly',
                          date: build.date,
                          url: romZip.url,
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark build'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-teal-600 fill-teal-600/20" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary ROM ZIP Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>ROM Installation ZIP</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                        {romZip.filename}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Size: {romSizeFormatted} · SDK Level: {romZip.os_sdk_level || 34}
                      </div>
                    </div>

                    {/* Download Button */}
                    {romZip.url && (
                      <a
                        href={romZip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        <span>Download ROM</span>
                      </a>
                    )}
                  </div>

                  {/* SHA-256 Digest Bar */}
                  {romZip.sha256 && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#171D1E] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">SHA-256:</span>
                        <code className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate select-all">
                          {romZip.sha256}
                        </code>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopy(romZip.sha256!)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          {copiedHash === romZip.sha256 ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onNavigateToVerifier(romZip.sha256!, romZip.filename)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-200 transition-colors cursor-pointer"
                          title="Open in Developer Toolbox file verifier"
                        >
                          <span>Verify with File</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Companion Images (Recovery, boot.img, vendor_boot.img) */}
                {companionFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Companion Flash Images ({companionFiles.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {companionFiles.map((comp) => {
                        const compSize = comp.size
                          ? (comp.size / (1024 * 1024)).toFixed(1) + ' MB'
                          : '';
                        return (
                          <div
                            key={comp.filename}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#171D1E] flex items-center justify-between text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                {comp.filename}
                              </div>
                              <div className="text-[10px] text-slate-400">{compSize}</div>
                            </div>
                            {comp.url && (
                              <a
                                href={comp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white transition-colors text-slate-600 dark:text-slate-300 shrink-0"
                                title={`Download ${comp.filename}`}
                              >
                                <DownloadCloud className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
