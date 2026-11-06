import { Router, Request, Response } from 'express';
import { LineageBuild } from '../../src/types';

export const lineageRouter = Router();

// Per-device build cache: codename -> { data, timestamp }
const buildCache = new Map<string, { data: LineageBuild[]; timestamp: number }>();
const BUILD_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

lineageRouter.get('/builds', async (req: Request, res: Response) => {
  const device = typeof req.query.device === 'string' ? req.query.device.trim() : '';

  if (!device) {
    return res.status(400).json({ error: 'Missing device parameter' });
  }

  // Validate codename format
  if (!/^[A-Za-z0-9_-]+$/.test(device)) {
    return res.status(400).json({ error: 'Invalid device codename format' });
  }

  const cacheKey = device.toLowerCase();
  const cached = buildCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < BUILD_CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const resp = await fetch(`https://download.lineageos.org/api/v2/devices/${encodeURIComponent(device)}/builds`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LineageOS-Web-Hub' },
    });
    clearTimeout(timeout);

    if (resp.status === 404) {
      // Device might not have current official builds
      buildCache.set(cacheKey, { data: [], timestamp: now });
      return res.json([]);
    }

    if (resp.ok) {
      const data: LineageBuild[] = await resp.json();
      buildCache.set(cacheKey, { data, timestamp: now });
      return res.json(data);
    }

    // If upstream returns non-200, return cached or empty
    if (cached) {
      return res.json(cached.data);
    }

    res.status(resp.status).json({ error: 'Upstream LineageOS API error', status: resp.status });
  } catch (err: any) {
    if (cached) {
      return res.json(cached.data);
    }
    res.status(502).json({ error: 'Failed to contact download.lineageos.org', message: err.message });
  }
});
