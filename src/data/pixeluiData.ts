/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PixelUiBuild } from '../types';

export interface PixelUiFeature {
  title: string;
  category: string;
  description: string;
  tag: string;
}

export const PIXEL_UI_HIGHLIGHT_FEATURES: PixelUiFeature[] = [
  {
    title: 'Authentic Pixel Launcher & At a Glance',
    category: 'Launcher',
    description: 'Real Google Pixel Launcher with integrated At a Glance widget showing live flight alerts, package deliveries, weather, and calendar entries.',
    tag: 'Core UI',
  },
  {
    title: 'Full Material You Monet System',
    category: 'Theming',
    description: 'Native Google algorithmic extraction pulling tonal swatches directly from your wallpaper with matching app icons, keyboard, and system UI.',
    tag: 'Design',
  },
  {
    title: 'Google Photos Unlimited Backup',
    category: 'Cloud Perks',
    description: 'Hardware spoofing profile enabling free unlimited photo and video backup in Google Photos under original or storage saver quality.',
    tag: 'Pixel Feature',
  },
  {
    title: 'Now Playing Ambient Recognition',
    category: 'Audio',
    description: 'Completely offline music identification listening continuously in the background and logging recognized songs on your lock screen.',
    tag: 'AI Feature',
  },
  {
    title: 'Google Recorder with Live Transcription',
    category: 'Productivity',
    description: 'Pixel Recorder app with offline real-time speech-to-text transcriptions, speaker labels, and instant audio search.',
    tag: 'Tensor Port',
  },
  {
    title: 'Google Camera (GCam) & HDR+ Pipeline',
    category: 'Photography',
    description: 'Optimized camera HAL integration supporting Google Camera with Night Sight, Astrophotography, Portrait Blur, and Top Shot.',
    tag: 'Camera',
  },
];

