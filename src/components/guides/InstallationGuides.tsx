import React, { useState } from 'react';
import {
  BookOpen,
  Unlock,
  ShieldCheck,
  Layers,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Terminal,
  HelpCircle,
} from 'lucide-react';

export const InstallationGuides: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<string>('lineageos');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-teal-600" />
          <span>Installation & Recovery Guides</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Official procedures, bootloader unlocking references, and recovery workflows for LineageOS and GSI.
        </p>
      </div>

      {/* Guide Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'lineageos', label: '1. Official LineageOS Install', icon: ShieldCheck },
          { id: 'bootloader', label: '2. Unlocking Bootloaders', icon: Unlock },
          { id: 'recovery', label: '3. Recovery & Boot Images', icon: Terminal },
          { id: 'gsi', label: '4. GSI Flashing via Fastbootd', icon: Layers },
          { id: 'addons', label: '5. GApps & Root Addons', icon: Sparkles },
          { id: 'troubleshooting', label: '6. Bootloops & Unbricking', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeGuide === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGuide(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                isActive
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-[#1B2122] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Guide Content Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-slate-800 dark:text-slate-200">
        {/* GUIDE 1: Official LineageOS Install */}
        {activeGuide === 'lineageos' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Official LineageOS Installation Procedure
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Standard clean installation workflow recommended by the LineageOS maintainer team.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Prerequisites:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                  <li>ADB & Fastboot installed on your computer.</li>
                  <li>Device bootloader unlocked (see unlocking guide).</li>
                  <li>Target LineageOS ROM zip file downloaded and SHA-256 verified.</li>
                  <li>Official Lineage Recovery or verified custom recovery installed.</li>
                  <li>All personal data backed up off-device.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Step 1: Booting into Recovery</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Power down your device and hold the device-specific hardware key combination (usually Power + Volume Down or Power + Volume Up) to enter fastboot/bootloader mode, then select <strong>Recovery Mode</strong>. Alternatively, run:
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs select-all">
                  adb reboot recovery
                </pre>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Step 2: Factory Reset & Format Data</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  In Lineage Recovery, tap <strong>Factory reset</strong>, then tap <strong>Format data / factory reset</strong> and confirm. This step formats <code className="font-mono text-teal-700 dark:text-teal-300">/data</code> and removes encryption pins from the previous OS.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Step 3: Sideloading the ROM</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  From the recovery main menu, select <strong>Apply update</strong> → <strong>Apply from ADB</strong>. Connect your USB cable and execute:
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs select-all">
                  adb sideload lineage-*.zip
                </pre>
                <div className="text-[11px] text-slate-500 italic">
                  Note: ADB sideload will typically pause around 47% or display "Total xfer: 1.00x". This is normal completion.
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Step 4: Optional Addons (GApps / Magisk)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  If you want Google Play Services, sideload MindTheGapps <strong>immediately before rebooting to system</strong>. In recovery, select <strong>Advanced</strong> → <strong>Reboot to recovery</strong>, then sideload the MindTheGapps package.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GUIDE 2: Bootloader Unlocking */}
        {activeGuide === 'bootloader' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Unlocking Bootloaders by Manufacturer
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Summary of bootloader unlocking protocols across Android manufacturers.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Google Pixel</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  1. Enable Developer Options: Tap Build Number 7 times.<br />
                  2. Enable "OEM unlocking" and "USB debugging".<br />
                  3. Reboot to bootloader: <code className="font-mono text-teal-600">adb reboot bootloader</code>.<br />
                  4. Execute: <code className="font-mono text-teal-600">fastboot flashing unlock</code> and confirm on screen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Xiaomi / Redmi / POCO</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Requires Mi Community account linking and the official Mi Unlock Tool on Windows. Xiaomi imposes an intentional waiting period (typically 168 hours / 7 days) before unlock verification tokens are authorized on the server.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">OnePlus</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enable "OEM unlocking" in developer options, reboot into fastboot, and execute <code className="font-mono text-teal-600">fastboot flashing unlock</code> or <code className="font-mono text-teal-600">fastboot oem unlock</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Motorola</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Requires retrieving the unlock data string via <code className="font-mono text-teal-600">fastboot oem get_unlock_data</code>, pasting into Motorola's official unlock portal to receive an unlock key, and running <code className="font-mono text-teal-600">fastboot oem unlock &lt;KEY&gt;</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GUIDE 3: Recovery Installation */}
        {activeGuide === 'recovery' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Flashing Custom Recovery Images
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Modern Android devices differ by partition architecture (dedicated recovery vs boot/init_boot/vendor_boot ramdisk).
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Case A: Device with dedicated recovery partition</h3>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs select-all">
                  fastboot flash recovery recovery.img{"\n"}
                  fastboot reboot recovery
                </pre>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Case B: Modern A/B device (recovery inside boot/vendor_boot)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  On devices shipping with Android 11+ or Tensor/Snapdragon 8+ Gen 1, the recovery kernel and ramdisk live inside <code className="font-mono">boot.img</code> or <code className="font-mono">vendor_boot.img</code>:
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs select-all">
                  fastboot flash boot boot.img{"\n"}
                  fastboot flash vendor_boot vendor_boot.img{"\n"}
                  fastboot reboot recovery
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* GUIDE 4: GSI via fastbootd */}
        {activeGuide === 'gsi' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Flashing Treble GSI with Fastbootd
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory steps for flashing generic system images onto Dynamic Partition devices.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <strong>Crucial Distinction:</strong> <code className="font-mono">fastbootd</code> is a userspace mode running from recovery kernel, allowing dynamic resizing of partitions inside the <code className="font-mono">super</code> container. Bootloader fastboot cannot resize logical partitions!
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Commands:</h3>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs select-all leading-relaxed">
                  # 1. Unpack .img.xz to raw system.img{"\n"}
                  unxz lineage-*.img.xz{"\n\n"}
                  # 2. Enter fastbootd mode{"\n"}
                  fastboot reboot fastboot{"\n\n"}
                  # 3. Flash system partition{"\n"}
                  fastboot flash system system.img{"\n\n"}
                  # 4. Optional: Flash empty vbmeta if verity check fails{"\n"}
                  fastboot --disable-verity --disable-verification flash vbmeta vbmeta.img{"\n\n"}
                  # 5. Factory reset userdata{"\n"}
                  fastboot -w{"\n\n"}
                  # 6. Reboot system{"\n"}
                  fastboot reboot
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* GUIDE 5: Addon packages */}
        {activeGuide === 'addons' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                GApps & Magisk Addon Packages
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official Google Apps packages and Magisk systemless root suite.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">MindTheGapps</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  The officially recommended Google Apps package by LineageOS. Contains Google Play Services, Play Store, and minimal setup wizard. Sideload via ADB in Lineage Recovery before the first boot into system.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Magisk (TopJohnWu)</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Systemless root suite and Zygisk module environment. Can be installed by renaming <code className="font-mono text-teal-600">Magisk-v27.0.apk</code> to <code className="font-mono text-teal-600">Magisk-v27.0.zip</code> and sideloading in recovery, or patching <code className="font-mono">init_boot.img</code> / <code className="font-mono">boot.img</code> in the Magisk app.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GUIDE 6: Troubleshooting */}
        {activeGuide === 'troubleshooting' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Troubleshooting Bootloops & Unbricking
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Steps to recover when a device fails to boot or gets stuck in recovery.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Common Cause 1: Unformatted / Encrypted Data</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  If coming from stock OEM firmware (One UI, MIUI, OxygenOS), stock encryption keys will cause custom ROMs to bootloop. Perform <strong>Format Data / Factory Reset</strong> in recovery.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Common Cause 2: Firmware Vendor Mismatch</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  LineageOS builds specify a minimum required stock vendor firmware version. If the device was on an older Android version prior to flashing, modem or audio HALs will crash. Flash the latest official stock firmware before flashing LineageOS.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Common Cause 3: Reading Recovery Logs</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  In Lineage Recovery, tap <strong>Advanced</strong> → <strong>Enable ADB</strong>, then pull the crash log from your computer:
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs select-all">
                  adb pull /tmp/recovery.log
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Upstream documentation link */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">Official Upstream References:</span>
          <a
            href="https://wiki.lineageos.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 dark:text-teal-400 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <span>Visit LineageOS Wiki</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
