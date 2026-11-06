/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Smartphone,
  ExternalLink,
  DownloadCloud,
  Cpu,
  Bookmark,
  BookmarkCheck,
  Check,
  Filter,
} from 'lucide-react';
import { LineageDevice, CustomRomId } from '../../types';
import { fetchDevices } from '../../lib/api';
import { getDevicePhoto } from '../../lib/deviceImages';

interface DeviceExplorerProps {
  onSelectDeviceForDownload: (codename: string) => void;
  onSelectDeviceForCompatibility: (device: LineageDevice) => void;
  savedDevices: string[];
  onToggleSaveDevice: (codename: string) => void;
}

export const DeviceExplorer: React.FC<DeviceExplorerProps> = ({
  onSelectDeviceForDownload,
  onSelectDeviceForCompatibility,
  savedDevices,
  onToggleSaveDevice,
}) => {
  const [devices, setDevices] = useState<LineageDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOem, setSelectedOem] = useState('all');
  const [selectedArch, setSelectedArch] = useState('all');
  const [selectedRom, setSelectedRom] = useState<'all' | CustomRomId>('all');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchDevices();
        if (mounted) {
          setDevices(data);
        }
      } catch (err) {
        console.warn('Failed loading devices:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute unique OEMs for filtering
  const oemList = ['all', ...Array.from(new Set(devices.map((d) => d.oem))).sort()];

  const filtered = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.model.toLowerCase().includes(search.toLowerCase()) ||
      d.oem.toLowerCase().includes(search.toLowerCase()) ||
      (d.soc && d.soc.toLowerCase().includes(search.toLowerCase()));

    const matchesOem = selectedOem === 'all' || d.oem.toLowerCase() === selectedOem.toLowerCase();
    const matchesArch = selectedArch === 'all' || (d.architecture || 'arm64') === selectedArch;
    const matchesRom =
      selectedRom === 'all' ||
      (d.supportedRoms ? d.supportedRoms.includes(selectedRom) : selectedRom === 'lineageos');

    return matchesSearch && matchesOem && matchesArch && matchesRom;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-900 dark:text-white transition-colors">
      {/* Header & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <span>Device Explorer</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8E95A0]">
          Search over {devices.length || 640} verified Android devices with real product photography, hardware specifications, and multi-ROM support.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by device name, codename (e.g. akita, alioth), or processor..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#17191D] border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedArch}
              onChange={(e) => setSelectedArch(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#17191D] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="all">All Architectures</option>
              <option value="arm64">ARM64 (64-bit)</option>
              <option value="arm">ARM (32-bit)</option>
              <option value="x86_64">x86_64</option>
            </select>
          </div>
        </div>

        {/* ROM Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            ROM Support:
          </span>
          <button
            onClick={() => setSelectedRom('all')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRom === 'all'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-slate-100 dark:bg-[#17191D] text-slate-600 dark:text-[#8E95A0] hover:text-white'
            }`}
          >
            All ROMs
          </button>
          <button
            onClick={() => setSelectedRom('lineageos')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRom === 'lineageos'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#17191D] text-slate-600 dark:text-[#8E95A0] hover:text-white'
            }`}
          >
            LineageOS
          </button>
          <button
            onClick={() => setSelectedRom('dotos')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRom === 'dotos'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#17191D] text-slate-600 dark:text-[#8E95A0] hover:text-white'
            }`}
          >
            dotOS Verified
          </button>
          <button
            onClick={() => setSelectedRom('pixelui')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRom === 'pixelui'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#17191D] text-slate-600 dark:text-[#8E95A0] hover:text-white'
            }`}
          >
            Pixel UI Verified
          </button>
        </div>

        {/* OEM Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {oemList.slice(0, 15).map((oem) => (
            <button
              key={oem}
              onClick={() => setSelectedOem(oem)}
              className={`px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedOem.toLowerCase() === oem.toLowerCase()
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-[#17191D] text-slate-600 dark:text-[#8E95A0] hover:text-white border border-slate-200 dark:border-white/5'
              }`}
            >
              {oem === 'all' ? 'All OEMs' : oem}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8E95A0]">
        <div>
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filtered.length}</span> devices
        </div>
        {(search || selectedRom !== 'all' || selectedOem !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedOem('all');
              setSelectedRom('all');
            }}
            className="text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200 dark:border-white/10"
            />
          ))}
        </div>
      )}

      {/* Device Cards Grid with Real Phone Photos */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((device) => {
            const isSaved = savedDevices.includes(device.model);
            const photoUrl = getDevicePhoto(device.model, device.oem);

            return (
              <div
                key={device.model}
                className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top row with Real Phone Image Thumbnail & Bookmark */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#17191D] relative border border-slate-200 dark:border-white/10 shrink-0">
                      <img
                        src={photoUrl}
                        alt={device.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-500 dark:text-[#8E95A0]">
                        {device.oem}
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight truncate">
                        {device.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-slate-500">
                        <span className="font-bold text-teal-600 dark:text-teal-400">{device.model}</span>
                        <span>·</span>
                        <span>{device.architecture ? device.architecture.toUpperCase() : 'ARM64'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleSaveDevice(device.model)}
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#1A1D21] transition-colors text-slate-400 hover:text-teal-500 cursor-pointer shrink-0"
                      title={isSaved ? 'Remove from saved' : 'Save device'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 fill-teal-600/20" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Multi-ROM Support Badges */}
                  <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20">
                      LineageOS
                    </span>
                    {device.supportedRoms?.includes('dotos') && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/20">
                        dotOS
                      </span>
                    )}
                    {device.supportedRoms?.includes('pixelui') && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                        Pixel UI
                      </span>
                    )}
                  </div>

                  {/* Hardware specs preview */}
                  {(device.cpu || device.ram || device.screen) && (
                    <div className="mt-3.5 text-xs text-slate-500 dark:text-[#8E95A0] space-y-1 border-t border-slate-100 dark:border-white/5 pt-2.5">
                      {device.cpu && (
                        <div className="truncate">
                          <span className="text-slate-400">SoC:</span> {device.cpu}
                        </div>
                      )}
                      {device.screen && (
                        <div className="truncate">
                          <span className="text-slate-400">Display:</span> {device.screen}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDeviceForDownload(device.model)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Get Builds</span>
                  </button>

                  <button
                    onClick={() => onSelectDeviceForCompatibility(device)}
                    className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1D21] transition-colors cursor-pointer"
                    title="Check GSI compatibility for this device"
                  >
                    <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </button>

                  {device.wiki_url && (
                    <a
                      href={device.wiki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1D21] transition-colors"
                      title="View Official LineageOS Wiki documentation"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          <p className="text-sm font-semibold">No devices matched your query.</p>
          <p className="text-xs mt-1 text-slate-400">Try searching with a broader term or different ROM / OEM filter.</p>
        </div>
      )}
    </div>
  );
};
