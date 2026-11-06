import { Router, Request, Response } from 'express';

export const recoveryRouter = Router();

const RECOVERY_PROJECTS = [
  {
    name: 'Harmony Recovery',
    version: '2.0.1 (Preview)',
    latestRelease: '2.0.0',
    type: 'Community Recovery Toolchain',
    repository: 'https://github.com/tahmidgaming700/lineageos-archive-downloader',
    description: 'Android utility for recovery release tracking, reproducible Linux build script generation, and verified ROM handoff.',
    supportedArchitectures: ['ARM64', 'ARM32'],
    documentationUrl: 'https://github.com/tahmidgaming700/lineageos-archive-downloader/blob/main/docs/RELEASE_2.0.0_PLAN.md',
    publishedAt: '2024-05-10T12:00:00Z',
  },
  {
    name: 'Official Lineage Recovery',
    version: 'LineageOS 21.0 / 22.0',
    latestRelease: 'Automated Nightly',
    type: 'Official LineageOS Minimal Recovery',
    repository: 'https://github.com/LineageOS/android_bootable_recovery',
    description: 'The standard recovery shipped with official LineageOS builds. Optimized for A/B OTA payload streaming and signature enforcement.',
    supportedArchitectures: ['ARM64', 'ARM32', 'x86_64'],
    documentationUrl: 'https://wiki.lineageos.org/',
    publishedAt: '2024-11-01T00:00:00Z',
  },
  {
    name: 'TWRP (Team Win Recovery Project)',
    version: '3.7.1',
    latestRelease: '3.7.1_12-0',
    type: 'Touch GUI Recovery',
    repository: 'https://github.com/TeamWin/Team-Win-Recovery-Project',
    description: 'Widely used custom recovery with full touch interface, terminal, partition backup (Nandroid), and MTP file transfer.',
    supportedArchitectures: ['ARM64', 'ARM32'],
    documentationUrl: 'https://twrp.me/',
    publishedAt: '2023-12-15T08:00:00Z',
  },
  {
    name: 'OrangeFox Recovery Project',
    version: 'R11.1',
    latestRelease: 'R11.1_6',
    type: 'Enhanced Touch Recovery',
    repository: 'https://gitlab.com/OrangeFox',
    description: 'Modern, Material-inspired recovery featuring built-in decryption engines, Magisk survival, and theme engines.',
    supportedArchitectures: ['ARM64'],
    documentationUrl: 'https://orangefox.download/',
    publishedAt: '2024-01-20T10:00:00Z',
  },
];

recoveryRouter.get('/releases', (req: Request, res: Response) => {
  res.json(RECOVERY_PROJECTS);
});

/**
 * Validates parameters and generates the exact Linux build script
 * as implemented in HarmonyRecoveryBuildScreen.kt
 */
recoveryRouter.post('/generate-script', (req: Request, res: Response) => {
  const { manifestUrl, branch, codename, lunchTarget, buildTarget } = req.body || {};

  if (!manifestUrl || !branch || !codename || !lunchTarget || !buildTarget) {
    return res.status(400).json({
      error: 'Missing required parameters. Provide manifestUrl, branch, codename, lunchTarget, and buildTarget.',
    });
  }

  const validUrl = typeof manifestUrl === 'string' &&
    /^https:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?\/[A-Za-z0-9._~:/-]+$/.test(manifestUrl);

  const validBranch = typeof branch === 'string' &&
    /^[A-Za-z0-9._/-]+$/.test(branch) &&
    !branch.startsWith('-') &&
    !branch.includes('..');

  const validCodename = typeof codename === 'string' && /^[A-Za-z0-9_-]+$/.test(codename);
  const validLunch = typeof lunchTarget === 'string' && /^[A-Za-z0-9_.-]+$/.test(lunchTarget);
  const validTarget = typeof buildTarget === 'string' && /^[A-Za-z0-9_.-]+$/.test(buildTarget);

  if (!validUrl || !validBranch || !validCodename || !validLunch || !validTarget) {
    return res.status(400).json({
      error: 'Invalid parameter format. Use an HTTPS manifest URL and alphanumeric/dash values without special shell metacharacters.',
    });
  }

  const script = `#!/usr/bin/env bash
set -euo pipefail
# Harmony Recovery build plan for device: ${codename}
# Run only on a Linux build host with the required toolchain and disk space.
# Confirm the manifest, branch, device tree and build target with the project maintainers.
WORKDIR="\${HOME}/harmony-recovery-${codename}"
mkdir -p "$WORKDIR"
cd "$WORKDIR"
repo init -u '${manifestUrl}' -b '${branch}'
repo sync -c --force-sync -j"\$(nproc)"
source build/envsetup.sh
lunch '${lunchTarget}'
mka '${buildTarget}'
echo "Build command finished. Locate the output using the source tree's documented output path."
`;

  res.json({
    script,
    manifestUrl,
    branch,
    codename,
    lunchTarget,
    buildTarget,
    notice: 'Run only on a Linux build host with 100+ GB free storage, JDK 17, and required Android build dependencies. This does not compile on-device.',
  });
});
