import React, { useState, useEffect } from 'react';
import {
  Search,
  Smartphone,
  DownloadCloud,
  Layers,
  Wrench,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { AppSection, LineageDevice } from '../../types';
import { fetchDevices, fetchBuilds } from '../../lib/api';

interface HomeDashboardProps {
  onNavigate: (section: AppSection, meta?: any) => void;
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  onSelectDeviceForDownload: (codename: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenAssistant,
  onSelectDeviceForDownload,
}) => {
  const [deviceCount, setDeviceCount] = useState<number>(641);
  const [recentBuilds, setRecentBuilds] = useState<any[]>([]);
  const [loadingBuilds, setLoadingBuilds] = useState<boolean>(true);

  // Popular devices for quick jumping
  const popularDevices = [
    { name: 'Pixel 8a', codename: 'akita', oem: 'Google', soc: 'Tensor G3' },
    { name: 'POCO F3', codename: 'alioth', oem: 'Xiaomi', soc: 'Snapdragon 870' },
    { name: 'OnePlus 12R', codename: 'aston', oem: 'OnePlus', soc: 'Snapdragon 8 Gen 2' },
    { name: 'Galaxy A52s 5G', codename: 'a52sxq', oem: 'Samsung', soc: 'Snapdragon 778G' },
    { name: 'Redmi Note 10 Pro', codename: 'sweet', oem: 'Xiaomi', soc: 'Snapdragon 732G' },
    { name: 'Pixel 4a (5G)', codename: 'bramble', oem: 'Google', soc: 'Snapdragon 765G' },
  ];

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const devs = await fetchDevices();
        if (mounted && devs.length > 0) {
          setDeviceCount(devs.length);
        }
      } catch (err) {
        console.warn('Dashboard devices fetch:', err);
      }

      // Fetch live recent builds for Google Pixel 8a as a real demonstration
      try {
        const builds = await fetchBuilds('akita');
        if (mounted && builds.length > 0) {
          setRecentBuilds(builds.slice(0, 3));
        }
      } catch (err) {
        console.warn('Dashboard builds fetch:', err);
      } finally {
        if (mounted) setLoadingBuilds(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-900/10 via-teal-800/5 to-transparent border border-teal-500/20 p-6 sm:p-10">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-300">
            <span>Independent Android Community Platform</span>
            <span>·</span>
            <span>Material 3</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            LineageOS Web Hub
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Discover official LineageOS firmware, download verified packages with SHA-256 integrity, explore community Treble GSIs, and utilize browser-based developer utilities.
          </p>

          {/* Quick Search Action */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-300 dark:border-slate-700 shadow-xs hover:border-teal-500 text-slate-500 dark:text-slate-400 text-xs sm:text-sm w-full max-w-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Search by device name, codename, or tool...</span>
              </div>
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onOpenAssistant}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask ROM Assistant</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-teal-500/15">
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {deviceCount}+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Supported Devices</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono tabular-nums text-teal-600 dark:text-teal-400">
              Official
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">LineageOS Build API</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              SHA-256
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Client-Side Verification</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono tabular-nums text-teal-600 dark:text-teal-400">
              Puter.js
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Cloud Storage & AI</div>
          </div>
        </div>
      </section>

      {/* Critical Security & Integrity Notice Banner */}
      <section className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex items-start gap-4 text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-sm">Flashing Safety & Verification Notice</div>
          <p className="leading-relaxed text-amber-800 dark:text-amber-300">
            Flashing custom ROMs, unlocking bootloaders, and modifying partitions carries inherent risks, wipes all personal device data, and may void manufacturer warranties. Always compute and verify the SHA-256 checksum against official published digests before flashing. Devices with Dynamic Partitions must be flashed via <code className="px-1.5 py-0.5 bg-amber-500/20 rounded-md font-mono text-[11px]">fastbootd</code> or verified custom recovery.
          </p>
        </div>
      </section>

      {/* Popular Device Searches */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-teal-600" />
            <span>Popular Devices</span>
          </h2>
          <button
            onClick={() => onNavigate('devices')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All {deviceCount} Devices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {popularDevices.map((dev) => (
            <div
              key={dev.codename}
              onClick={() => onSelectDeviceForDownload(dev.codename)}
              className="p-4 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{dev.oem}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {dev.name}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  codename: <span className="text-teal-700 dark:text-teal-300 font-semibold">{dev.codename}</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/40 text-slate-400 group-hover:text-teal-600 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Modules Bento */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Ecosystem Hubs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ROM Downloads */}
          <div
            onClick={() => onNavigate('downloads')}
            className="p-5 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer space-y-3 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Official ROM Centre</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Query official LineageOS nightlies, recovery images, boot.img, and verify SHA-256 digests.
              </p>
            </div>
            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 pt-1">
              <span>Browse builds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Treble GSI */}
          <div
            onClick={() => onNavigate('gsi')}
            className="p-5 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer space-y-3 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">GSI Discovery & Lab</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Generic System Images from AndyYan and ponces with interactive device architecture matching.
              </p>
            </div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 pt-1">
              <span>Explore GSIs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Developer Toolbox */}
          <div
            onClick={() => onNavigate('toolbox')}
            className="p-5 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-3 shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Android Dev Toolbox</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Client-side SHA-256 calculation, build.prop parsing, Android API level charts, and payload inspectors.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
              <span>Open toolbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Real Builds Preview for Demonstration */}
      {recentBuilds.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Latest Verified Official Builds (Google Pixel 8a)</span>
            </h2>
            <button
              onClick={() => onSelectDeviceForDownload('akita')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              View Full History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentBuilds.map((build, i) => {
              const zipFile = build.files.find((f: any) => f.filename.endsWith('.zip')) || build.files[0];
              const sizeMb = zipFile?.size ? (zipFile.size / (1024 * 1024)).toFixed(0) : 'N/A';
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Build {build.date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono text-[10px]">
                      {build.type || 'nightly'}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate" title={zipFile?.filename}>
                    {zipFile?.filename}
                  </div>
                  <div className="text-slate-500 flex items-center justify-between text-[11px]">
                    <span>Size: {sizeMb} MB</span>
                    <span>SDK {zipFile?.os_sdk_level || 34}</span>
                  </div>
                  {zipFile?.url && (
                    <a
                      href={zipFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block w-full text-center py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
                    >
                      Download Package
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
