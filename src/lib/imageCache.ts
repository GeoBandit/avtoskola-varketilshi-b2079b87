/**
 * Image caching utility for offline support.
 * Uses IndexedDB to store image blobs — works reliably in WKWebView / Median.co
 * where Service Workers and Cache API opaque responses are unreliable.
 */

const DB_NAME = 'exam-image-cache';
const DB_VERSION = 1;
const STORE_NAME = 'images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dbGet(db: IDBDatabase, key: string): Promise<Blob | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

function dbPut(db: IDBDatabase, key: string, value: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function dbCount(db: IDBDatabase): Promise<number> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbGetAllKeys(db: IDBDatabase): Promise<IDBValidKey[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAllKeys();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Check if an image is already cached
 */
export async function isImageCached(url: string): Promise<boolean> {
  try {
    const db = await openDB();
    const blob = await dbGet(db, url);
    db.close();
    return !!blob;
  } catch {
    return false;
  }
}

/**
 * Cache a single image by fetching and storing as Blob in IndexedDB
 */
export async function cacheImage(url: string): Promise<boolean> {
  try {
    const db = await openDB();
    const existing = await dbGet(db, url);
    if (existing) { db.close(); return true; }

    let blob: Blob | null = null;

    // Try fetching with cors first for a readable response
    try {
      const resp = await fetch(url, { mode: 'cors' });
      if (resp.ok) blob = await resp.blob();
    } catch {
      // cors failed
    }

    // Fallback: use an img element + canvas to grab pixel data
    if (!blob) {
      blob = await fetchViaCanvas(url);
    }

    if (blob && blob.size > 0) {
      await dbPut(db, url, blob);
      db.close();
      return true;
    }

    db.close();
    return false;
  } catch (error) {
    console.warn('Failed to cache image:', url, error);
    return false;
  }
}

/**
 * Fetch an image via canvas to bypass CORS for caching.
 * Creates a temporary Image, draws to canvas, and exports as blob.
 */
function fetchViaCanvas(url: string): Promise<Blob | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    // Add timestamp to bypass browser cache that may lack CORS headers
    img.src = url + (url.includes('?') ? '&' : '?') + '_c=1';
  });
}

/**
 * Get a cached image as a blob URL for direct use in <img> tags.
 * Returns the blob URL if cached, otherwise the original URL.
 */
export async function getCachedImageUrl(url: string): Promise<string> {
  try {
    const db = await openDB();
    const blob = await dbGet(db, url);
    db.close();
    if (blob) {
      return URL.createObjectURL(blob);
    }
  } catch {
    // Fall through
  }
  return url;
}

/**
 * Cache multiple images with progress callback
 */
export async function cacheImages(
  urls: string[],
  onProgress?: (cached: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  let cached = 0;
  let failed = 0;
  const total = urls.length;
  const batchSize = 6; // Smaller batches to avoid overwhelming the browser

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(url => cacheImage(url))
    );

    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        cached++;
      } else {
        failed++;
      }
    });

    onProgress?.(cached + failed, total);
  }

  return { success: cached, failed };
}

/**
 * Get all unique image URLs from questions
 */
export function getImageUrlsFromQuestions(questions: { image?: string }[]): string[] {
  const urls = new Set<string>();
  questions.forEach(q => {
    if (q.image && q.image.startsWith('http')) {
      urls.add(q.image);
    }
  });
  return Array.from(urls);
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{ count: number; estimatedSize: number }> {
  try {
    const db = await openDB();
    const count = await dbCount(db);

    let estimatedSize = 0;
    const keys = await dbGetAllKeys(db);
    // Sample up to 20 entries to estimate average size
    const sampleSize = Math.min(keys.length, 20);
    let sampledTotal = 0;

    for (let i = 0; i < sampleSize; i++) {
      const blob = await dbGet(db, keys[i] as string);
      if (blob) sampledTotal += blob.size;
    }

    if (sampleSize > 0) {
      const avgSize = sampledTotal / sampleSize;
      estimatedSize = Math.round(avgSize * count);
    }

    db.close();
    return { count, estimatedSize };
  } catch {
    return { count: 0, estimatedSize: 0 };
  }
}

/**
 * Clear all cached images
 */
export async function clearImageCache(): Promise<void> {
  try {
    // Delete IndexedDB database
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    // Also clean up old Cache API store
    try { await caches.delete('exam-images-v2'); } catch { /* ignore */ }
  } catch (error) {
    console.warn('Failed to clear image cache:', error);
  }
}
