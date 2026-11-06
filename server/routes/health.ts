import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'LineageOS Web Hub',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      officialLineageDevices: 'active',
      officialLineageBuilds: 'active',
      timschumiArchive: 'active',
      gsiDiscovery: 'active',
      harmonyRecovery: 'active',
      geminiFallback: !!process.env.GEMINI_API_KEY ? 'configured' : 'disabled',
    },
  });
});
