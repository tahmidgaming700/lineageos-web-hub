import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Hash,
  ShieldCheck,
  FileText,
  Smartphone,
  Layers,
  Terminal,
  Code2,
  Check,
  Copy,
  AlertCircle,
  FileCheck,
  Info,
} from 'lucide-react';
import { calculateSha256, calculateStringSha256, compareChecksums } from '../../lib/crypto';

interface DeveloperToolboxProps {
  initialToolId?: string;
  initialExpectedHash?: string;
  initialFilename?: string;
}

export const DeveloperToolbox: React.FC<DeveloperToolboxProps> = ({
  initialToolId = 'sha256',
  initialExpectedHash = '',
  initialFilename = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialToolId);

  // Sync if initial props change
  useEffect(() => {
    if (initialToolId) setActiveTab(initialToolId);
  }, [initialToolId]);

  // 1. SHA-256 Calculator State
  const [calcMode, setCalcMode] = useState<'file' | 'text'>('file');
  const [calcText, setCalcText] = useState('');
  const [calcFile, setCalcFile] = useState<File | null>(null);
  const [calcHash, setCalcHash] = useState<string>('');
  const [calcProgress, setCalcProgress] = useState<number>(0);
  const [calcLoading, setCalcLoading] = useState<boolean>(false);

  // 2. File Checksum Verifier State
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [expectedHash, setExpectedHash] = useState<string>(initialExpectedHash);
  const [actualHash, setActualHash] = useState<string>('');
  const [verifyProgress, setVerifyProgress] = useState<number>(0);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<'match' | 'mismatch' | null>(null);

  useEffect(() => {
    if (initialExpectedHash) {
      setExpectedHash(initialExpectedHash);
      setActiveTab('verifier');
    }
  }, [initialExpectedHash]);

  // 3. Build.prop Viewer State
  const [buildPropText, setBuildPropText] = useState<string>(`# Sample Android build.prop
ro.build.version.release=14
ro.build.version.sdk=34
ro.build.version.security_patch=2024-04-05
ro.product.model=Pixel 8a
ro.product.device=akita
ro.product.manufacturer=Google
ro.product.cpu.abi=arm64-v8a
ro.product.cpu.abilist=arm64-v8a
ro.treble.enabled=true
ro.build.ab_update=true
ro.boot.dynamic_partitions=true
ro.build.fingerprint=google/akita/akita:14/AP2A.240405.002/11481092:user/release-keys
`);
  const [buildPropFilter, setBuildPropFilter] = useState('');

  // 4. OTA Payload properties viewer
  const [payloadText, setPayloadText] = useState<string>(`FILE_HASH=ffeba9979e7e060ce2e860be75e6d92d785b01d0cf4d964fa13487b7dbe32fe1
FILE_SIZE=1498626624
METADATA_HASH=c83df0fd755791ca50556f05a606d88f49d1ffd7
METADATA_SIZE=142240
`);

  // 5. Firmware Build ID Parser
  const [buildIdInput, setBuildIdInput] = useState<string>('AP2A.240805.005');

  // 6. JSON Formatter
  const [jsonInput, setJsonInput] = useState<string>('{"model":"akita","oem":"Google","sdk":34,"treble":true}');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Handlers for SHA-256 Calculator
  const handleCalculateFileHash = async (file: File) => {
    setCalcFile(file);
    setCalcLoading(true);
    setCalcProgress(0);
    try {
      const hash = await calculateSha256(file, (p) => setCalcProgress(p.percentage));
      setCalcHash(hash);
    } catch (err) {
      console.warn('Calculation error:', err);
    } finally {
      setCalcLoading(false);
    }
  };

  const handleCalculateTextHash = async () => {
    if (!calcText) return;
    const hash = await calculateStringSha256(calcText);
    setCalcHash(hash);
  };

  // Handlers for File Checksum Verifier
  const handleRunVerification = async () => {
    if (!verifyFile || !expectedHash.trim()) return;
    setVerifyLoading(true);
    setVerifyProgress(0);
    setVerifyResult(null);

    try {
      const computed = await calculateSha256(verifyFile, (p) => setVerifyProgress(p.percentage));
      setActualHash(computed);
      const isMatch = compareChecksums(computed, expectedHash);
      setVerifyResult(isMatch ? 'match' : 'mismatch');
    } catch (err) {
      console.warn('Verify error:', err);
    } finally {
      setVerifyLoading(false);
    }
  };

  // Parse build.prop lines
  const parsedBuildProp = React.useMemo(() => {
    const lines = buildPropText.split('\n');
    const result: { key: string; value: string; isImportant: boolean }[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        const isImportant =
          key.includes('fingerprint') ||
          key.includes('version.sdk') ||
          key.includes('version.release') ||
          key.includes('security_patch') ||
          key.includes('treble') ||
          key.includes('dynamic_partitions') ||
          key.includes('ab_update');
        result.push({ key, value, isImportant });
      }
    }
    return result;
  }, [buildPropText]);

  // Parse Google Build ID: e.g. AP2A.240805.005
  const parsedBuildId = React.useMemo(() => {
    const id = buildIdInput.trim();
    // Google pattern: [Branch][YearQuarter][Date].[BuildNum]
    if (/^[A-Z0-9]{4}\.\d{6}\.\d{3}$/.test(id)) {
      const branch = id.slice(0, 4);
      const yymmdd = id.slice(5, 11);
      const year = '20' + yymmdd.slice(0, 2);
      const month = yymmdd.slice(2, 4);
      const day = yymmdd.slice(4, 6);
      const sub = id.slice(12);
      return {
        brand: 'Google / Pixel standard',
        branch,
        date: `${year}-${month}-${day}`,
        revision: sub,
      };
    }
    return {
      brand: 'Custom / OEM format',
      branch: id,
      date: 'N/A',
      revision: 'N/A',
    };
  }, [buildIdInput]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-teal-600" />
          <span>Android Developer Toolbox</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Client-side cryptographic verification and firmware analysis utilities. Calculations execute locally in your browser.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'sha256', label: '1. SHA-256 Calculator', icon: Hash },
          { id: 'verifier', label: '2. Checksum Verifier', icon: ShieldCheck },
          { id: 'buildprop', label: '3. Build.prop Viewer', icon: FileText },
          { id: 'androidversions', label: '4. Android API Levels', icon: Smartphone },
          { id: 'payload', label: '5. OTA Payload Props', icon: Layers },
          { id: 'buildparser', label: '6. Build ID Parser', icon: Code2 },
          { id: 'fastboot', label: '7. Fastboot Helper', icon: Terminal },
          { id: 'json', label: '8. JSON Formatter', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* TOOL 1: SHA-256 Calculator */}
      {activeTab === 'sha256' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-teal-600" />
              <span>Client-Side SHA-256 Calculator</span>
            </h2>
            <p className="text-xs text-slate-500">
              Computes standard cryptographic 256-bit hash using the native browser Web Crypto API. Files are never transmitted over the network.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setCalcMode('file');
                setCalcHash('');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                calcMode === 'file' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              File Hash (Drag & Drop)
            </button>
            <button
              onClick={() => {
                setCalcMode('text');
                setCalcHash('');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                calcMode === 'text' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              Text String
            </button>
          </div>

          {calcMode === 'file' ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) {
                    handleCalculateFileHash(e.dataTransfer.files[0]);
                  }
                }}
                className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-3xl text-center cursor-pointer transition-colors"
                onClick={() => document.getElementById('calc-file-input')?.click()}
              >
                <input
                  id="calc-file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleCalculateFileHash(e.target.files[0]);
                  }}
                />
                <Hash className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {calcFile ? calcFile.name : 'Click to select ROM zip, boot image, or drag & drop here'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Supports large firmware zip files (1GB - 4GB+)
                </div>
              </div>

              {calcLoading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Hashing progress...</span>
                    <span>{calcProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full transition-all duration-150"
                      style={{ width: `${calcProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={calcText}
                onChange={(e) => setCalcText(e.target.value)}
                placeholder="Paste string or text payload..."
                rows={4}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden"
              />
              <button
                onClick={handleCalculateTextHash}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Compute SHA-256
              </button>
            </div>
          )}

          {calcHash && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                Computed Digest (Hex)
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-xs font-bold text-slate-900 dark:text-white break-all select-all">
                  {calcHash}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(calcHash)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: Checksum Verifier */}
      {activeTab === 'verifier' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>ROM File Checksum Verifier</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verify your downloaded LineageOS ZIP against the official published digest before flashing to prevent corrupted flashes.
            </p>
          </div>

          <div className="space-y-4">
            {/* Expected Hash Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Official SHA-256 Hash
              </label>
              <input
                type="text"
                value={expectedHash}
                onChange={(e) => {
                  setExpectedHash(e.target.value);
                  setVerifyResult(null);
                }}
                placeholder="Paste published 64-character SHA-256 string from download page..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden focus:border-teal-500"
              />
            </div>

            {/* File Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) {
                  setVerifyFile(e.dataTransfer.files[0]);
                  setVerifyResult(null);
                }
              }}
              onClick={() => document.getElementById('verify-file-input')?.click()}
              className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-3xl text-center cursor-pointer transition-colors"
            >
              <input
                id="verify-file-input"
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setVerifyFile(e.target.files[0]);
                    setVerifyResult(null);
                  }
                }}
              />
              <FileCheck className="w-7 h-7 text-teal-600 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {verifyFile ? verifyFile.name : 'Select or drop downloaded ROM file to verify'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {verifyFile ? `${(verifyFile.size / (1024 * 1024)).toFixed(1)} MB` : 'No file loaded yet'}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunVerification}
              disabled={!verifyFile || !expectedHash.trim() || verifyLoading}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {verifyLoading ? `Verifying bytes... (${verifyProgress}%)` : 'Verify Checksum'}
            </button>

            {/* Verification Result Card */}
            {verifyResult === 'match' && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 dark:text-emerald-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>CHECKSUM VERIFIED — INTEGRITY CONFIRMED</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  The downloaded file's SHA-256 matches the expected digest exactly. The package is authentic and intact.
                </p>
              </div>
            )}

            {verifyResult === 'mismatch' && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-950 dark:text-rose-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>CHECKSUM MISMATCH — DO NOT FLASH</span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  The file digest does NOT match the expected value. The download may be corrupted, truncated, or tampered with. Delete the file and re-download.
                </p>
                <div className="text-[11px] font-mono break-all text-slate-600 dark:text-slate-300 pt-1">
                  <div>Computed: {actualHash}</div>
                  <div>Expected: {expectedHash}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: Build.prop Viewer */}
      {activeTab === 'buildprop' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>Android build.prop Inspector</span>
            </h2>
            <p className="text-xs text-slate-500">
              Upload or paste <code className="font-mono">build.prop</code> to parse system properties, Treble support, API level, and fingerprint.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={buildPropText}
              onChange={(e) => setBuildPropText(e.target.value)}
              rows={6}
              placeholder="Paste contents of build.prop..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden"
            />

            <input
              type="text"
              value={buildPropFilter}
              onChange={(e) => setBuildPropFilter(e.target.value)}
              placeholder="Filter properties (e.g. treble, abi, fingerprint, sdk)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#171D1E] border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
            />
          </div>

          {/* Parsed properties table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Property Key</th>
                  <th className="py-2.5 px-4">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                {parsedBuildProp
                  .filter((p) =>
                    !buildPropFilter ||
                    p.key.toLowerCase().includes(buildPropFilter.toLowerCase()) ||
                    p.value.toLowerCase().includes(buildPropFilter.toLowerCase())
                  )
                  .map((prop, idx) => (
                    <tr
                      key={idx}
                      className={
                        prop.isImportant
                          ? 'bg-teal-50/40 dark:bg-teal-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    >
                      <td className="py-2 px-4 text-slate-600 dark:text-slate-300 select-all font-semibold">
                        {prop.key}
                      </td>
                      <td className="py-2 px-4 text-slate-900 dark:text-slate-100 select-all break-all">
                        {prop.value}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOOL 4: Android Version & API Level Reference */}
      {activeTab === 'androidversions' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-teal-600" />
              <span>Android API Level & Architecture Reference</span>
            </h2>
            <p className="text-xs text-slate-500">
              Official timeline of Android releases, API levels, and major platform architectural milestones.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">API Level</th>
                  <th className="py-3 px-4">Codename</th>
                  <th className="py-3 px-4">Release Year</th>
                  <th className="py-3 px-4">Architecture Milestones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {[
                  { v: 'Android 15', api: '35', code: 'Vanilla Ice Cream', year: '2024', milestone: '16KB page size support, Private Space' },
                  { v: 'Android 14', api: '34', code: 'Upside Down Cake', year: '2023', milestone: 'Selected photo access, Predictive back' },
                  { v: 'Android 13', api: '33', code: 'Tiramisu', year: '2022', milestone: 'Per-app language, Notification runtime permissions' },
                  { v: 'Android 12L / 12', api: '32 / 31', code: 'Snow Cone', year: '2021', milestone: 'Material You, Dynamic Color, Mic/Camera indicators' },
                  { v: 'Android 11', api: '30', code: 'Red Velvet Cake', year: '2020', milestone: 'Virtual A/B OTA, Scoped storage enforcement' },
                  { v: 'Android 10', api: '29', code: 'Quince Tart (Q)', year: '2019', milestone: 'Dynamic Partitions (super), System-as-Root requirement' },
                  { v: 'Android 9', api: '28', code: 'Pie', year: '2018', milestone: 'VNDK enforcement, Display notch support' },
                  { v: 'Android 8.1 / 8.0', api: '27 / 26', code: 'Oreo', year: '2017', milestone: 'Project Treble introduced (HAL/Framework separation)' },
                  { v: 'Android 7.1 / 7.0', api: '25 / 24', code: 'Nougat', year: '2016', milestone: 'Seamless A/B updates, File-based encryption' },
                  { v: 'Android 6.0', api: '23', code: 'Marshmallow', year: '2015', milestone: 'Runtime permissions, Adoptable storage' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                      {row.v}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-teal-600 dark:text-teal-400">
                      {row.api}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                      {row.code}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{row.year}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-sans">
                      {row.milestone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOOL 5: OTA Payload Properties */}
      {activeTab === 'payload' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>OTA Payload Properties Parser</span>
            </h2>
            <p className="text-xs text-slate-500">
              Inspect parameters extracted from Android OTA <code className="font-mono">payload_properties.txt</code> files.
            </p>
          </div>

          <textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden"
          />

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200">Parsed Payload Metadata</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
              {payloadText.split('\n').filter((l) => l.includes('=')).map((line, idx) => {
                const [k, v] = line.split('=');
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#171D1E] border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-bold">{k}:</span>{' '}
                    <span className="text-slate-900 dark:text-white break-all">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: Build ID Parser */}
      {activeTab === 'buildparser' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-teal-600" />
              <span>Android Build ID / Fingerprint Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500">
              Decode official Google Pixel release IDs and decipher compilation dates and branch tags.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={buildIdInput}
              onChange={(e) => setBuildIdInput(e.target.value)}
              placeholder="e.g. AP2A.240805.005 or UQ1A.240205.004"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden"
            />
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-500/30 text-xs space-y-2">
            <div className="font-bold text-teal-950 dark:text-teal-100">
              Decoded Build Specifications
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <div>Format Style: <span className="font-bold">{parsedBuildId.brand}</span></div>
              <div>Source Branch: <span className="font-bold">{parsedBuildId.branch}</span></div>
              <div>Build Date: <span className="font-bold text-teal-700 dark:text-teal-300">{parsedBuildId.date}</span></div>
              <div>Revision / Sub-build: <span className="font-bold">{parsedBuildId.revision}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: Fastboot & Command Helper */}
      {activeTab === 'fastboot' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-600" />
              <span>Fastboot & Recovery Command Builder</span>
            </h2>
            <p className="text-xs text-slate-500">
              Standard ADB and Fastboot command generator for common flashing workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">LineageOS Sideload</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] select-all">
                adb reboot sideload{"\n"}
                adb sideload lineage-*.zip
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Dynamic GSI Flash (fastbootd)</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] select-all">
                fastboot reboot fastboot{"\n"}
                fastboot flash system system.img{"\n"}
                fastboot -w
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Recovery Image Flash</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] select-all">
                fastboot flash recovery recovery.img{"\n"}
                fastboot reboot recovery
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Modern Boot / Vendor Boot</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] select-all">
                fastboot flash boot boot.img{"\n"}
                fastboot flash vendor_boot vendor_boot.img
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 8: JSON Formatter & Validator */}
      {activeTab === 'json' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-teal-600" />
              <span>JSON Formatter & Validator</span>
            </h2>
            <p className="text-xs text-slate-500">
              Format, validate, and minify device specifications and API responses.
            </p>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-hidden"
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(jsonInput);
                  setJsonOutput(JSON.stringify(parsed, null, 2));
                  setJsonError(null);
                } catch (err: any) {
                  setJsonError(err.message);
                }
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer"
            >
              Format & Pretty Print
            </button>
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(jsonInput);
                  setJsonOutput(JSON.stringify(parsed));
                  setJsonError(null);
                } catch (err: any) {
                  setJsonError(err.message);
                }
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Minify
            </button>
          </div>

          {jsonError && (
            <div className="text-xs text-rose-600 font-medium">{jsonError}</div>
          )}

          {jsonOutput && (
            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto select-all">
              {jsonOutput}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
