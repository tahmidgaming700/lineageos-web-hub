import React, { useState, useEffect } from 'react';
import {
  Archive,
  Search,
  AlertTriangle,
  DownloadCloud,
  ShieldAlert,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { ArchiveBuildSummary, ArchiveBuildDetail } from '../../types';
import { fetchArchives, fetchArchiveDetail } from '../../lib/api';

interface HistoricalArchiveExplorerProps {
  initialDevice?: string;
  onNavigateToVerifier: (hash: string, filename: string) => void;
}

export const HistoricalArchiveExplorer: React.FC<HistoricalArchiveExplorerProps> = ({
  initialDevice = '',
  onNavigateToVerifier,
}) => {
  const [deviceSearch, setDeviceSearch] = useState<string>(initialDevice);
  const [summaries, setSummaries] = useState<ArchiveBuildSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<ArchiveBuildDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadSummaries = (device?: string) => {
    setLoading(true);
    setError(null);
    fetchArchives(device || undefined)
      .then((data) => {
        setSummaries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed loading archive records');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSummaries(initialDevice);
  }, [initialDevice]);

  const handleSelectBuild = async (summary: ArchiveBuildSummary) => {
    if (selectedBuild?.id === summary.id) {
      setSelectedBuild(null);
      return;
    }
    setLoadingDetail(true);
    try {
      const detail = await fetchArchiveDetail(summary.id);
      setSelectedBuild(detail);
    } catch (err) {
      console.warn('Failed to load archive build detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Archive className="w-6 h-6 text-teal-600" />
          <span>Historical Archive Explorer</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Independent mirror of archived and legacy LineageOS releases powered by TimSchumi Archive API.
        </p>
      </div>

      {/* Security Warning Notice */}
      <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 sm:p-5 flex items-start gap-4 text-rose-950 dark:text-rose-200">
        <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-sm">Outdated Software & Vulnerability Notice</div>
          <p className="leading-relaxed text-rose-800 dark:text-rose-300">
            Historical archive builds are <strong>discontinued, unsupported, and not actively maintained</strong>. They lack current Android security patches and may contain known vulnerabilities. These builds are preserved strictly for device longevity, legacy testing, and recovery purposes. Never flash historical builds expecting modern security guarantees.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={deviceSearch}
            onChange={(e) => setDeviceSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadSummaries(deviceSearch.trim())}
            placeholder="Search archive by codename (e.g. bramble, mido, bacon, lancelot)..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={() => loadSummaries(deviceSearch.trim())}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Filter
          </button>
        </div>

        <button
          onClick={() => {
            setDeviceSearch('');
            loadSummaries('');
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer"
        >
          Recent 100 Builds
        </button>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Found <span className="font-semibold text-slate-800 dark:text-slate-200">{summaries.length}</span> archive entries
          {deviceSearch && ` for "${deviceSearch}"`}
        </div>
        <a
          href="https://lineage-archive.timschumi.net"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Upstream Archive Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Querying TimSchumi archive mirror...</div>
        </div>
      )}

      {/* Summaries List */}
      {!loading && summaries.length > 0 && (
        <div className="space-y-3">
          {summaries.map((summary) => {
            const isExpanded = selectedBuild?.id === summary.id;
            return (
              <div
                key={summary.id}
                className="rounded-2xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                <div
                  onClick={() => handleSelectBuild(summary)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold">
                        {summary.device}
                      </span>
                      <span className="text-slate-400 text-xs">ID #{summary.id}</span>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-1">
                      {summary.filename}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {isExpanded ? 'Hide Details' : 'View Checksums'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail View */}
                {isExpanded && selectedBuild && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Checksums box */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Cryptographic Hashes
                        </div>

                        {selectedBuild.sha256 && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-[#171D1E] border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300">
                                SHA-256
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleCopy(selectedBuild.sha256!, 'sha256')}
                                  className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedKey === 'sha256' ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  <span>Copy</span>
                                </button>
                                <button
                                  onClick={() =>
                                    onNavigateToVerifier(selectedBuild.sha256!, selectedBuild.filename)
                                  }
                                  className="text-[10px] text-teal-600 hover:underline font-semibold cursor-pointer"
                                >
                                  Verify in Toolbox
                                </button>
                              </div>
                            </div>
                            <code className="block font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all select-all">
                              {selectedBuild.sha256}
                            </code>
                          </div>
                        )}

                        {selectedBuild.md5 && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-[#171D1E] border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-500">MD5</span>
                              <button
                                onClick={() => handleCopy(selectedBuild.md5!, 'md5')}
                                className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                              >
                                {copiedKey === 'md5' ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>Copy</span>
                              </button>
                            </div>
                            <code className="block font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all select-all">
                              {selectedBuild.md5}
                            </code>
                          </div>
                        )}
                      </div>

                      {/* Package Info & Download */}
                      <div className="space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Archive Package Metadata
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            Size:{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {selectedBuild.filesize
                                ? (selectedBuild.filesize / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
                                : 'Unknown'}
                            </span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            Device Codename: <span className="font-mono text-slate-900 dark:text-white">{summary.device}</span>
                          </div>
                        </div>

                        {selectedBuild.url && (
                          <a
                            href={selectedBuild.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-xs"
                          >
                            <DownloadCloud className="w-4 h-4" />
                            <span>Download from Archive Mirror</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && summaries.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          <p className="text-sm font-semibold">No archive builds found for "{deviceSearch}".</p>
          <p className="text-xs mt-1 text-slate-400">
            Confirm the exact device codename, or click "Recent 100 Builds" to browse.
          </p>
        </div>
      )}
    </div>
  );
};