export const PIXEL_UI_BUILDS: PixelUiBuild[] = [
  // Xiaomi / POCO
  {
    id: 'pixelos-alioth-14',
    device: 'alioth',
    deviceName: 'POCO F3 / Redmi K40 / Mi 11X',
    oem: 'Xiaomi',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-12',
    filename: 'PixelOS_alioth-14.0-20240612-1420.zip',
    fileSize: '1.92 GB',
    downloadUrl: 'https://pixelos.net/download/alioth',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/alioth/recovery.img/download',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    features: ['120Hz E4 AMOLED calibrated colors', 'Dolby Atmos Pixel Sound', 'Unlimited Google Photos backup', 'Now Playing offline database'],
    maintainer: 'Gagan',
    changelog: [
      'Merged June 2024 Android 14 Security Update (android-14.0.0_r45)',
      'Updated Leica Camera integration to latest version with 4K60 video',
      'Improved idle battery drain and thermal throttling curve',
      'Fixed audio jitter when switching between bluetooth and speaker outputs',
    ],
  },
  {
    id: 'pixelos-sweet-14',
    device: 'sweet',
    deviceName: 'Redmi Note 10 Pro',
    oem: 'Xiaomi',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-15',
    filename: 'PixelOS_sweet-14.0-20240615-1840.zip',
    fileSize: '1.86 GB',
    downloadUrl: 'https://pixelos.net/download/sweet',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/sweet/recovery.img/download',
    sha256: 'f5e4d3c2b1a09876543210fedcba9876543210abcdef0123456789abcdef0123',
    features: ['108MP GCam configuration', '120Hz smooth scrolling', 'Pixel Live Wallpapers', 'Google Dialer Call Recording'],
    maintainer: 'Arya',
    changelog: [
      'June 2024 security patch merged',
      'Resolved camera lag under high ambient temperatures',
      'Smoother notification shade pull down',
    ],
  },
  {
    id: 'pixelos-vayu-14',
    device: 'vayu',
    deviceName: 'POCO X3 Pro',
    oem: 'Xiaomi',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-10',
    filename: 'PixelOS_vayu-14.0-20240610-0930.zip',
    fileSize: '1.88 GB',
    downloadUrl: 'https://pixelos.net/download/vayu',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/vayu/recovery.img/download',
    sha256: '9876543210abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    features: ['Snapdragon 860 gaming thermals', 'Unlimited Google Photos backup', 'Adaptive Refresh Rate (30-120Hz)'],
    maintainer: 'Koko',
    changelog: [
      'June 2024 QPR3 platform update',
      'Fixed occasional fingerprint scanner delay',
      'Refined haptic vibration intensity levels',
    ],
  },
  {
    id: 'pixelos-marble-14',
    device: 'marble',
    deviceName: 'POCO F5 / Redmi Note 12 Turbo',
    oem: 'Xiaomi',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-20',
    filename: 'PixelOS_marble-14.0-20240620-1120.zip',
    fileSize: '2.05 GB',
    downloadUrl: 'https://pixelos.net/download/marble',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/marble/recovery.img/download',
    sha256: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    features: ['Snapdragon 7+ Gen 2 flagship optimization', '67W Turbo charging support', 'OLED 120Hz HDR10+'],
    maintainer: 'Gagan',
    changelog: [
      'Initial official Android 14 release for marble',
      'Full 67W fast charging supported with real-time watt indication',
    ],
  },

  // OnePlus
  {
    id: 'pixelos-kebab-14',
    device: 'kebab',
    deviceName: 'OnePlus 8T',
    oem: 'OnePlus',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-18',
    filename: 'PixelOS_kebab-14.0-20240618-1630.zip',
    fileSize: '1.98 GB',
    downloadUrl: 'https://pixelos.net/download/kebab',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/kebab/recovery.img/download',
    sha256: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    features: ['Warp Charge 65W verified', 'OnePlus Alert Slider integration with Pixel sound modes', 'OOS Camera port included'],
    maintainer: 'AnierinB',
    changelog: [
      'June 2024 security patch',
      'Alert slider perfectly synced with Pixel DND and priority vibration',
      'Smoother 120Hz display switching',
    ],
  },
  {
    id: 'pixelos-lemonade-14',
    device: 'lemonade',
    deviceName: 'OnePlus 9',
    oem: 'OnePlus',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-16',
    filename: 'PixelOS_lemonade-14.0-20240616-2040.zip',
    fileSize: '2.01 GB',
    downloadUrl: 'https://pixelos.net/download/lemonade',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/lemonade/recovery.img/download',
    sha256: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    features: ['Snapdragon 888 performance tuning', 'Hasselblad color science integration', 'Pixel Stand wireless charging perks'],
    maintainer: 'Sam',
    changelog: [
      'June 2024 security baseline',
      'Thermal mitigation on Snapdragon 888 sustained loads',
    ],
  },

  // Google Pixel (PixelOS on Pixel devices provides custom enhancements)
  {
    id: 'pixelos-panther-14',
    device: 'panther',
    deviceName: 'Pixel 7',
    oem: 'Google',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-06-25',
    filename: 'PixelOS_panther-14.0-20240625-1510.zip',
    fileSize: '2.10 GB',
    downloadUrl: 'https://pixelos.net/download/panther',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/panther/recovery.img/download',
    sha256: '3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef',
    features: ['Google Tensor G2 optimizations', 'Enhanced status bar network speed meter', 'Volume button track skip', 'Clean de-bloated stock'],
    maintainer: 'PixelOS Team',
    changelog: [
      'Merged latest Google stock driver binaries',
      'Added custom PixelOS tweaks while maintaining SafetyNet / Play Integrity pass',
    ],
  },
  {
    id: 'pixelos-akita-14',
    device: 'akita',
    deviceName: 'Pixel 8a',
    oem: 'Google',
    romName: 'PixelOS',
    version: 'Android 14 (QPR3)',
    androidVersion: 'Android 14',
    releaseDate: '2024-07-02',
    filename: 'PixelOS_akita-14.0-20240702-1200.zip',
    fileSize: '2.15 GB',
    downloadUrl: 'https://pixelos.net/download/akita',
    recoveryUrl: 'https://sourceforge.net/projects/pixelos-releases/files/fourteen/akita/recovery.img/download',
    sha256: '4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef',
    features: ['Google Tensor G3 architecture', '120Hz Actua display optimization', 'Face Unlock and under-display optical fingerprint'],
    maintainer: 'PixelOS Team',
    changelog: [
      'Initial release for Pixel 8a (akita)',
      'Passes Play Integrity (MEETS_DEVICE_INTEGRITY) out of the box',
    ],
  },
];
