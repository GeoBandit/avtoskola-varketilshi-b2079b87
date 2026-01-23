/**
 * Image caching utility for offline support in both PWA and Capacitor native apps.
 * Uses Cache API directly which works across both web and Capacitor WebView.
 */

const CACHE_NAME = 'exam-images-v1';

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
 * Cache a single image
 */
export async function cacheImage(url: string): Promise<boolean> {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Check if already cached
    const existing = await cache.match(url);
    if (existing) return true;
    
    // Fetch and cache
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
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
 * Get image from cache, falling back to network
 */
export async function getCachedImage(url: string): Promise<string> {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      return URL.createObjectURL(blob);
    }
    
    // Not in cache, try network and cache it
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
      await cache.put(url, response.clone());
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.warn('Failed to get cached image:', url, error);
  }
  
  // Return original URL as fallback
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
  const batchSize = 5;
  
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
      if (response) {
        const blob = await response.clone().blob();
        estimatedSize += blob.size;
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
