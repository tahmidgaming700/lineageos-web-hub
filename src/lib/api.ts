import {
  LineageDevice,
  LineageBuild,
  ArchiveBuildSummary,
  ArchiveBuildDetail,
  GsiRelease,
  AddonRelease,
} from '../types';
import { FALLBACK_DEVICES } from '../../server/data/fallbackDevices';

const GITHUB_HEADERS = { Accept: 'application/vnd.github+json' };

async function getJson<T>(url: string, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: url.includes('api.github.com') ? GITHUB_HEADERS : undefined,
    });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchDevices(params?: { oem?: string; query?: string }): Promise<LineageDevice[]> {
  let devices: LineageDevice[] = FALLBACK_DEVICES;
  try {
    const upstream = await getJson<Array<{ model: string; oem: string; name: string; lineage_recovery?: boolean }>>(
      'https://raw.githubusercontent.com/LineageOS/hudson/main/updater/devices.json',
    );
    if (Array.isArray(upstream) && upstream.length) {
      const extras = new Map(FALLBACK_DEVICES.map((device) => [device.model.toLowerCase(), device]));
      devices = upstream.map((device) => {
        const extra = extras.get(device.model.toLowerCase());
        return {
          model: device.model,
          oem: device.oem,
          name: device.name,
          lineage_recovery: device.lineage_recovery ?? extra?.lineage_recovery,
          cpu: extra?.cpu,
          soc: extra?.soc,
          architecture: extra?.architecture ?? 'arm64',
          ram: extra?.ram,
          battery: extra?.battery,
          release_year: extra?.release_year,
          screen: extra?.screen,
          wiki_url: `https://wiki.lineageos.org/devices/${device.model}/`,
        };
      });
    }
  } catch (error) {
    console.warn('Live LineageOS device list unavailable; showing the bundled reference list.', error);
  }

  const oem = params?.oem?.toLowerCase();
  const query = params?.query?.trim().toLowerCase();
  return devices.filter((device) =>
    (!oem || device.oem.toLowerCase() === oem) &&
    (!query || [device.name, device.model, device.oem].some((value) => value.toLowerCase().includes(query))),
  );
}

export async function fetchBuilds(device: string): Promise<LineageBuild[]> {
  if (!/^[A-Za-z0-9_-]+$/.test(device)) throw new Error('Invalid device codename.');
  try {
    const result = await getJson<LineageBuild[]>(
      `https://download.lineageos.org/api/v2/devices/${encodeURIComponent(device)}/builds`,
    );
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.warn('Official LineageOS build API is unavailable in this browser.', error);
    return [];
  }
}

export async function fetchArchives(device?: string): Promise<ArchiveBuildSummary[]> {
  const url = new URL('https://lineage-archive.timschumi.net/api/builds');
  if (device) url.searchParams.set('device', device);
  try {
    const result = await getJson<ArchiveBuildSummary[]>(url.toString());
    return Array.isArray(result) ? (device ? result.filter((item) => item.device.toLowerCase() === device.toLowerCase()) : result.slice(0, 100)) : [];
  } catch (error) {
    console.warn('Historical archive API is unavailable or blocks browser requests.', error);
    return [];
  }
}

export async function fetchArchiveDetail(id: number): Promise<ArchiveBuildDetail> {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Invalid archive build ID.');
  return getJson<ArchiveBuildDetail>(`https://lineage-archive.timschumi.net/api/builds/${id}`);
}

function parseArchitecture(name: string): GsiRelease['assets'][number]['architecture'] {
  const value = name.toLowerCase();
  if (value.includes('arm64') || value.includes('aarch64')) return 'arm64';
  if (value.includes('x86_64') || value.includes('amd64')) return 'x86_64';
  if (value.includes('i686') || value.includes('x86')) return 'x86';
  if (value.includes('arm')) return 'arm';
  return 'all';
}

