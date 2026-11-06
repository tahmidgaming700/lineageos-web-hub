import React from 'react';
import { ExternalLink, ShieldAlert, Heart } from 'lucide-react';
import { AppSection } from '../../types';

interface FooterProps {
  onNavigate: (section: AppSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-[#F2F5F6]/50 dark:bg-[#171D1E]/50 px-4 sm:px-8 py-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Brand & Mission */}
        <div className="max-w-md space-y-2">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>LineageOS Web Hub</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
            An open Android community platform providing verified official LineageOS build discovery, historical archive access, Treble GSI compatibility tooling, and browser-based firmware verification utilities.
          </p>
          <div className="text-[10px] text-slate-400 pt-1">
            Built with Puter.js and Google Material 3 design system.
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-[11px]">
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Platform</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-teal-600 cursor-pointer">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('devices')} className="hover:text-teal-600 cursor-pointer">
                  Device Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('downloads')} className="hover:text-teal-600 cursor-pointer">
                  ROM Downloads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('archive')} className="hover:text-teal-600 cursor-pointer">
                  Historical Archives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gsi')} className="hover:text-teal-600 cursor-pointer">
                  GSI Discovery
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Developer Tools</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('toolbox')} className="hover:text-teal-600 cursor-pointer">
                  SHA-256 Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('toolbox')} className="hover:text-teal-600 cursor-pointer">
                  Build.prop Viewer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compatibility')} className="hover:text-teal-600 cursor-pointer">
                  GSI Compatibility Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recovery')} className="hover:text-teal-600 cursor-pointer">
                  Harmony Recovery Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guides')} className="hover:text-teal-600 cursor-pointer">
                  Installation Guides
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Upstream Projects</div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://wiki.lineageos.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  LineageOS Wiki <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://download.lineageos.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  Official Downloads <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://lineage-archive.timschumi.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  TimSchumi Archive <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tahmidgaming700/lineageos-archive-downloader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  GitHub Repository <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal & Safety Disclaimer */}
      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Independent community utility. Not affiliated with or endorsed by LineageOS or Google LLC.</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Created for the Android enthusiast community</span>
        </div>
      </div>
    </footer>
  );
};
