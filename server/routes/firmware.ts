import { Router, Request, Response } from 'express';
import { FALLBACK_ADDON_RELEASES } from '../data/fallbackReleases';
import { AddonRelease } from '../../src/types';

export const firmwareRouter = Router();

let addonCache: { data: AddonRelease[]; timestamp: number } | null = null;
const ADDON_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getAddons(): Promise<AddonRelease[]> {
  const now = Date.now();
  if (addonCache && now - addonCache.timestamp < ADDON_CACHE_TTL_MS) {
    return addonCache.data;
  }

  try {
    const results: AddonRelease[] = [];

    // MindTheGapps
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://api.github.com/repos/MindTheGapps/MindTheGapps/releases?per_page=3', {
        signal: controller.signal,
        headers: { 'User-Agent': 'LineageOS-Web-Hub' },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const list: any[] = await res.json();
        for (const r of list) {
          results.push({
            name: r.name || r.tag_name,
            tag_name: r.tag_name,
            published_at: r.published_at,
            html_url: r.html_url,
            category: 'GApps',
            assets: (r.assets || []).map((a: any) => ({
              name: a.name,
              size: a.size || 0,
              download_url: a.browser_download_url,
            })),
          });
        }
      }
    } catch (e) {
      console.warn('Error fetching MindTheGapps:', e);
    }

    // Magisk
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://api.github.com/repos/topjohnwu/Magisk/releases?per_page=2', {
        signal: controller.signal,
        headers: { 'User-Agent': 'LineageOS-Web-Hub' },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const list: any[] = await res.json();
        for (const r of list) {
          results.push({
            name: `Magisk ${r.tag_name}`,
            tag_name: r.tag_name,
            published_at: r.published_at,
            html_url: r.html_url,
            category: 'Magisk',
            assets: (r.assets || []).map((a: any) => ({
              name: a.name,
              size: a.size || 0,
              download_url: a.browser_download_url,
            })),
          });
        }
      }
    } catch (e) {
      console.warn('Error fetching Magisk:', e);
    }

    if (results.length > 0) {
      addonCache = { data: results, timestamp: now };
      return results;
    }
  } catch (err) {
    console.warn('Failed to fetch addon releases, using fallback:', err);
  }

  addonCache = { data: FALLBACK_ADDON_RELEASES, timestamp: now };
  return FALLBACK_ADDON_RELEASES;
}

firmwareRouter.get('/', async (req: Request, res: Response) => {
  try {
    const addons = await getAddons();
    res.json(addons);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve firmware addons', message: err.message });
  }
});
