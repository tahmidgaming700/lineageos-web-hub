import { Router, Request, Response } from 'express';
import { FALLBACK_DEVICES } from '../data/fallbackDevices';
import { FALLBACK_GSI_RELEASES } from '../data/fallbackGsi';

export const searchRouter = Router();

const TOOLBOX_ENTRIES = [
  { title: 'SHA-256 Calculator', subtitle: 'Compute SHA-256 hash in browser using Web Crypto', targetSection: 'toolbox', toolId: 'sha256' },
  { title: 'File Checksum Verifier', subtitle: 'Compare ROM zip digest against expected hash', targetSection: 'toolbox', toolId: 'verifier' },
  { title: 'Build.prop Viewer & Parser', subtitle: 'Inspect system properties, Treble flags & API level', targetSection: 'toolbox', toolId: 'buildprop' },
  { title: 'Android Version & API Level Reference', subtitle: 'Chronological Android releases and SDK mappings', targetSection: 'toolbox', toolId: 'androidversions' },
  { title: 'OTA Metadata & Payload Properties Viewer', subtitle: 'Parse payload_properties.txt and hash offsets', targetSection: 'toolbox', toolId: 'payload' },
  { title: 'Firmware Build Number Parser', subtitle: 'Decode Pixel, Samsung, and Xiaomi build strings', targetSection: 'toolbox', toolId: 'buildparser' },
  { title: 'Partition Layout Reference', subtitle: 'Understand A/B, Super dynamic partitions & boot.img', targetSection: 'toolbox', toolId: 'partitions' },
  { title: 'Fastboot & Recovery Command Builder', subtitle: 'Generate safe flash, sideload, and boot commands', targetSection: 'toolbox', toolId: 'fastboot' },
  { title: 'JSON Formatter & Validator', subtitle: 'Format and lint device configurations and metadata', targetSection: 'toolbox', toolId: 'json' },
];

const GUIDE_ENTRIES = [
  { title: 'Installing Official LineageOS', subtitle: 'Step-by-step sideload, recovery and data wipe guide', targetSection: 'guides', guideId: 'install' },
  { title: 'Bootloader Unlocking Guide', subtitle: 'OEM unlocking and fastboot unlock commands by manufacturer', targetSection: 'guides', guideId: 'bootloader' },
  { title: 'GSI Flashing & Treble Guide', subtitle: 'How to flash Generic System Images via fastbootd', targetSection: 'guides', guideId: 'gsi' },
  { title: 'Understanding Dynamic Partitions', subtitle: 'Super partition, fastboot vs fastbootd, and resizing', targetSection: 'guides', guideId: 'dynamic' },
  { title: 'Checksum Verification Tutorial', subtitle: 'Verifying file integrity before flashing', targetSection: 'guides', guideId: 'verify' },
  { title: 'Troubleshooting Bootloops & Unbricking', subtitle: 'Recovery logs, clean wipe, and factory restore', targetSection: 'guides', guideId: 'bootloops' },
];

searchRouter.get('/', async (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

  if (!query) {
    return res.json([]);
  }

  const results: any[] = [];

  // Search Devices
  for (const device of FALLBACK_DEVICES) {
    if (
      device.model.toLowerCase().includes(query) ||
      device.name.toLowerCase().includes(query) ||
      device.oem.toLowerCase().includes(query) ||
      (device.cpu && device.cpu.toLowerCase().includes(query))
    ) {
      results.push({
        type: 'device',
        title: `${device.name} (${device.model})`,
        subtitle: `${device.oem} · ${device.cpu || 'ARM64'} · ${device.screen || 'AMOLED'}`,
        codename: device.model,
        targetSection: 'downloads',
        meta: device,
      });
    }
  }

  // Search Tools
  for (const tool of TOOLBOX_ENTRIES) {
    if (tool.title.toLowerCase().includes(query) || tool.subtitle.toLowerCase().includes(query)) {
      results.push({
        type: 'tool',
        title: tool.title,
        subtitle: tool.subtitle,
        targetSection: 'toolbox',
        meta: { toolId: tool.toolId },
      });
    }
  }

  // Search Guides
  for (const guide of GUIDE_ENTRIES) {
    if (guide.title.toLowerCase().includes(query) || guide.subtitle.toLowerCase().includes(query)) {
      results.push({
        type: 'guide',
        title: guide.title,
        subtitle: guide.subtitle,
        targetSection: 'guides',
        meta: { guideId: guide.guideId },
      });
    }
  }

  // Search GSIs
  for (const gsi of FALLBACK_GSI_RELEASES) {
    if (
      gsi.name.toLowerCase().includes(query) ||
      gsi.maintainer.toLowerCase().includes(query) ||
      gsi.lineage_version.toLowerCase().includes(query) ||
      gsi.assets.some(a => a.name.toLowerCase().includes(query))
    ) {
      results.push({
        type: 'gsi',
        title: gsi.name,
        subtitle: `${gsi.maintainer} · ${gsi.android_version}`,
        targetSection: 'gsi',
        meta: gsi,
      });
    }
  }

  res.json(results.slice(0, 20));
});
