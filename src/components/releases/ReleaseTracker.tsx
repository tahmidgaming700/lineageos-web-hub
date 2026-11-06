import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  DownloadCloud,
  Calendar,
} from 'lucide-react';
import { fetchAddonReleases, fetchGsiReleases } from '../../lib/api';
import { AddonRelease, GsiRelease } from '../../types';

export const ReleaseTracker: React.FC = () => {
  const [addons, setAddons] = useState<AddonRelease[]>([]);
  const [gsis, setGsis] = useState<GsiRelease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchAddonReleases(), fetchGsiReleases()])
      .then(([addonData, gsiData]) => {
        if (mounted) {
          setAddons(addonData);
          setGsis(gsiData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Release tracker fetch error:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-teal-600" />
          <span>Android Firmware Release Tracker</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track official releases, addon updates (GApps, Magisk), community GSIs, and Harmony Recovery toolchains.
        </p>
      </div>

      {loading && (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Checking release feeds...</div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Addons Column */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>GApps, Magisk & Addon Releases</span>
            </h2>

            <div className="space-y-3">
              {addons.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono">
                        {rel.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {rel.name}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Tag: <code className="font-mono">{rel.tag_name}</code>
                      </div>
                    </div>

                    <a
                      href={rel.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View on GitHub"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Assets */}
                  {rel.assets.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {rel.assets.map((asset, aIdx) => (
                        <div
                          key={aIdx}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                        >
                          <span className="font-mono text-[11px] truncate pr-2 text-slate-700 dark:text-slate-300">
                            {asset.name}
                          </span>
                          <a
                            href={asset.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:underline shrink-0"
                          >
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GSI Column */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Community GSI Updates</span>
            </h2>

            <div className="space-y-3">
              {gsis.map((rel) => (
                <div
                  key={rel.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1B2122] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-mono">
                        {rel.lineage_version}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {rel.name}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        By <strong>{rel.maintainer}</strong> · {rel.android_version}
                      </div>
                    </div>

                    <a
                      href={rel.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View release notes"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="text-xs text-slate-500 pt-1">
                    Assets published: <strong>{rel.assets.length}</strong> system images
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
