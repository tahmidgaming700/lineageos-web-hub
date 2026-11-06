# LineageOS Web Hub

> Discover. Download. Verify. Explore.

LineageOS Web Hub is an independent community web application for discovering LineageOS devices and builds, exploring community GSI releases, browsing historical archive records, and using browser-based Android developer utilities.

## Live deployment

The project is configured for GitHub Pages at:

https://tahmidgaming700.github.io/lineageos-web-hub/

The URL becomes active after GitHub Pages is enabled and the deployment workflow succeeds.

## Technology

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Google Material 3-inspired interface
- Puter.js for optional sign-in, cloud preferences and AI assistance
- GitHub Actions + GitHub Pages for free static hosting
- Progressive Web App support

## Deploy with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push a commit to the `main` branch, or manually run **Build and deploy LineageOS Web Hub** from the Actions tab.
4. Wait for both the build and deploy jobs to finish successfully.
5. Open https://tahmidgaming700.github.io/lineageos-web-hub/.

The workflow installs dependencies, runs the Vite production build, uploads the `dist/` directory, and deploys it to GitHub Pages. No custom domain, Cloudflare account, VPS, or paid hosting is required.

### Repository path configuration

The Vite base path and PWA scope are configured for `/lineageos-web-hub/`. If the repository is renamed, update the `base` constant in `vite.config.ts` and the website URL in this document.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

The development command starts the Express/Vite development server. To test the same static output used by GitHub Pages:

```bash
npm run build
npm run preview
```

## Static-hosting architecture and limitations

GitHub Pages serves static files; it does not run the Express server in `server.ts`. The published frontend therefore uses browser-side requests to public upstream sources where browser access is allowed.

- Official device metadata: LineageOS Hudson repository.
- Official builds: LineageOS download API.
- Community GSI and add-on releases: public GitHub Releases API.
- Historical archive: TimSchumi archive API, when browser CORS policy permits access.
- ROM Assistant: optional Puter AI integration. No Gemini API key is embedded in the public website.

Some upstream services may block browser requests through CORS, rate-limit unauthenticated requests, or be temporarily unavailable. The interface handles these failures without claiming that unavailable data is current. Historical archive details may not load when the archive API does not permit cross-origin browser requests.

The Express server and its server-only routes remain in the repository for local/server deployments, but they are not part of the GitHub Pages deployment.

## Security and flashing safety

- Never put private API keys or service credentials in frontend files.
- Verify checksums against the publisher's own release page before flashing.
- Bootloader unlocking and partition flashing can erase data or permanently damage a device. Confirm device-specific instructions before proceeding.
- Browser tools can inspect files and generate commands; they cannot directly flash device partitions or execute ADB/fastboot commands on the user's device.

## Disclaimer

LineageOS Web Hub is an independent community project. It is not an official LineageOS product and is not affiliated with, endorsed by, or sponsored by the LineageOS project or Google LLC. Product names and trademarks belong to their respective owners.
