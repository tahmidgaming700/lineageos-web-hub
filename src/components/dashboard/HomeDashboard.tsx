/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Smartphone,
  HardDrive,
  Cpu,
  Layers,
  Archive,
  Terminal,
  Shield,
  Lock,
  Zap,
  Check,
  Palette,
} from 'lucide-react';
import { AppSection } from '../../types';
import { fetchDevices, fetchBuilds } from '../../lib/api';
import {
  HERO_ROM_TRIO_IMAGE,
  PIXEL_PHONE_IMAGE,
  POCO_PHONE_IMAGE,
  ONEPLUS_PHONE_IMAGE,
  SAMSUNG_PHONE_IMAGE,
} from '../../lib/deviceImages';

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

  useEffect(() => {
    let mounted = true;

    fetchDevices()
      .then((devs) => {
        if (mounted && devs.length > 0) setDeviceCount(devs.length);
      })
      .catch((err) => console.warn('Dashboard devices fetch error:', err));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-20 max-w-5xl mx-auto pb-24 text-slate-900 dark:text-white transition-colors">
      {/* =========================================================================
          SECTION 1: HERO (Umbrel "Install on your own hardware" with Real Phones Hero)
          ========================================================================= */}
      <section className="text-center pt-6 sm:pt-10 space-y-6">
        {/* Version Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#15171a] border border-slate-300/80 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>DroidROM Web Hub · LineageOS · dotOS · Pixel UI</span>
        </div>

        {/* Big Bold Headline */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-balance">
            Install Custom Android<br />
            <span className="text-slate-500 dark:text-[#8E95A0] font-normal">on your</span><br />
            own hardware.
          </h1>
        </div>

        {/* Subhead */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#8E95A0] leading-relaxed">
          The unified platform for discovering official LineageOS nightlies, dotOS bespoke aesthetic releases, Pixel UI Tensor experiences, and Project Treble GSIs with cryptographic hash validation.
        </p>

        {/* Real Phone Trio Studio Showcase */}
        <div className="pt-2 max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-[#060708]">
            <img
              src={HERO_ROM_TRIO_IMAGE}
              alt="LineageOS, dotOS, and Pixel UI on real Android flagship smartphones"
              className="w-full aspect-16/9 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 w-full text-white text-xs">
                <div className="flex items-center gap-4">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    LineageOS 21.0
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    dotOS Bespoke v5.2
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Pixel UI & PixelOS
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('downloads')}
                  className="umbrel-btn-white text-xs px-3.5 py-1.5"
                >
                  Browse All Builds →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Three Ecosystem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left pt-4">
          {/* Card 1: LineageOS */}
          <div
            onClick={() => onNavigate('downloads')}
            className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3 cursor-pointer hover:border-teal-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              LOS
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                LineageOS Official
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8E95A0] mt-1.5 leading-relaxed">
                Clean, unbloated AOSP with privacy protection, monthly security bulletins, and verified hardware maintenance.
              </p>
            </div>
          </div>

          {/* Card 2: dotOS */}
          <div
            onClick={() => onNavigate('dotos')}
            className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3 cursor-pointer hover:border-red-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
              dot
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
                dotOS Bespoke UI
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8E95A0] mt-1.5 leading-relaxed">
                Handcrafted Control Center, circular settings hierarchy, artistic lockscreens, and dynamic accent monetization.
              </p>
            </div>
          </div>

          {/* Card 3: Pixel UI */}
          <div
            onClick={() => onNavigate('pixelui')}
            className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3 cursor-pointer hover:border-blue-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              PX
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Pixel UI & PixelOS
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8E95A0] mt-1.5 leading-relaxed">
                Native Pixel Launcher, At a Glance, unlimited Google Photos cloud backups, and offline Now Playing music ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "What will our ROMs run on?" (Bento Grid with Real Phone Photography)
          ========================================================================= */}
      <section className="space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          What will our ROMs run on?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Bento Card 1: Google Pixel */}
          <div
            onClick={() => onSelectDeviceForDownload('akita')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 sm:h-60 group shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#181B1F] border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
              <img src={PIXEL_PHONE_IMAGE} alt="Google Pixel" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Google Pixel
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                Pixel 8a, 8 Pro, 7a, 6, 5 & 4a
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">
                LineageOS · dotOS · PixelOS
              </div>
            </div>
          </div>

          {/* Bento Card 2: Xiaomi & POCO */}
          <div
            onClick={() => onSelectDeviceForDownload('alioth')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 sm:h-60 group shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#181B1F] border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
              <img src={POCO_PHONE_IMAGE} alt="Xiaomi and POCO" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Xiaomi & POCO
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                POCO F3, X3 Pro, Redmi Note 10 Pro
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">
                LineageOS · dotOS · PixelOS
              </div>
            </div>
          </div>

          {/* Bento Card 3: OnePlus Flagships */}
          <div
            onClick={() => onSelectDeviceForDownload('aston')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 sm:h-60 group shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#181B1F] border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
              <img src={ONEPLUS_PHONE_IMAGE} alt="OnePlus Flagships" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                OnePlus Flagships
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                OnePlus 12R, 9 Pro, 8T, 7 Pro
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">
                LineageOS · dotOS · PixelOS
              </div>
            </div>
          </div>

          {/* Bento Card 4: Samsung Galaxy */}
          <div
            onClick={() => onSelectDeviceForDownload('a52sxq')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 sm:h-60 group shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#181B1F] border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
              <img src={SAMSUNG_PHONE_IMAGE} alt="Samsung Galaxy" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Samsung Galaxy
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                A52s 5G, S10, Note 10, S9
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">
                LineageOS · PixelOS Ports
              </div>
            </div>
          </div>

          {/* Bento Card 5: Treble GSI */}
          <div
            onClick={() => onNavigate('gsi')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 sm:h-60 group shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🧩
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Treble GSI
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                Generic System Images (ARM64)
              </div>
              <div className="text-[10px] text-amber-500 font-bold mt-1">
                Any Treble-compliant device
              </div>
            </div>
          </div>

          {/* Bento Card 6: Something else? */}
          <div
            onClick={() => onNavigate('devices')}
            className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-[#14171A] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 sm:h-60 group shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-[#202428] flex items-center justify-center text-2xl text-teal-600 group-hover:scale-105 transition-transform">
              🔍
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Something else?
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                Browse all {deviceCount}+ devices
              </div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">
                OEMs & Legacy Archives
              </div>
            </div>
          </div>
        </div>

        {/* Featured Hardware Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-b from-[#14171A] to-[#0A0B0C] border border-white/10 text-white space-y-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-teal-400">
              Verified Open Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Designed for open hardware freedom.
            </h3>
            <p className="text-xs sm:text-sm text-[#8E95A0] leading-relaxed">
              Every build in our hub is verified against upstream source repositories with cryptographic integrity digests. Whether you prefer the clean foundation of LineageOS, the visual artistry of dotOS, or the AI perks of Pixel UI, your phone is in your control.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('devices')}
              className="umbrel-btn-white"
            >
              Explore Verified Devices
            </button>
            <button
              onClick={() => onNavigate('dotos')}
              className="umbrel-btn-pill"
            >
              Explore dotOS
            </button>
            <button
              onClick={() => onNavigate('pixelui')}
              className="umbrel-btn-pill"
            >
              Explore Pixel UI
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DOWNLOADS HIGHLIGHTS (Featuring Real Phone Photos)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Popular Downloads
          </h2>
          <button
            onClick={() => onNavigate('downloads')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            See all builds →
          </button>
        </div>

        <div className="space-y-4">
          {/* Target 1: Google Pixel 8a with Real Photo */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1A1D21] border border-slate-200 dark:border-white/10 shrink-0">
                  <img src={PIXEL_PHONE_IMAGE} alt="Google Pixel 8a" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Google Pixel 8a <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">akita</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8E95A0] mt-1 max-w-lg leading-relaxed">
                    Official LineageOS 21.0 & PixelOS Android 14 builds for Tensor G3. Full recovery, boot.img, vendor_boot, and OTA payload verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-teal-600 dark:text-teal-400 font-bold">LineageOS 21.0 Nightly</span>
              <span>·</span>
              <span className="text-blue-500 font-bold">PixelOS 14 (QPR3)</span>
              <span>·</span>
              <span>Tensor G3 · 120Hz OLED</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectDeviceForDownload('akita')}
                className="umbrel-btn-pill bg-black dark:bg-[#1A1D21] text-white"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Get akita Builds</span>
              </button>

              <button
                onClick={() => onNavigate('guides')}
                className="text-xs font-semibold text-slate-600 dark:text-[#8E95A0] hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>Install guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Target 2: POCO F3 with Real Photo */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1A1D21] border border-slate-200 dark:border-white/10 shrink-0">
                  <img src={POCO_PHONE_IMAGE} alt="POCO F3" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    POCO F3 / Redmi K40 <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">alioth</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8E95A0] mt-1 max-w-lg leading-relaxed">
                    Flagship Snapdragon 870 support across LineageOS, dotOS v5.2, and PixelOS. 120Hz display refresh calibration and dual stereo audio.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-teal-600 dark:text-teal-400 font-bold">LineageOS 21.0</span>
              <span>·</span>
              <span className="text-red-500 font-bold">dotOS 5.2</span>
              <span>·</span>
              <span className="text-blue-500 font-bold">PixelOS 14</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectDeviceForDownload('alioth')}
                className="umbrel-btn-pill bg-black dark:bg-[#1A1D21] text-white"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Get alioth Builds</span>
              </button>

              <button
                onClick={() => onNavigate('guides')}
                className="text-xs font-semibold text-slate-600 dark:text-[#8E95A0] hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>Install guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PHILOSOPHY & CONTROL (Matching Umbrel's "Your data, in your control")
          ========================================================================= */}
      <section className="space-y-12 pt-8 border-t border-slate-200/80 dark:border-white/10">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Your phone, in your <span className="italic font-serif">control</span>.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#8E95A0] max-w-2xl leading-relaxed">
            You've been renting your digital life from surveillance-driven OEM skins and locked bootloaders. Time to own your phone with verified open-source operating systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Zero Telemetry Bloat
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E95A0] leading-relaxed">
              No manufacturer spyware, forced background telemetry, or unremovable third-party apps consuming RAM and battery.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Unrivaled Customization
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E95A0] leading-relaxed">
              From dotOS bespoke Control Center tiles to Google Pixel Material You monetization, adapt every pixel of your interface.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hardware Longevity
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E95A0] leading-relaxed">
              Keep your devices running smoothly years after official manufacturer support expires with modern Android updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