function parseVariant(name: string): string {
  const value = name.toLowerCase();
  const parts = [];
  if (value.includes('bgn')) parts.push('bgN (GApps A/B)');
  else if (value.includes('bvn')) parts.push('bvN (Vanilla A/B)');
  else if (value.includes('bgs')) parts.push('bgS (GApps + SU A/B)');
  else if (value.includes('bvs')) parts.push('bvS (Vanilla + SU A/B)');
  if (value.includes('vndklite')) parts.push('vndklite');
  return parts.join(' · ') || 'Generic';
}

export async function fetchGsiReleases(params?: { arch?: string; variant?: string }): Promise<GsiRelease[]> {
  const repositories = [
    { fullName: 'ponces/treble_build_los', maintainer: 'ponces' },
    { fullName: 'AndyYan/lineage_build_unified', maintainer: 'AndyYan' },
  ];
  const settled = await Promise.allSettled(repositories.map(async ({ fullName, maintainer }) => {
    const releases = await getJson<any[]>(`https://api.github.com/repos/${fullName}/releases?per_page=5`);
    return releases.map((release): GsiRelease => ({
      id: release.id,
      tag_name: release.tag_name,
      name: release.name || release.tag_name,
      maintainer,
      repository: fullName,
      html_url: release.html_url,
      published_at: release.published_at,
      body: release.body || '',
      android_version: release.tag_name?.includes('21') ? 'Android 14 (API 34)' : 'See upstream release notes',
      lineage_version: release.tag_name?.includes('21') ? 'LineageOS 21.0' : 'See upstream release notes',
      assets: (release.assets || [])
        .filter((asset: any) => /\.(img(\.xz|\.gz)?|zip)$/i.test(asset.name))
        .map((asset: any) => ({
          name: asset.name,
          size: asset.size || 0,
          browser_download_url: asset.browser_download_url,
          architecture: parseArchitecture(asset.name),
          variant: parseVariant(asset.name),
          file_type: asset.name.endsWith('.xz') ? 'xz' : asset.name.endsWith('.gz') ? 'gz' : asset.name.endsWith('.zip') ? 'zip' : 'raw_img',
        })),
    }));
  }));

  const live = settled.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
  const releases = live;
  return releases.map((release) => ({
    ...release,
    assets: release.assets.filter((asset) =>
      (!params?.arch || params.arch === 'all' || asset.architecture === params.arch || asset.architecture === 'all') &&
      (!params?.variant || params.variant === 'all' || asset.variant.toLowerCase().includes(params.variant.toLowerCase())),
    ),
  })).filter((release) => release.assets.length > 0);
}

export async function fetchRecoveryReleases(): Promise<any[]> {
  const repositories = [
    { name: 'Harmony Recovery', repo: 'tahmidgaming700/lineageos-archive-downloader', type: 'Community Recovery Toolchain' },
    { name: 'TWRP', repo: 'TeamWin/android_bootable_recovery', type: 'Touch GUI Recovery' },
  ];
  const results = await Promise.allSettled(repositories.map(async (project) => {
    const releases = await getJson<any[]>(`https://api.github.com/repos/${project.repo}/releases?per_page=3`);
    return releases.map((release) => ({
      name: project.name,
      version: release.tag_name,
      latestRelease: release.tag_name,
      type: project.type,
      repository: `https://github.com/${project.repo}`,
      description: release.body || 'See the upstream release notes for details.',
      supportedArchitectures: ['ARM64'],
      documentationUrl: `https://github.com/${project.repo}/releases`,
      publishedAt: release.published_at,
      assets: (release.assets || []).map((asset: any) => ({
        name: asset.name,
        download_url: asset.browser_download_url,
        size: asset.size,
      })),
    }));
  }));
  return results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
}

