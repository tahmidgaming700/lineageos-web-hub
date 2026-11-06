import { Router, Request, Response } from 'express';
import { ArchiveBuildSummary, ArchiveBuildDetail } from '../../src/types';

export const archivesRouter = Router();

let summariesCache: { data: ArchiveBuildSummary[]; timestamp: number } | null = null;
const detailCache = new Map<number, { data: ArchiveBuildDetail; timestamp: number }>();

const ARCHIVE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getArchiveSummaries(): Promise<ArchiveBuildSummary[]> {
  const now = Date.now();
  if (summariesCache && now - summariesCache.timestamp < ARCHIVE_CACHE_TTL_MS) {
    return summariesCache.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch('https://lineage-archive.timschumi.net/api/builds', {
      signal: controller.signal,
      headers: { 'User-Agent': 'LineageOS-Web-Hub' },
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data: ArchiveBuildSummary[] = await resp.json();
      summariesCache = { data, timestamp: now };
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch TimSchumi archive summaries:', err);
  }

  return summariesCache ? summariesCache.data : [];
}

archivesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const device = typeof req.query.device === 'string' ? req.query.device.trim().toLowerCase() : '';
    const summaries = await getArchiveSummaries();

    if (device) {
      const filtered = summaries.filter(s => s.device.toLowerCase() === device);
      return res.json(filtered);
    }

    // Return the latest 100 entries if no device specified
    res.json(summaries.slice(0, 100));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve archive builds', message: err.message });
  }
});

archivesRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid build ID' });
  }

  const now = Date.now();
  const cached = detailCache.get(id);
  if (cached && now - cached.timestamp < ARCHIVE_CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch(`https://lineage-archive.timschumi.net/api/builds/${id}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LineageOS-Web-Hub' },
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data: ArchiveBuildDetail = await resp.json();
      detailCache.set(id, { data, timestamp: now });
      return res.json(data);
    }

    res.status(resp.status).json({ error: 'Archive build detail not found' });
  } catch (err: any) {
    if (cached) return res.json(cached.data);
    res.status(502).json({ error: 'Failed to contact archive API', message: err.message });
  }
});
