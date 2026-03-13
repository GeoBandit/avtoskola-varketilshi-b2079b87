/**
 * Image caching utility for offline support.
 * Works by triggering fetches that the PWA service worker (Workbox) intercepts and caches.
 * The Workbox runtime caching rule for starti.ge images uses CacheFirst with opaque response support.
 */

const CACHE_NAME = 'exam-images-v1';

/**
 * Check if an image is already cached (via service worker or Cache API)
 */
export async function isImageCached(url: string): Promise<boolean> {
  try {
    // Check service worker caches first
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const response = await cache.match(url);
      if (response) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Cache a single image by fetching it (triggering the service worker to cache it)
 */
export async function cacheImage(url: string): Promise<boolean> {
  try {
    // First check if already in any cache
    if (await isImageCached(url)) return true;

    // Try to create an <img> element to load the image.
    // This is more reliable than fetch for cross-origin images
    // and will trigger the service worker to cache the response.
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        // Try no-cors fetch as fallback (triggers SW caching for opaque responses)
        fetch(url, { mode: 'no-cors' })
          .then(() => resolve(true))
          .catch(() => resolve(false));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        // Even if img fails, try a no-cors fetch to trigger SW caching
        fetch(url, { mode: 'no-cors' })
          .then(() => resolve(true))
          .catch(() => resolve(false));
      };
      img.src = url;
    });
  } catch (error) {
    console.warn('Failed to cache image:', url, error);
    return false;
  }
}

/**
 * Get image URL - simply returns the original URL.
 * The service worker handles serving from cache when offline.
 */
export async function getCachedImage(url: string): Promise<string> {
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
  
  // Process in batches to avoid overwhelming the network
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
 * Get cache statistics across all caches
 */
export async function getCacheStats(): Promise<{ count: number; estimatedSize: number }> {
  try {
    let totalCount = 0;
    let estimatedSize = 0;
    
    const cacheNamesList = await caches.keys();
    for (const name of cacheNamesList) {
      // Only count image-related caches
      if (name.includes('image') || name.includes('exam')) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        totalCount += keys.length;
        
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
            // Estimate ~50KB per opaque response (we can't read their size)
            estimatedSize += 50 * 1024;
          }
        }
      }
    }
    
    return { count: totalCount, estimatedSize };
  } catch {
    return { count: 0, estimatedSize: 0 };
  }
}

/**
 * Clear all cached images
 */
export async function clearImageCache(): Promise<void> {
  try {
    const cacheNamesList = await caches.keys();
    for (const name of cacheNamesList) {
      if (name.includes('image') || name.includes('exam')) {
        await caches.delete(name);
      }
    }
  } catch (error) {
    console.warn('Failed to clear image cache:', error);
  }
}
