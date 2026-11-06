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
  const [akitaBuild, setAkitaBuild] = useState<any>(null);
  const [aliothBuild, setAliothBuild] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    fetchDevices()
      .then((devs) => {
        if (mounted && devs.length > 0) setDeviceCount(devs.length);
      })
      .catch((err) => console.warn('Dashboard devices fetch error:', err));

    fetchBuilds('akita')
      .then((builds) => {
        if (mounted && builds.length > 0) setAkitaBuild(builds[0]);
      })
      .catch((err) => console.warn('Akita builds fetch error:', err));

    fetchBuilds('alioth')
      .then((builds) => {
        if (mounted && builds.length > 0) setAliothBuild(builds[0]);
      })
      .catch((err) => console.warn('Alioth builds fetch error:', err));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-20 max-w-5xl mx-auto pb-24 text-slate-900 dark:text-white transition-colors">
      {/* =========================================================================
          SECTION 1: HERO (Inspired directly by Umbrel "Install on your own hardware")
          ========================================================================= */}
      <section className="text-center pt-6 sm:pt-12 space-y-6">
        {/* Version Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#15171a] border border-slate-300/80 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
          <span className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-black">
            L
          </span>
          <span>LineageOS 21.0 Official</span>
        </div>

        {/* Big Bold Headline */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-balance">
            Install LineageOS<br />
            <span className="text-slate-500 dark:text-[#8E95A0] font-normal">on your</span><br />
            own hardware.
          </h1>
        </div>

        {/* Subhead */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#8E95A0] leading-relaxed">
          Tell us about your machine. We'll plan your recovery, verify your checksums, and walk you through the rest.
        </p>

        {/* Underline link */}
        <div>
          <button
            onClick={() => onNavigate('downloads')}
            className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 underline underline-offset-4 cursor-pointer transition-colors"
          >
            Know what you need? See all downloads
          </button>
        </div>

        {/* Two License / Feature Cards (Matching Umbrel's Free for Personal / OEM cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left pt-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Free & Open Source.
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8E95A0] mt-1.5 leading-relaxed">
                Install LineageOS on your device at no cost, with automated nightly updates included. Built under Apache 2.0 & GPL without surveillance.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Treble GSI & Custom Recovery?
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8E95A0] mt-1.5 leading-relaxed">
                Discover generic system images from AndyYan & ponces, fastbootd command guides, and Harmony Recovery tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "What will LineageOS run on?" (Bento Grid with 3D-styled cards)
          ========================================================================= */}
      <section className="space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          What will LineageOS run on?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Bento Card 1: Google Pixel */}
          <div
            onClick={() => onSelectDeviceForDownload('akita')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-48 sm:h-52 group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#181B1F] flex items-center justify-center text-xl text-teal-600 group-hover:scale-105 transition-transform">
              📱
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Google Pixel
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                Tensor G3, G2, G1 & Snapdragon
              </div>
            </div>
          </div>

          {/* Bento Card 2: Xiaomi & POCO */}
          <div
            onClick={() => onSelectDeviceForDownload('alioth')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-48 sm:h-52 group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#181B1F] flex items-center justify-center text-xl text-sky-600 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Xiaomi & POCO
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                POCO F3, X3 Pro, Redmi Note 10
              </div>
            </div>
          </div>

          {/* Bento Card 3: OnePlus & Nothing */}
          <div
            onClick={() => onSelectDeviceForDownload('aston')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-48 sm:h-52 group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#181B1F] flex items-center justify-center text-xl text-rose-600 group-hover:scale-105 transition-transform">
              🔥
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                OnePlus & Nothing
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                OnePlus 12R, 11, Phone (1) & (2)
              </div>
            </div>
          </div>

          {/* Bento Card 4: Samsung Galaxy */}
          <div
            onClick={() => onSelectDeviceForDownload('a52sxq')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-48 sm:h-52 group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#181B1F] flex items-center justify-center text-xl text-indigo-600 group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Samsung Galaxy
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                A52s 5G, S10, S9, Note 10
              </div>
            </div>
          </div>

          {/* Bento Card 5: Treble GSI */}
          <div
            onClick={() => onNavigate('gsi')}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-48 sm:h-52 group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#181B1F] flex items-center justify-center text-xl text-amber-500 group-hover:scale-105 transition-transform">
              🧩
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Treble GSI
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                Generic System Image (ARM64/A32)
              </div>
            </div>
          </div>

          {/* Bento Card 6: Something else? See all 640+ */}
          <div
            onClick={() => onNavigate('devices')}
            className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-[#14171A] border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between h-48 sm:h-52 group shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-[#202428] flex items-center justify-center text-xl text-teal-600 group-hover:scale-105 transition-transform">
              🔍
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Something else?
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8E95A0] mt-0.5">
                Browse all {deviceCount}+ devices
              </div>
            </div>
          </div>
        </div>

        {/* Featured Hardware Hero Card (Like "Designed for umbrelOS") */}
        <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-b from-[#14171A] to-[#0A0B0C] border border-white/10 text-white space-y-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-teal-400">
              Verified & Tested
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Designed for open hardware freedom.
            </h3>
            <p className="text-xs sm:text-sm text-[#8E95A0] leading-relaxed">
              Official LineageOS builds ship with verified Lineage Recovery, fastbootd compatibility, automated nightly OTA updates, and SHA-256 cryptographic hashes.
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
              onClick={() => onNavigate('compatibility')}
              className="umbrel-btn-pill"
            >
              GSI Compatibility Lab
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DOWNLOADS (Exact Umbrel downloads card styling & layout)
          ========================================================================= */}
      <section className="space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Downloads
        </h2>

        <div className="space-y-4">
          {/* Target 1: Google Pixel 8a */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#1A1D21] border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shrink-0">
                  📱
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Google Pixel 8a <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">akita</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8E95A0] mt-1 max-w-lg leading-relaxed">
                    Official LineageOS nightly build for Tensor G3. Full recovery, boot.img, vendor_boot, and OTA payload verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              ROM package · 1.4 GB · Android 14 (API 34) · Nightly
            </div>

            {/* Umbrel style action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectDeviceForDownload('akita')}
                className="umbrel-btn-pill bg-black dark:bg-[#1A1D21] text-white"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>LineageOS 21.0 Nightly</span>
              </button>

              <button
                onClick={() => onSelectDeviceForDownload('akita')}
                className="umbrel-btn-pill"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Recovery Image</span>
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

          {/* Target 2: POCO F3 / Redmi K40 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#1A1D21] border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shrink-0">
                  ⚡
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    POCO F3 / Redmi K40 <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">alioth</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8E95A0] mt-1 max-w-lg leading-relaxed">
                    High performance Snapdragon 870 build with 120Hz display refresh calibration, dynamic super partitions, and dual stereo audio.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              ROM package · 1.3 GB · Android 14 (API 34) · Nightly
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectDeviceForDownload('alioth')}
                className="umbrel-btn-pill bg-black dark:bg-[#1A1D21] text-white"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>LineageOS 21.0 Nightly</span>
              </button>

              <button
                onClick={() => onSelectDeviceForDownload('alioth')}
                className="umbrel-btn-pill"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Recovery Image</span>
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

          {/* Target 3: Community Treble GSI */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#1A1D21] border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shrink-0">
                  🧩
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Community Treble GSI <span className="font-mono text-xs font-semibold text-sky-500">ARM64 & ARM32</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8E95A0] mt-1 max-w-lg leading-relaxed">
                    By AndyYan and ponces. Generic System Images for any Project Treble compatible phone. Flash with fastbootd.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Raw system image (.img.xz) · 980 MB · Android 14
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('gsi')}
                className="umbrel-btn-pill bg-black dark:bg-[#1A1D21] text-white"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>GSI arm64_bgN (GApps)</span>
              </button>

              <button
                onClick={() => onNavigate('gsi')}
                className="umbrel-btn-pill"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>GSI arm64_bvN (Vanilla)</span>
              </button>

              <button
                onClick={() => onNavigate('compatibility')}
                className="text-xs font-semibold text-slate-600 dark:text-[#8E95A0] hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>Compatibility check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: STORYTELLING & EDITORIAL (Matching Screenshot 2 "Your cloud, in your home")
          ========================================================================= */}
      <section className="text-center space-y-12 pt-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Your phone,<br />
            in your <em className="italic font-serif font-normal text-teal-600 dark:text-teal-400">control</em>.
          </h2>
          <p className="max-w-lg mx-auto text-base sm:text-lg text-slate-600 dark:text-[#8E95A0]">
            You've been renting your digital life from ad companies. Time to <span className="font-bold underline decoration-teal-500 decoration-2">own it</span>.
          </p>
        </div>

        {/* 3 Pillars Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="text-3xl">🔒</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Zero Telemetry
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E95A0] leading-relaxed">
              Every photo, file, and message stays on hardware you own. No background diagnostic trackers reporting your habits to corporate servers.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="text-3xl">🌱</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Device Longevity
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E95A0] leading-relaxed">
              Don't throw away a perfectly good phone because the OEM ended security updates. LineageOS keeps hardware running smoothly for 7+ years.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="text-3xl">🛠️</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Root & Freedom
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E95A0] leading-relaxed">
              Install Magisk root, microG open services, or pure AOSP vanilla. You decide what apps, permissions, and background processes run on your CPU.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access to Developer Toolbox */}
      <section className="p-8 rounded-3xl bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Need to calculate SHA-256 or inspect build.prop?
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#8E95A0]">
            Use our 10 browser-based developer utilities. Calculates hashes locally with zero uploads.
          </p>
        </div>

        <button
          onClick={() => onNavigate('toolbox')}
          className="umbrel-btn-white shrink-0"
        >
          <span>Open Developer Toolbox</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
