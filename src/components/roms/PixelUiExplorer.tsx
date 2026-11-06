/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DownloadCloud,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Camera,
  Music,
  Cloud,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';
import { PIXEL_UI_BUILDS, PIXEL_UI_HIGHLIGHT_FEATURES } from '../../data/pixeluiData';
import { getDevicePhoto } from '../../lib/deviceImages';
import { PixelUiBuild } from '../../types';

interface PixelUiExplorerProps {
  onSelectDeviceForDownload?: (codename: string) => void;
  onNavigateToVerifier?: (expectedHash: string, filename: string) => void;
}

export const PixelUiExplorer: React.FC<PixelUiExplorerProps> = ({
  onSelectDeviceForDownload,
  onNavigateToVerifier,
}) => {
  const [search, setSearch] = useState('');
  const [selectedBuild, setSelectedBuild] = useState<PixelUiBuild>(PIXEL_UI_BUILDS[0]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredBuilds = PIXEL_UI_BUILDS.filter(
    (b) =>
      b.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.device.toLowerCase().includes(search.toLowerCase()) ||
      b.oem.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-24 text-slate-900 dark:text-white transition-colors">
      {/* Editorial Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-blue-500/10 via-teal-500/10 to-indigo-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Pixel UI & PixelOS Ecosystem</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Pure Google Pixel software. On any hardware.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-[#8E95A0] max-w-2xl leading-relaxed">
          Experience Android the way Google intended: Pixel Launcher with At a Glance, full Material You monetization, unlimited Google Photos cloud backups, Now Playing ambient song identification, and Google Camera HDR+ pipeline.
        </p>
      </div>

      {/* Featured Device Showcase with Real Photography */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3 max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#17191D] relative border border-slate-200 dark:border-white/10 shrink-0">
          <img
            src={getDevicePhoto(selectedBuild.device, selectedBuild.oem)}
            alt={selectedBuild.deviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white">
            {selectedBuild.device}
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-500">
              Featured Pixel Release · {selectedBuild.oem}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {selectedBuild.deviceName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-[#8E95A0]">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedBuild.romName}</span>
              <span>·</span>
              <span>{selectedBuild.version}</span>
              <span>·</span>
              <span>{selectedBuild.fileSize}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">Official Build</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedBuild.features.map((f, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#17191D] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-[#8E95A0]"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href={selectedBuild.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="umbrel-btn-white"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Download {selectedBuild.romName} ({selectedBuild.fileSize})</span>
            </a>

            {selectedBuild.recoveryUrl && (
              <a
                href={selectedBuild.recoveryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="umbrel-btn-pill"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Pixel Recovery</span>
              </a>
            )}

            {selectedBuild.sha256 && onNavigateToVerifier && (
              <button
                onClick={() => onNavigateToVerifier(selectedBuild.sha256!, selectedBuild.filename)}
                className="umbrel-btn-pill"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify SHA-256</span>
              </button>
            )}

            {selectedBuild.sha256 && (
              <button
                onClick={() => handleCopy(selectedBuild.sha256!)}
                className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#1A1D21] transition-colors cursor-pointer text-slate-400 hover:text-white"
                title="Copy SHA-256 Hash"
              >
                {copiedHash === selectedBuild.sha256 ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Signature Pixel UI Features Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Exclusive Pixel Features Included
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIXEL_UI_HIGHLIGHT_FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 space-y-2.5 hover:border-slate-400 dark:hover:border-white/20 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-500">{item.category}</span>
                <span className="text-[11px] text-slate-400">{item.tag}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-[#8E95A0] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Pixel Builds Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official PixelOS & Pixel Experience Builds
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8E95A0]">
              Regularly maintained Android 14 builds passing Google Play Integrity out of the box.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by device or OEM..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-[#17191D] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Device</th>
                <th className="py-3 px-3">Codename</th>
                <th className="py-3 px-3">ROM Name</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredBuilds.map((build) => {
                const isSelected = selectedBuild.id === build.id;
                return (
                  <tr
                    key={build.id}
                    onClick={() => setSelectedBuild(build)}
                    className={`hover:bg-slate-50 dark:hover:bg-[#15171A] cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-500/5 dark:bg-blue-500/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      {build.deviceName}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-teal-600 dark:text-teal-400">
                      {build.device}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                        {build.romName}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-[#8E95A0]">
                      {build.version}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{build.fileSize}</td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <a
                        href={build.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-[11px] hover:opacity-90 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pixel Installation Guide */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#121417] border border-slate-200 dark:border-white/10 space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-500" />
          <span>How to Flash PixelOS</span>
        </h3>
        <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-[#8E95A0] space-y-1.5 leading-relaxed">
          <li>Flash recommended vendor firmware and PixelOS recovery via fastboot: <code className="font-mono bg-black/10 dark:bg-black/40 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">fastboot flash boot boot.img</code> and <code className="font-mono bg-black/10 dark:bg-black/40 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">fastboot flash vendor_boot vendor_boot.img</code> (if required).</li>
          <li>Boot into PixelOS Recovery and perform a factory reset / format data.</li>
          <li>Select "Apply update from ADB" and sideload: <code className="font-mono bg-black/10 dark:bg-black/40 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">adb sideload PixelOS_device-14.0.zip</code></li>
          <li>Reboot to system. Setup your Google account and enjoy native Pixel features on your device!</li>
        </ol>
      </div>
    </div>
  );
};
