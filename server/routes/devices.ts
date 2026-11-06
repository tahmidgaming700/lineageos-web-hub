import { Router, Request, Response } from 'express';
import { FALLBACK_DEVICES } from '../data/fallbackDevices';
import { LineageDevice } from '../../src/types';

export const devicesRouter = Router();

interface CacheStore {
  data: LineageDevice[] | null;
  timestamp: number;
}

const cache: CacheStore = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getOfficialDevices(): Promise<LineageDevice[]> {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch('https://raw.githubusercontent.com/LineageOS/hudson/main/updater/devices.json', {
      signal: controller.signal,
      headers: { 'User-Agent': 'LineageOS-Web-Hub' },
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const rawDevices: { model: string; oem: string; name: string; lineage_recovery?: boolean }[] = await resp.json();
      
      // Index fallback devices for rich metadata lookup
      const specMap = new Map<string, Partial<LineageDevice>>();
      for (const d of FALLBACK_DEVICES) {
        specMap.set(d.model.toLowerCase(), d);
      }

      const merged: LineageDevice[] = rawDevices.map(d => {
        const extra = specMap.get(d.model.toLowerCase());
        return {
          model: d.model,
          oem: d.oem,
          name: d.name,
          lineage_recovery: d.lineage_recovery ?? extra?.lineage_recovery ?? true,
          cpu: extra?.cpu,
          soc: extra?.soc,
          architecture: extra?.architecture || 'arm64',
          ram: extra?.ram,
          battery: extra?.battery,
          release_year: extra?.release_year,
          screen: extra?.screen,
          wiki_url: `https://wiki.lineageos.org/devices/${d.model}/`,
        };
      });

      cache.data = merged;
      cache.timestamp = now;
      return merged;
    }
  } catch (err) {
    console.warn('Failed to fetch from hudson devices.json, using fallback:', err);
  }

  // Fallback to local curated list
  cache.data = FALLBACK_DEVICES;
  cache.timestamp = now;
  return FALLBACK_DEVICES;
}

devicesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const devices = await getOfficialDevices();
    const oem = typeof req.query.oem === 'string' ? req.query.oem.toLowerCase() : '';
    const query = typeof req.query.query === 'string' ? req.query.query.toLowerCase() : '';

    let filtered = devices;

    if (oem) {
      filtered = filtered.filter(d => d.oem.toLowerCase() === oem);
    }

    if (query) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.model.toLowerCase().includes(query) ||
        d.oem.toLowerCase().includes(query)
      );
    }

    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve devices', message: err.message });
  }
});
