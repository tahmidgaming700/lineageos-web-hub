import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Terminal,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { LineageDevice } from '../../types';

interface GsiCompatibilityLabProps {
  initialDevice?: LineageDevice | null;
  onNavigateToGsi: () => void;
}

export const GsiCompatibilityLab: React.FC<GsiCompatibilityLabProps> = ({
  initialDevice,
  onNavigateToGsi,
}) => {
  const [deviceModel, setDeviceModel] = useState(initialDevice?.name || '');
  const [codename, setCodename] = useState(initialDevice?.model || '');
  const [arch, setArch] = useState<'arm64' | 'arm' | 'x86_64'>('arm64');
  const [androidVersion, setAndroidVersion] = useState<'14' | '13' | '12' | '11' | '10' | '9' | '8'>('14');
  const [trebleStatus, setTrebleStatus] = useState<'supported' | 'unsupported' | 'unknown'>('supported');
  const [partitionLayout, setPartitionLayout] = useState<'dynamic' | 'ab_sar' | 'a_only'>('dynamic');
  const [vndkStatus, setVndkStatus] = useState<'standard' | 'vndklite'>('standard');

  // Compute recommended GSI variant
  let recommendedVariant = '';
  let partitionLetter = 'b'; // default modern A/B
  if (partitionLayout === 'a_only') {
    partitionLetter = 'a';
  }

  if (vndkStatus === 'vndklite') {
    recommendedVariant = `${arch}_bvN-vndklite or ${arch}_bgN-vndklite`;
  } else {
    recommendedVariant = `${arch}_${partitionLetter}gN (with GApps) or ${arch}_${partitionLetter}vN (Vanilla)`;
  }

  const isDynamic = partitionLayout === 'dynamic';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-teal-600" />
          <span>GSI Compatibility Lab</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Determine theoretical GSI variant requirements, partition configurations, and flashing methods for your target device.
        </p>
      </div>

      {/* Warning Notice */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex items-start gap-4 text-xs text-amber-950 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1 leading-relaxed text-amber-900 dark:text-amber-300">
          <div className="font-bold text-sm">Theoretical Compatibility vs Verified Support</div>
          <p>
            This tool provides theoretical compatibility analysis based on Android specifications. Even if your hardware matches the architecture and Treble rules, proprietary vendor blobs, custom camera HALs, display refresh rates, or cellular radio stacks may fail to initialize. Consult your device's XDA / GitHub forum thread for verified reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Device Hardware Properties
            </h2>

            {/* Model & Codename */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Device Model Name
                </label>
                <input
                  type="text"
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="e.g. Pixel 8a, POCO F3, Galaxy A52"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Device Codename
                </label>
                <input
                  type="text"
                  value={codename}
                  onChange={(e) => setCodename(e.target.value)}
                  placeholder="e.g. akita, alioth, a52sxq"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>

            {/* CPU Architecture */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                CPU Architecture (Primary ABI)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'arm64', label: 'ARM64-v8a', sub: '64-bit modern' },
                  { id: 'arm', label: 'ARM / armeabi-v7a', sub: '32-bit legacy' },
                  { id: 'x86_64', label: 'x86_64', sub: 'PC / Emulator' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setArch(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      arch === item.id
                        ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shipped Android Version */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Shipped / Stock Base Android Version
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {[
                  { v: '14', name: 'A14' },
                  { v: '13', name: 'A13' },
                  { v: '12', name: 'A12' },
                  { v: '11', name: 'A11' },
                  { v: '10', name: 'A10' },
                  { v: '9', name: 'A9' },
                  { v: '8', name: 'A8' },
                ].map((item) => (
                  <button
                    key={item.v}
                    onClick={() => setAndroidVersion(item.v as any)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      androidVersion === item.v
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Partition Configuration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Partition Scheme & Layout
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'dynamic',
                    title: 'Dynamic Partitions (super partition)',
                    desc: 'Standard on Android 10+ devices. Requires fastbootd to flash system.',
                  },
                  {
                    id: 'ab_sar',
                    title: 'Standard A/B System-as-Root (no dynamic super)',
                    desc: 'Typical for Android 9/early 10 devices with physical system_a and system_b.',
                  },
                  {
                    id: 'a_only',
                    title: 'Legacy A-only (single system partition)',
                    desc: 'Rare on devices newer than Android 8.0 Oreo.',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPartitionLayout(item.id as any)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      partitionLayout === item.id
                        ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VNDK Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Vendor Interface (VNDK)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setVndkStatus('standard')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    vndkStatus === 'standard'
                      ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>Standard System</div>
                  <div className="text-[10px] text-slate-400 font-normal">Most modern devices</div>
                </button>
                <button
                  onClick={() => setVndkStatus('vndklite')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    vndkStatus === 'vndklite'
                      ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>VNDK-Lite Compatible</div>
                  <div className="text-[10px] text-slate-400 font-normal">RW permissions required</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results / Recommendation Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. Compatibility Analysis</span>
            </h2>

            {/* Recommended Variant Box */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-500/30 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Recommended GSI Target Variant
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-teal-950 dark:text-teal-100">
                {recommendedVariant}
              </div>
              <p className="text-[11px] text-teal-800/80 dark:text-teal-200/80 leading-relaxed">
                Matches CPU ABI ({arch.toUpperCase()}), partition configuration ({partitionLayout}), and VNDK requirement.
              </p>
            </div>

            {/* Flashing Protocol Instruction */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-teal-600" />
                <span>Required Flashing Mode</span>
              </div>

              {isDynamic ? (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-2 select-all">
                  <div className="text-amber-400 font-sans text-[10px] font-bold">
                    ⚠️ Dynamic Partitions detected — DO NOT flash in bootloader fastboot!
                  </div>
                  <p className="text-slate-400 text-[10px]"># Reboot to userspace fastbootd:</p>
                  <div>fastboot reboot fastboot</div>
                  <p className="text-slate-400 text-[10px]"># Flash uncompressed system image:</p>
                  <div>fastboot flash system system.img</div>
                  <p className="text-slate-400 text-[10px]"># Wipe userdata before first boot:</p>
                  <div>fastboot -w</div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-2 select-all">
                  <p className="text-slate-400 text-[10px]"># Standard fastboot flash:</p>
                  <div>fastboot flash system system.img</div>
                  <div>fastboot -w</div>
                </div>
              )}
            </div>

            {/* Known Quirks & Checklist */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="font-bold text-slate-900 dark:text-white">Hardware Checklist:</div>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Ensure bootloader is unlocked and USB debugging is enabled.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Extract compressed <code>.img.xz</code> to raw <code>.img</code> before flashing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Back up all personal data — factory reset is required.</span>
                </li>
              </ul>
            </div>

            {/* Action button to GSI discovery */}
            <button
              onClick={onNavigateToGsi}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Browse Matching GSI Images in Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
