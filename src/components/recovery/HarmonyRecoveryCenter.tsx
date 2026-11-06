import React, { useState } from 'react';
import {
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Code2,
  HardDrive,
  Cpu,
} from 'lucide-react';

export const HarmonyRecoveryCenter: React.FC = () => {
  const [manifestUrl, setManifestUrl] = useState('https://github.com/LineageOS/android');
  const [branch, setBranch] = useState('lineage-21.0');
  const [codename, setCodename] = useState('akita');
  const [lunchTarget, setLunchTarget] = useState('lineage_akita-userdebug');
  const [buildTarget, setBuildTarget] = useState('recoveryimage');
  const [script, setScript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateScript = () => {
    // Regex validations matching HarmonyRecoveryBuildScreen.kt from Android app
    const validUrl = /^https:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?\/[A-Za-z0-9._~:/-]+$/.test(manifestUrl);
    const validBranch =
      /^[A-Za-z0-9._/-]+$/.test(branch) && !branch.startsWith('-') && !branch.includes('..');
    const validCodename = /^[A-Za-z0-9_-]+$/.test(codename);
    const validLunch = /^[A-Za-z0-9_.-]+$/.test(lunchTarget);
    const validTarget = /^[A-Za-z0-9_.-]+$/.test(buildTarget);

    if (!validUrl || !validBranch || !validCodename || !validLunch || !validTarget) {
      setError(
        'Check every field. Use an HTTPS manifest URL and simple branch, codename, lunch-target, and build-target values without shell metacharacters.'
      );
      setScript('');
      return;
    }

    setError(null);
    const generated = `#!/usr/bin/env bash
set -euo pipefail
# Harmony Recovery build plan for device: ${codename}
# Run only on a Linux build host with the required toolchain and disk space.
# Confirm the manifest, branch, device tree and build target with the project maintainers.
WORKDIR="\${HOME}/harmony-recovery-${codename}"
mkdir -p "$WORKDIR"
cd "$WORKDIR"
repo init -u '${manifestUrl}' -b '${branch}'
repo sync -c --force-sync -j"\$(nproc)"
source build/envsetup.sh
lunch '${lunchTarget}'
mka '${buildTarget}'
echo "Build command finished. Locate the output using the source tree's documented output path."
`;
    setScript(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <span>Harmony Recovery Centre & Build Lab</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Android utility for recovery release tracking, reproducible Linux build script generation, and verified ROM handoff.
        </p>
      </div>

      {/* Overview & Project Identity Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Harmony Recovery Project Overview
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Source Version <strong>2.0.1 (In Preparation)</strong> · Previous Release:{' '}
              <a
                href="https://github.com/tahmidgaming700/lineageos-archive-downloader/releases/tag/v2.0.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                v2.0.0
              </a>
            </div>
          </div>

          <a
            href="https://github.com/tahmidgaming700/lineageos-archive-downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>Repository Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Harmony Recovery works alongside the native Android application (<code className="font-mono text-[11px] text-teal-700 dark:text-teal-300">com.tahmidgaming.lineageupdater</code>) to manage custom recovery release discovery, automated build script planning, and root-only verified flashing handoffs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Minimum OS Target</div>
            <div className="text-slate-500">Android 6.0 (API 23) or higher</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Architecture Support</div>
            <div className="text-slate-500">ARM64-v8a & ARM (armeabi-v7a)</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Security Model</div>
            <div className="text-slate-500">SHA-256 byte digest verification</div>
          </div>
        </div>
      </div>

      {/* Linux Build Script Lab (From HarmonyRecoveryBuildScreen.kt) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-teal-600" />
            <span>Harmony Recovery Build Script Planner</span>
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Prepare a reproducible recovery-image build script for a real Linux build host. This utility does not compile or fabricate an image on the phone or in the browser. Use only trusted manifest sources and verified device trees.
          </p>
        </div>

        {/* Warning banner */}
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 flex items-start gap-3 text-xs text-rose-950 dark:text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed text-rose-800 dark:text-rose-300">
            Recovery builds require <strong>100+ GB of free storage</strong>, 16+ GB RAM, Java/JDK 17 toolchains, and hours of compilation time. The exact lunch target and build target depend on your target device's source tree.
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Manifest Repository URL (HTTPS)
            </label>
            <input
              type="text"
              value={manifestUrl}
              onChange={(e) => {
                setManifestUrl(e.target.value);
                setScript('');
                setError(null);
              }}
              placeholder="https://github.com/owner/manifest"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Manifest Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setScript('');
                  setError(null);
                }}
                placeholder="e.g. lineage-21.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Device Codename
              </label>
              <input
                type="text"
                value={codename}
                onChange={(e) => {
                  setCodename(e.target.value);
                  setScript('');
                  setError(null);
                }}
                placeholder="e.g. akita, alioth"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exact Lunch Target
              </label>
              <input
                type="text"
                value={lunchTarget}
                onChange={(e) => {
                  setLunchTarget(e.target.value);
                  setScript('');
                  setError(null);
                }}
                placeholder="e.g. lineage_akita-userdebug"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Build Target
              </label>
              <input
                type="text"
                value={buildTarget}
                onChange={(e) => {
                  setBuildTarget(e.target.value);
                  setScript('');
                  setError(null);
                }}
                placeholder="recoveryimage"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerateScript}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Generate Linux Build Script
          </button>
        </div>

        {/* Script Output Box */}
        {script && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Generated Build Script
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setScript('')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed overflow-x-auto select-all border border-slate-800">
              {script}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