export async function fetchAddonReleases(): Promise<AddonRelease[]> {
  const repositories = [
    { repo: 'MindTheGapps/MindTheGapps', category: 'GApps' as const, label: '' },
    { repo: 'topjohnwu/Magisk', category: 'Magisk' as const, label: 'Magisk ' },
  ];
  const settled = await Promise.allSettled(repositories.map(async ({ repo, category, label }) => {
    const releases = await getJson<any[]>(`https://api.github.com/repos/${repo}/releases?per_page=3`);
    return releases.map((release): AddonRelease => ({
      name: `${label}${release.name || release.tag_name}`,
      tag_name: release.tag_name,
      published_at: release.published_at,
      html_url: release.html_url,
      category,
      assets: (release.assets || []).map((asset: any) => ({
        name: asset.name,
        size: asset.size || 0,
        download_url: asset.browser_download_url,
      })),
    }));
  }));
  return settled.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
}

export interface SearchResult {
  type: 'device' | 'build' | 'gsi' | 'archive' | 'tool' | 'guide';
  title: string;
  subtitle: string;
  codename?: string;
  targetSection: string;
  meta?: any;
}

const SEARCH_ENTRIES = [
  { title: 'SHA-256 Calculator', subtitle: 'Compute SHA-256 hash in browser using Web Crypto', targetSection: 'toolbox', toolId: 'sha256' },
  { title: 'File Checksum Verifier', subtitle: 'Compare ROM zip digest against expected hash', targetSection: 'toolbox', toolId: 'verifier' },
  { title: 'Build.prop Viewer & Parser', subtitle: 'Inspect system properties, Treble flags & API level', targetSection: 'toolbox', toolId: 'buildprop' },
  { title: 'Android Version & API Level Reference', subtitle: 'Android releases and SDK mappings', targetSection: 'toolbox', toolId: 'androidversions' },
  { title: 'OTA Metadata & Payload Properties Viewer', subtitle: 'Parse payload_properties.txt and hash offsets', targetSection: 'toolbox', toolId: 'payload' },
  { title: 'Firmware Build Number Parser', subtitle: 'Decode Pixel, Samsung, and Xiaomi build strings', targetSection: 'toolbox', toolId: 'buildparser' },
  { title: 'Partition Layout Reference', subtitle: 'Understand A/B, Super dynamic partitions & boot.img', targetSection: 'toolbox', toolId: 'partitions' },
  { title: 'Fastboot & Recovery Command Builder', subtitle: 'Generate safe flash, sideload, and boot commands', targetSection: 'toolbox', toolId: 'fastboot' },
  { title: 'JSON Formatter & Validator', subtitle: 'Format and lint device configurations and metadata', targetSection: 'toolbox', toolId: 'json' },
  { title: 'Installing Official LineageOS', subtitle: 'Step-by-step sideload, recovery and data wipe guide', targetSection: 'guides' },
  { title: 'Bootloader Unlocking Guide', subtitle: 'OEM unlocking and fastboot unlock commands', targetSection: 'guides' },
  { title: 'GSI Flashing & Treble Guide', subtitle: 'How to flash Generic System Images via fastbootd', targetSection: 'guides' },
];

export async function searchGlobal(query: string): Promise<SearchResult[]> {
  const value = query.trim().toLowerCase();
  if (!value) return [];
  const devices = FALLBACK_DEVICES.filter((device) =>
    [device.name, device.model, device.oem, device.cpu || ''].some((field) => field.toLowerCase().includes(value)),
  ).map((device) => ({
    type: 'device' as const,
    title: `${device.name} (${device.model})`,
    subtitle: `${device.oem} · ${device.cpu || device.architecture || 'Android device'}`,
    codename: device.model,
    targetSection: 'downloads',
    meta: device,
  }));
  const tools = SEARCH_ENTRIES.filter((entry) =>
    entry.title.toLowerCase().includes(value) || entry.subtitle.toLowerCase().includes(value),
  ).map((entry) => ({
    type: 'tool' as const,
    title: entry.title,
    subtitle: entry.subtitle,
    targetSection: entry.targetSection,
    meta: 'toolId' in entry ? { toolId: entry.toolId } : undefined,
  }));
  return [...devices, ...tools].slice(0, 20);
}
