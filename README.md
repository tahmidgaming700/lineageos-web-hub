# LineageOS Web Hub

> **Discover. Download. Verify. Explore.**

LineageOS Web Hub is a complete, production-ready Android community web application powered by **Puter.js** and styled with **Google Material 3**. It bridges device discovery, upstream LineageOS downloads, community Treble Generic System Images (GSI), historical ROM archives, and client-side developer utilities in a single cohesive experience.

---

## Key Capabilities & Features

### 1. Official LineageOS Device & Build Discovery
- **640+ Official Devices**: Queries the official LineageOS Hudson repository (`LineageOS/hudson/updater/devices.json`) with an automatic in-memory cache and curated fallback database.
- **Upstream Build API**: Connects directly to `https://download.lineageos.org/api/v2/devices/{codename}/builds` to display official nightly builds, recovery images, `boot.img`, `vendor_boot.img`, security patch levels, and exact file sizes.
- **Direct Mirrors**: Preserves official mirror links (`mirrorbits.lineageos.org`).

### 2. Historical Archive Explorer
- Integrated with the **TimSchumi LineageOS Archive API** (`lineage-archive.timschumi.net/api/builds`).
- Allows searching by device codename for discontinued or older builds (LineageOS 14.1 through 20.0).
- Explicit security warnings regarding unpatched vulnerabilities in outdated software.
- Full cryptographic digests displayed: SHA-256, SHA-512, and MD5.

### 3. Community Treble GSI Discovery & Compatibility Lab
- **GSI Discovery**: Live GitHub release assets from **AndyYan** (`lineage_build_unified`) and **ponces** (`treble_build_los`).
- **Nomenclature Breakdown**: Deciphers GSI codes:
  - Architecture: `arm64`, `arm`, `x86_64`
  - Partition type: `a` (A-only) vs `b` (A/B system-as-root)
  - Suite: `g` (GApps included) vs `v` (Vanilla pure AOSP)
  - Security/Root: `N` (Non-SU unrooted) vs `S` (Superuser)
  - `vndklite` (Read-Write vendor compatibility)
- **Interactive Compatibility Lab**: Questionnaire evaluating device architecture, base Android version, Treble flag, and partition scheme to recommend the exact GSI variant and flashing commands (`fastbootd` vs recovery).

### 4. Harmony Recovery Centre & Build Lab
- Tracks releases and documentation from the native Android companion app (`tahmidgaming700/lineageos-archive-downloader`).
- **Interactive Linux Build Script Planner**: Validates repository HTTPS URLs, manifest branches, device codenames, and lunch targets to generate a reproducible Linux bash script (`repo init`, `repo sync`, `source build/envsetup.sh`, `lunch`, `mka recoveryimage`).
- Documents resource requirements (100+ GB storage, JDK 17, multi-threaded CPU).

### 5. Android Developer Toolbox (10 Browser-Based Tools)
All calculations run locally in the browser using the **Web Crypto API**:
1. **SHA-256 Calculator**: Drag & drop large firmware ZIPs or paste strings with live progress tracking.
2. **File Checksum Verifier**: Compares file digest against expected SHA-256 with instant pass/fail validation.
3. **Build.prop Viewer & Parser**: Parses uploaded or pasted `build.prop` files into a searchable table.
4. **Android API Level Reference**: Chronological table from Android 1.0 to Android 15/16.
5. **OTA Payload Properties Viewer**: Parses `payload_properties.txt` offsets and hashes.
6. **Firmware Build ID Parser**: Breaks down Google Pixel, Samsung, and Xiaomi build strings.
7. **Partition Layout Reference**: Visual guide for standard A/B and Dynamic Partition (`super`) layouts.
8. **Fastboot & ADB Helper**: Generates safe flash, sideload, and fastbootd commands.
9. **JSON Formatter & Validator**: Formats, minifies, and lints device configs.
10. **File Info & Magic Inspector**: Evaluates MIME headers and bytes locally.

### 6. Puter.js Cloud Integration
- **Authentication**: Sign in with Puter (`puter.auth.signIn()`) with zero backend database setup required.
- **Key-Value Cloud Storage**: Bookmarked devices, saved ROM releases, and personal device notes synced to `puter.kv` with offline `localStorage` fallback.
- **ROM Assistant AI**: Technical firmware assistant powered by Puter AI (`puter.ai.chat`) with fallback to server-side Gemini API (`@google/genai`). Never invents fake builds or promises unsupported flashing.

### 7. Google Material 3 Design System
- Dynamic Material You palette (Primary Teal `#006874`, Surface `#F8FAFB` / `#0F1415`).
- Light mode, Dark mode, and System preference with `@custom-variant dark` support.
- Responsive Navigation Rail (desktop), Bottom Navigation Bar (mobile), Top Bar Contract, and Command Palette (`Cmd+K`).
- Full PWA compliance with manifest, service worker, and in-app install prompt.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

### Running Automated Tests
```bash
npm test
```

---

## Architecture

```
├── server.ts                    # Express backend serving API routes & Vite middleware
├── server/
│   ├── routes/                  # Modular endpoints (/api/devices, /api/lineage, etc.)
│   └── data/                    # Fallback datasets (Lineage devices, GSIs, addons)
├── src/
│   ├── components/
│   │   ├── layout/              # Header, NavigationRail, BottomNav, Footer, CommandPalette
│   │   ├── dashboard/           # HomeDashboard
│   │   ├── devices/             # DeviceExplorer
│   │   ├── downloads/           # RomDownloadCenter
│   │   ├── archive/             # HistoricalArchiveExplorer
│   │   ├── gsi/                 # GsiDiscoveryCenter, GsiCompatibilityLab
│   │   ├── recovery/            # HarmonyRecoveryCenter
│   │   ├── toolbox/             # DeveloperToolbox
│   │   ├── guides/              # InstallationGuides
│   │   ├── releases/            # ReleaseTracker
│   │   ├── bookmarks/           # BookmarksView
│   │   ├── assistant/           # RomAssistantModal
│   │   └── pwa/                 # PWAInstallButton, OfflineIndicator
│   ├── lib/
│   │   ├── puter.ts             # Puter.js Auth, KV & AI wrapper
│   │   ├── crypto.ts            # Web Crypto SHA-256 calculation & comparison
│   │   ├── theme.ts             # Material 3 theme switcher
│   │   └── api.ts               # Type-safe API client
│   └── types/                   # TypeScript definitions
└── tests/
    └── run-tests.ts             # 25 automated unit & integration tests
```

---

## Disclaimer
LineageOS Web Hub is an independent community project and is **not an official LineageOS product**. It is not affiliated with or endorsed by the LineageOS project or Google LLC. Android is a trademark of Google LLC.
