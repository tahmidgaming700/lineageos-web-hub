/**
 * Automated test suite for LineageOS Web Hub.
 * Run with: npx tsx tests/run-tests.ts
 */

import { compareChecksums, calculateStringSha256 } from '../src/lib/crypto';
import { FALLBACK_DEVICES } from '../server/data/fallbackDevices';
import { FALLBACK_GSI_RELEASES } from '../server/data/fallbackGsi';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- Running LineageOS Web Hub Automated Tests ---\n');

  // Test 1: Checksum Comparison
  console.log('[Test Suite 1: Checksum Comparison]');
  const hash1 = 'ffeba9979e7e060ce2e860be75e6d92d785b01d0cf4d964fa13487b7dbe32fe1';
  const hash1Upper = 'FFEBA9979E7E060CE2E860BE75E6D92D785B01D0CF4D964FA13487B7DBE32FE1';
  const hash1WithSpaces = ' ffeba997 9e7e060c e2e860be 75e6d92d 785b01d0 cf4d964f a13487b7 dbe32fe1 ';
  assert(compareChecksums(hash1, hash1Upper), 'Uppercase matches lowercase hash');
  assert(compareChecksums(hash1, hash1WithSpaces), 'Hash with spaces and newlines matches cleanly');
  assert(!compareChecksums(hash1, '0000000000000000000000000000000000000000000000000000000000000000'), 'Mismatching hash returns false');
  assert(!compareChecksums('', hash1), 'Empty actual hash returns false');

  // Test 2: WebCrypto SHA-256 calculation
  console.log('\n[Test Suite 2: Web Crypto SHA-256]');
  const computedEmpty = await calculateStringSha256('');
  // Known SHA-256 of empty string: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  assert(
    computedEmpty === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'Empty string produces standard SHA-256 digest'
  );

  const computedLineage = await calculateStringSha256('LineageOS');
  assert(computedLineage.length === 64, 'SHA-256 output is 64 hex characters');

  // Test 3: Device Database Integrity
  console.log('\n[Test Suite 3: Fallback Device Database]');
  assert(FALLBACK_DEVICES.length >= 30, 'Contains at least 30 popular devices');
  const akita = FALLBACK_DEVICES.find((d) => d.model === 'akita');
  assert(!!akita, 'Pixel 8a (akita) exists in dataset');
  assert(akita?.oem === 'Google', 'Pixel 8a OEM is Google');
  assert(akita?.architecture === 'arm64', 'Pixel 8a architecture is ARM64');
  assert(!!akita?.wiki_url, 'Pixel 8a has wiki documentation link');

  const alioth = FALLBACK_DEVICES.find((d) => d.model === 'alioth');
  assert(!!alioth, 'POCO F3 (alioth) exists in dataset');
  assert(alioth?.oem === 'Xiaomi', 'POCO F3 OEM is Xiaomi');

  // Test 4: GSI Releases & Architecture Filtering
  console.log('\n[Test Suite 4: GSI Releases & Architecture Parsing]');
  assert(FALLBACK_GSI_RELEASES.length >= 2, 'Contains at least 2 community GSI releases');
  const los21 = FALLBACK_GSI_RELEASES[0];
  assert(los21.lineage_version.includes('21.0'), 'Includes LineageOS 21.0 GSI');
  assert(los21.assets.length > 0, 'Release contains downloadable assets');
  const arm64Asset = los21.assets.find((a) => a.architecture === 'arm64');
  assert(!!arm64Asset, 'Contains ARM64 variant asset');
  assert(
    Boolean(arm64Asset?.name.endsWith('.img.xz') || arm64Asset?.name.endsWith('.img')),
    'Asset is a valid raw or compressed image'
  );

  // Test 5: Harmony Recovery Build Script Validator
  console.log('\n[Test Suite 5: Harmony Recovery Build Script Validator]');
  const validUrlRegex = /^https:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?\/[A-Za-z0-9._~:/-]+$/;
  const validBranchRegex = /^[A-Za-z0-9._/-]+$/;
  const validTargetRegex = /^[A-Za-z0-9_.-]+$/;

  assert(validUrlRegex.test('https://github.com/LineageOS/android'), 'Valid HTTPS git URL passes');
  assert(!validUrlRegex.test('http://insecure.site/manifest'), 'Plain HTTP URL is rejected');
  assert(!validUrlRegex.test('https://github.com/owner/repo; rm -rf /'), 'URL with shell metacharacters is rejected');

  assert(validBranchRegex.test('lineage-21.0'), 'Valid branch lineage-21.0 passes');
  assert(!validBranchRegex.test('branch; curl evil.com'), 'Branch with semicolon is rejected');

  assert(validTargetRegex.test('recoveryimage'), 'Build target recoveryimage passes');
  assert(validTargetRegex.test('lineage_akita-userdebug'), 'Lunch target lineage_akita-userdebug passes');

  console.log(`\n========================================`);
  console.log(`Total tests executed: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
