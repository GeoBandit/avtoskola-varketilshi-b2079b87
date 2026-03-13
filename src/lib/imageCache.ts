/**
 * Image caching utility for offline support.
 * Stores images directly in the Cache API — does NOT rely on Service Workers.
 * This is critical for Median.co / WKWebView on iOS where SW is unavailable.
 */

const CACHE_NAME = 'exam-images-v2';

/**
 * Check if an image is already cached
 */
export async function isImageCached(url: string): Promise<boolean> {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return !!response;
  } catch {
    return false;
  }
}

/**
 * Cache a single image by fetching it and storing directly in Cache API
 */
export async function cacheImage(url: string): Promise<boolean> {
  try {
    if (await isImageCached(url)) return true;

    // Try cors fetch first, then no-cors as fallback
    let response: Response | null = null;

    try {
      response = await fetch(url, { mode: 'cors' });
    } catch {
      // cors failed, try no-cors
    }

    if (!response || !response.ok) {
      try {
        response = await fetch(url, { mode: 'no-cors' });
      } catch {
        return false;
      }
    }

    // Store in cache — opaque responses (status 0) are allowed
    if (response && (response.ok || response.type === 'opaque')) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(url, response.clone());
      return true;
    }

    return false;
  } catch (error) {
    console.warn('Failed to cache image:', url, error);
    return false;
  }
}

/**
 * Get a cached image as a blob URL for direct use in <img> tags.
 * Returns the blob URL if cached, otherwise the original URL.
 */
export async function getCachedImageUrl(url: string): Promise<string> {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);

    if (response) {
      // For opaque responses, we can't read the body — use original URL
      // and hope the cache intercepts it. For normal responses, create blob URL.
      if (response.type === 'opaque') {
        return url; // Will be served from cache by browser
      }
      const blob = await response.blob();
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

  // Process in batches
  const batchSize = 10;

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
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    let estimatedSize = 0;

    for (const request of keys) {
      const response = await cache.match(request);
      if (response && response.type !== 'opaque') {
        try {
          const blob = await response.clone().blob();
          estimatedSize += blob.size;
        } catch {
          // Ignore
        }
      } else if (response?.type === 'opaque') {
        estimatedSize += 50 * 1024; // ~50KB estimate
      }
    }

    return { count: keys.length, estimatedSize };
  } catch {
    return { count: 0, estimatedSize: 0 };
  }
}

/**
 * Clear all cached images
 */
export async function clearImageCache(): Promise<void> {
  try {
    await caches.delete(CACHE_NAME);
  } catch (error) {
    console.warn('Failed to clear image cache:', error);
  }
}
