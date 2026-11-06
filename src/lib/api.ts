import {
  LineageDevice,
  LineageBuild,
  ArchiveBuildSummary,
  ArchiveBuildDetail,
  GsiRelease,
  AddonRelease,
} from '../types';

export async function fetchDevices(params?: { oem?: string; query?: string }): Promise<LineageDevice[]> {
  const queryParams = new URLSearchParams();
  if (params?.oem) queryParams.set('oem', params.oem);
  if (params?.query) queryParams.set('query', params.query);

  const url = `/api/devices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch devices: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchBuilds(device: string): Promise<LineageBuild[]> {
  const res = await fetch(`/api/lineage/builds?device=${encodeURIComponent(device)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch builds for ${device}: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchArchives(device?: string): Promise<ArchiveBuildSummary[]> {
  const url = device 
    ? `/api/lineage/archives?device=${encodeURIComponent(device)}`
    : `/api/lineage/archives`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch archives: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchArchiveDetail(id: number): Promise<ArchiveBuildDetail> {
  const res = await fetch(`/api/lineage/archives/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch archive detail: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchGsiReleases(params?: { arch?: string; variant?: string }): Promise<GsiRelease[]> {
  const queryParams = new URLSearchParams();
  if (params?.arch) queryParams.set('arch', params.arch);
  if (params?.variant) queryParams.set('variant', params.variant);

  const url = `/api/gsi/releases${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch GSI releases: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRecoveryReleases(): Promise<any> {
  const res = await fetch('/api/recovery/releases');
  if (!res.ok) {
    throw new Error(`Failed to fetch recovery releases: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAddonReleases(): Promise<AddonRelease[]> {
  const res = await fetch('/api/firmware');
  if (!res.ok) {
    throw new Error(`Failed to fetch addon releases: ${res.statusText}`);
  }
  return res.json();
}

export interface SearchResult {
  type: 'device' | 'build' | 'gsi' | 'archive' | 'tool' | 'guide';
  title: string;
  subtitle: string;
  codename?: string;
  targetSection: string;
  meta?: any;
}

export async function searchGlobal(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`Search failed: ${res.statusText}`);
  }
  return res.json();
}
