import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  DownloadCloud,
  ExternalLink,
  ShieldAlert,
  Cpu,
  FileArchive,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { GsiRelease } from '../../types';
import { fetchGsiReleases } from '../../lib/api';

interface GsiDiscoveryCenterProps {
  onNavigateToLab: () => void;
  onNavigateToVerifier: (hash: string, filename: string) => void;
}

export const GsiDiscoveryCenter: React.FC<GsiDiscoveryCenterProps> = ({
  onNavigateToLab,
  onNavigateToVerifier,
}) => {
  const [releases, setReleases] = useState<GsiRelease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [archFilter, setArchFilter] = useState<string>('all');
  const [variantFilter, setVariantFilter] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchGsiReleases({
      arch: archFilter !== 'all' ? archFilter : undefined,
      variant: variantFilter !== 'all' ? variantFilter : undefined,
    })
      .then((data) => {
        if (mounted) {
          setReleases(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('GSI release fetch error:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [archFilter, variantFilter]);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-600" />
            <span>Community GSI Discovery</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generic System Images based on LineageOS and Project Treble by AndyYan and ponces.
          </p>
        </div>

        <button
          onClick={onNavigateToLab}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          <Cpu className="w-4 h-4" />
          <span>Launch Compatibility Lab</span>
        </button>
      </div>

      {/* Critical GSI Warning */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex items-start gap-4 text-amber-950 dark:text-amber-200 text-xs">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1 leading-relaxed text-amber-900 dark:text-amber-300">
          <div className="font-bold text-sm">Hardware & Bootability Disclaimer</div>
          <p>
            An architecture match (e.g. ARM64) <strong>does NOT guarantee</strong> that a Generic System Image will boot or that hardware components (cellular modem, cameras, fingerprint, audio) will function properly. GSIs depend on proper vendor HAL/VNDK implementations. Devices with Dynamic Partitions require flashing via <code className="px-1 py-0.5 bg-amber-500/20 rounded-md font-mono text-[11px]">fastbootd</code>, NOT standard bootloader fastboot.
          </p>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Architecture */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Architecture:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {['all', 'arm64', 'arm', 'x86_64'].map((arch) => (
              <button
                key={arch}
                onClick={() => setArchFilter(arch)}
                className={`px-3 py-1.5 rounded-lg uppercase text-[11px] font-semibold transition-colors cursor-pointer ${
                  archFilter === arch
                    ? 'bg-white dark:bg-[#1B2122] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {arch === 'all' ? 'All' : arch}
              </button>
            ))}
          </div>
        </div>

        {/* Variant */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Variant:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All' },
              { id: 'bgn', label: 'bgN (GApps)' },
              { id: 'bvn', label: 'bvN (Vanilla)' },
              { id: 'vndklite', label: 'vndklite' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantFilter(v.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  variantFilter === v.id
                    ? 'bg-white dark:bg-[#1B2122] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nomenclature Guide Accordion */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-teal-600" />
          <span>Understanding Treble GSI Variant Codes (e.g. arm64_bgN)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] leading-relaxed">
          <div>
            <strong>1st Letter (Partition Type):</strong><br />
            <code className="text-teal-700 dark:text-teal-300">a</code> = A-only (legacy Android 8.0/9 devices)<br />
            <code className="text-teal-700 dark:text-teal-300">b</code> = A/B (all Android 10+ and modern system-as-root devices)
          </div>
          <div>
            <strong>2nd Letter (GApps Suite):</strong><br />
            <code className="text-teal-700 dark:text-teal-300">v</code> = Vanilla (pure AOSP/LOS, no Google services)<br />
            <code className="text-teal-700 dark:text-teal-300">g</code> = GApps bundled included
          </div>
          <div>
            <strong>3rd Letter (Superuser / Root):</strong><br />
            <code className="text-teal-700 dark:text-teal-300">N</code> = Non-SU (standard unrooted, passes basic Play Integrity)<br />
            <code className="text-teal-700 dark:text-teal-300">S</code> = Superuser included (phh-su)
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Querying community GSI release repositories...</div>
        </div>
      )}

      {/* Releases List */}
      {!loading && releases.length > 0 && (
        <div className="space-y-6">
          {releases.map((rel) => (
            <div
              key={rel.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              {/* Release Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {rel.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono font-semibold">
                      {rel.lineage_version}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Maintainer: <strong>{rel.maintainer}</strong> · {rel.android_version}
                  </div>
                </div>

                <a
                  href={rel.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                >
                  <span>GitHub Release Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Release Notes */}
              {rel.body && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {rel.body}
                </p>
              )}

              {/* Assets list */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Downloadable System Image Assets ({rel.assets.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rel.assets.map((asset) => {
                    const sizeMb = (asset.size / (1024 * 1024)).toFixed(0);
                    return (
                      <div
                        key={asset.name}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#171D1E] flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-teal-700 dark:text-teal-300">
                              {asset.variant}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {asset.architecture.toUpperCase()} · {sizeMb} MB
                            </span>
                          </div>

                          <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate" title={asset.name}>
                            {asset.name}
                          </div>
                        </div>

                        {/* Hash & Download Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {asset.sha256 ? (
                            <button
                              onClick={() => handleCopy(asset.sha256!)}
                              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                              title="Copy SHA-256 digest"
                            >
                              {copiedHash === asset.sha256 ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Hash</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">Digest unlisted</span>
                          )}

                          <a
                            href={asset.browser_download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && releases.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          <p className="text-sm font-semibold">No GSI releases matched the selected filters.</p>
          <button
            onClick={() => {
              setArchFilter('all');
              setVariantFilter('all');
            }}
            className="text-xs text-teal-600 hover:underline mt-2 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
