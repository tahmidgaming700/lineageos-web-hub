import { Router, Request, Response } from 'express';
import { FALLBACK_GSI_RELEASES } from '../data/fallbackGsi';
import { GsiRelease, GsiAsset } from '../../src/types';

export const gsiRouter = Router();

let gsiCache: { data: GsiRelease[]; timestamp: number } | null = null;
const GSI_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function parseAssetArchitecture(name: string): 'arm64' | 'arm' | 'x86_64' | 'x86' | 'all' {
  const lower = name.toLowerCase();
  if (lower.includes('arm64') || lower.includes('aarch64')) return 'arm64';
  if (lower.includes('x86_64') || lower.includes('amd64')) return 'x86_64';
  if (lower.includes('x86') || lower.includes('i686')) return 'x86';
  if (lower.includes('arm') || lower.includes('a32') || lower.includes('armeabi')) return 'arm';
  return 'all';
}

function parseAssetVariant(name: string): string {
  const lower = name.toLowerCase();
  const variants: string[] = [];
  if (lower.includes('bgn')) variants.push('bgN (GApps A/B)');
  else if (lower.includes('bvn')) variants.push('bvN (Vanilla A/B)');
  else if (lower.includes('bgs')) variants.push('bgS (GApps + SU A/B)');
  else if (lower.includes('bvs')) variants.push('bvS (Vanilla + SU A/B)');
  
  if (lower.includes('vndklite') || lower.includes('vndk-lite')) {
    variants.push('vndklite');
  }
  return variants.join(' · ') || 'Generic A/B';
}

function parseFileType(name: string): 'raw_img' | 'xz' | 'gz' | 'zip' {
  if (name.endsWith('.xz')) return 'xz';
  if (name.endsWith('.gz')) return 'gz';
  if (name.endsWith('.zip')) return 'zip';
  return 'raw_img';
}

async function getLiveGsiReleases(): Promise<GsiRelease[]> {
  const now = Date.now();
  if (gsiCache && now - gsiCache.timestamp < GSI_CACHE_TTL_MS) {
    return gsiCache.data;
  }

  try {
    const repos = [
      { repo: 'ponces/treble_build_los', maintainer: 'ponces' },
      { repo: 'AndyYan/lineage_build_unified', maintainer: 'AndyYan' },
    ];

    const results: GsiRelease[] = [];

    for (const item of repos) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const resp = await fetch(`https://api.github.com/repos/${item.repo}/releases?per_page=3`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'LineageOS-Web-Hub',
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        clearTimeout(timeout);

        if (resp.ok) {
          const releases: any[] = await resp.json();
          for (const rel of releases) {
            const assets: GsiAsset[] = (rel.assets || [])
              .filter((a: any) => a.name.endsWith('.img.xz') || a.name.endsWith('.img.gz') || a.name.endsWith('.img') || a.name.endsWith('.zip'))
              .map((a: any) => ({
                name: a.name,
                size: a.size || 0,
                browser_download_url: a.browser_download_url,
                architecture: parseAssetArchitecture(a.name),
                variant: parseAssetVariant(a.name),
                file_type: parseFileType(a.name),
              }));

            results.push({
              id: rel.id,
              tag_name: rel.tag_name,
              name: rel.name || rel.tag_name,
              maintainer: item.maintainer,
              repository: item.repo,
              html_url: rel.html_url,
              published_at: rel.published_at,
              body: rel.body || '',
              android_version: rel.tag_name.includes('21') ? 'Android 14 (API 34)' : 'Android 13 (API 33)',
              lineage_version: rel.tag_name.includes('21') ? 'LineageOS 21.0' : 'LineageOS 20.0',
              assets,
            });
          }
        }
      } catch (repoErr) {
        console.warn(`Error fetching releases for ${item.repo}:`, repoErr);
      }
    }

    if (results.length > 0) {
      gsiCache = { data: results, timestamp: now };
      return results;
    }
  } catch (err) {
    console.warn('GSI release fetch failed, using fallback:', err);
  }

  gsiCache = { data: FALLBACK_GSI_RELEASES, timestamp: now };
  return FALLBACK_GSI_RELEASES;
}

gsiRouter.get('/releases', async (req: Request, res: Response) => {
  try {
    const releases = await getLiveGsiReleases();
    const arch = typeof req.query.arch === 'string' ? req.query.arch.toLowerCase() : '';
    const variant = typeof req.query.variant === 'string' ? req.query.variant.toLowerCase() : '';

    let filtered = releases;

    if (arch && arch !== 'all') {
      filtered = filtered.map(rel => ({
        ...rel,
        assets: rel.assets.filter(a => a.architecture === arch || a.architecture === 'all'),
      })).filter(rel => rel.assets.length > 0);
    }

    if (variant && variant !== 'all') {
      filtered = filtered.map(rel => ({
        ...rel,
        assets: rel.assets.filter(a => a.variant.toLowerCase().includes(variant)),
      })).filter(rel => rel.assets.length > 0);
    }

    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve GSI releases', message: err.message });
  }
});
