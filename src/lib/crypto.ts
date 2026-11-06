/**
 * Browser-side Web Crypto utilities for SHA-256 and checksum verification.
 * Runs locally without uploading user files to any server.
 */

export interface HashProgress {
  bytesProcessed: number;
  totalBytes: number;
  percentage: number;
}

/**
 * Calculates SHA-256 of an ArrayBuffer or File using browser Web Crypto API.
 */
export async function calculateSha256(
  file: File | Blob,
  onProgress?: (progress: HashProgress) => void
): Promise<string> {
  const chunkSize = 8 * 1024 * 1024; // 8MB chunks
  const totalBytes = file.size;
  
  // If file is smaller than 32MB, hash in one shot
  if (totalBytes <= 32 * 1024 * 1024) {
    const buffer = await file.arrayBuffer();
    if (onProgress) {
      onProgress({ bytesProcessed: totalBytes, totalBytes, percentage: 100 });
    }
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return bufferToHex(digest);
  }

  // For larger files, read chunks into an incremental stream if available,
  // or read into array buffer with progress notification.
  let offset = 0;
  // Progress estimation during arrayBuffer reading
  if (onProgress) {
    onProgress({ bytesProcessed: 0, totalBytes, percentage: 0 });
  }

  // Since SubtlyDigest doesn't have an incremental update API in standard browser crypto,
  // we can use FileReader or streaming to notify progress while reading.
  const reader = file.stream().getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedBytes += value.length;
    if (onProgress) {
      onProgress({
        bytesProcessed: receivedBytes,
        totalBytes,
        percentage: Math.min(99, Math.round((receivedBytes / totalBytes) * 100)),
      });
    }
  }

  // Concatenate chunks
  const fullBuffer = new Uint8Array(receivedBytes);
  let pos = 0;
  for (const chunk of chunks) {
    fullBuffer.set(chunk, pos);
    pos += chunk.length;
  }

  const digest = await crypto.subtle.digest('SHA-256', fullBuffer.buffer);
  if (onProgress) {
    onProgress({ bytesProcessed: totalBytes, totalBytes, percentage: 100 });
  }
  return bufferToHex(digest);
}

/**
 * Calculates SHA-256 of plain text string.
 */
export async function calculateStringSha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

/**
 * Converts ArrayBuffer to lowercase hexadecimal string.
 */
export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compares two checksum strings, ignoring whitespace, punctuation, and casing.
 */
export function compareChecksums(actual: string, expected: string): boolean {
  const cleanActual = actual.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
  const cleanExpected = expected.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
  return cleanActual.length > 0 && cleanActual === cleanExpected;
}
