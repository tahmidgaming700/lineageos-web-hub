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
  Calendar,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
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
    <div className="space-y-8 max-w-5xl mx-auto pb-20 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Downloads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8E95A0]">
          Direct upstream official builds from <code className="font-mono text-teal-600 dark:text-teal-400">download.lineageos.org</code> with SHA-256 integrity digests.
        </p>
      </div>

      {/* Target Device Selector Bar (Umbrel dark card style) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E95A0]">
          Target Device Hardware
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput.trim()) {
                  handleSelectDevice(searchInput.trim());
                }
              }}
              placeholder="Enter device codename (e.g. akita, alioth, aston, bramble)..."
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-100 dark:bg-[#17191D] border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 text-slate-900 dark:text-white"
            />
            <button
              onClick={() => searchInput.trim() && handleSelectDevice(searchInput.trim())}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
            >
              Select
            </button>
          </div>

          {/* Quick select pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {['akita', 'alioth', 'aston', 'bramble', 'sweet', 'shiba'].map((code) => (
              <button
                key={code}
                onClick={() => handleSelectDevice(code)}
                className={`px-3 py-2 rounded-full font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  deviceCodename.toLowerCase() === code
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-[#17191D] text-slate-600 dark:text-[#8E95A0] hover:text-white border border-slate-200 dark:border-white/5'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Current Device Details Strip */}
        {currentDevice && (
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {currentDevice.name}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{currentDevice.oem}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{currentDevice.model}</span>
              {currentDevice.cpu && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{currentDevice.cpu}</span>
                </>
              )}
            </div>

            {currentDevice.wiki_url && (
              <a
                href={currentDevice.wiki_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                <span>Device Wiki & Specs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-16 text-center text-xs text-slate-500 dark:text-[#8E95A0] space-y-3">
          <div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Contacting official LineageOS build cluster for {deviceCodename}...</div>
        </div>
      )}

      {/* Missing official nightlies message */}
      {!loading && (error || builds.length === 0) && (
        <div className="p-10 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-xs">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Current Official Nightlies for "{deviceCodename}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8E95A0] max-w-md mx-auto leading-relaxed">
              LineageOS only builds current nightlies for active branches. Discontinued devices are preserved in the TimSchumi Historical Archive.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigateToArchive(deviceCodename)}
              className="umbrel-btn-white"
            >
              <Archive className="w-4 h-4" />
              <span>Search Historical Archive for {deviceCodename}</span>
            </button>
          </div>
        </div>
      )}

      {/* Builds List in Umbrel Card Format */}
      {!loading && builds.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 dark:text-[#8E95A0] uppercase tracking-wider">
            Available Nightly Releases ({builds.length})
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
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#1A1D21] flex items-center justify-center text-lg shrink-0">
                      📱
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        LineageOS {build.version || '21.0'} Nightly · {build.date}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-[#8E95A0] font-mono mt-0.5">
                        {deviceCodename} · SDK {romZip.os_sdk_level || 34} · Patch {romZip.os_patch_level || 'Latest'}
                      </div>
                    </div>
                  </div>

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
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 hover:text-teal-500 cursor-pointer"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark build'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-teal-600 fill-teal-600/20" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Primary ROM Image metadata & Pill Buttons */}
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-mono">
                    ROM ZIP · {romSizeFormatted} · Signed Official Package
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {romZip.url && (
                      <a
                        href={romZip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="umbrel-btn-pill bg-black dark:bg-[#1A1D21] text-white"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        <span>Download LineageOS 21.0</span>
                      </a>
                    )}

                    {/* Quick Companion Flash Images */}
                    {companionFiles.slice(0, 2).map((comp) => (
                      <a
                        key={comp.filename}
                        href={comp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="umbrel-btn-pill"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        <span>{comp.filename}</span>
                      </a>
                    ))}

                    <button
                      onClick={() => onNavigateToVerifier(romZip.sha256 || '', romZip.filename)}
                      className="text-xs font-semibold text-slate-600 dark:text-[#8E95A0] hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Verify Checksum</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SHA-256 Digest Bar */}
                {romZip.sha256 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#14171A] border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-mono text-[10px] text-slate-500 uppercase font-bold shrink-0">SHA-256:</span>
                      <code className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate select-all">
                        {romZip.sha256}
                      </code>
                    </div>

                    <button
                      onClick={() => handleCopy(romZip.sha256!)}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
                    >
                      {copiedHash === romZip.sha256 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
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
