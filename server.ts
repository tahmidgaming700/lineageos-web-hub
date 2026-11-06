import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { devicesRouter } from './server/routes/devices';
import { lineageRouter } from './server/routes/lineage';
import { archivesRouter } from './server/routes/archives';
import { gsiRouter } from './server/routes/gsi';
import { recoveryRouter } from './server/routes/recovery';
import { firmwareRouter } from './server/routes/firmware';
import { searchRouter } from './server/routes/search';
import { assistantRouter } from './server/routes/assistant';
import { healthRouter } from './server/routes/health';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // API Routes
  app.use('/api/devices', devicesRouter);
  app.use('/api/lineage', lineageRouter);
  app.use('/api/lineage/archives', archivesRouter);
  app.use('/api/gsi', gsiRouter);
  app.use('/api/recovery', recoveryRouter);
  app.use('/api/firmware', firmwareRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/assistant', assistantRouter);
  app.use('/api/health', healthRouter);

  // Client-side serving
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] LineageOS Web Hub running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
