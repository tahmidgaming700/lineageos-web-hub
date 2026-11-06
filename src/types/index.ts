export interface LineageDevice {
  model: string;          // codename, e.g. "akita", "alioth", "bramble"
  oem: string;            // manufacturer, e.g. "Google", "Xiaomi"
  name: string;           // commercial name, e.g. "Pixel 8a", "POCO F3"
  lineage_recovery?: boolean;
  cpu?: string;
  soc?: string;
  architecture?: 'arm64' | 'arm' | 'x86_64' | 'x86';
  ram?: string;
  battery?: string;
  release_year?: number;
  screen?: string;
  wiki_url?: string;
}

export interface LineageFile {
  filename: string;
  size?: number;
  sha256?: string;
  sha1?: string;
  md5?: string;
  url?: string;
  os_patch_level?: string;
  os_sdk_level?: number;
  type?: string;
  date?: string;
  datetime?: number;
}

export interface LineageBuild {
  date: string;
  datetime: number;
  type?: string;
  version?: string;
  files: LineageFile[];
}

export interface ArchiveBuildSummary {
  id: number;
  filename: string;
  device: string;
}

export interface ArchiveBuildDetail {
  id: number;
  filename: string;
  device?: string;
  filesize?: number;
  md5?: string;
  sha1?: string;
  sha256?: string;
  sha512?: string;
  url?: string;
  path?: string;
  date?: string;
}

export interface GsiAsset {
  name: string;
  size: number;
  browser_download_url: string;
  architecture: 'arm64' | 'arm' | 'x86_64' | 'x86' | 'all';
  variant: string;       // e.g. "bgN", "bvN", "bvS", "vndklite"
  file_type: 'raw_img' | 'xz' | 'gz' | 'zip';
  sha256?: string;
}

export interface GsiRelease {
  id: number | string;
  tag_name: string;
  name: string;
  maintainer: string;
  repository: string;
  html_url: string;
  published_at: string;
  body: string;
  android_version: string;
  lineage_version: string;
  assets: GsiAsset[];
}

export interface AddonRelease {
  name: string;
  tag_name: string;
  published_at: string;
  html_url: string;
  category: 'GApps' | 'Magisk' | 'Recovery';
  assets: {
    name: string;
    size: number;
    download_url: string;
  }[];
}

export interface HarmonyRecoveryConfig {
  manifestUrl: string;
  branch: string;
  codename: string;
  lunchTarget: string;
  buildTarget: string;
}

export type AppSection = 
  | 'dashboard'
  | 'devices'
  | 'downloads'
  | 'archive'
  | 'gsi'
  | 'compatibility'
  | 'recovery'
  | 'toolbox'
  | 'guides'
  | 'releases'
  | 'bookmarks';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  savedDevices: string[]; // codenames
  bookmarkedBuilds: {
    codename: string;
    filename: string;
    version: string;
    date: string;
    url: string;
  }[];
  personalNotes: Record<string, string>; // codename -> note
}
