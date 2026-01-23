import React, { useState, useEffect } from 'react';
import { getCachedImage } from '@/lib/imageCache';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Image component that uses Cache API for offline support.
 * Works in both PWA and Capacitor native apps.
 */
const CachedImage: React.FC<CachedImageProps> = ({ 
  src, 
  fallbackSrc,
  alt,
  onError,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        const cachedSrc = await getCachedImage(src);
        if (isMounted) {
          // Track if we created an object URL so we can revoke it
          if (cachedSrc.startsWith('blob:')) {
            objectUrl = cachedSrc;
          }
          setImageSrc(cachedSrc);
          setIsErrored(false);
        }
      } catch {
        if (isMounted) {
          setImageSrc(src);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      // Clean up object URL to prevent memory leaks
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If a fallback is provided, try it once before marking as errored.
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setIsErrored(false);
      onError?.(e);
      return;
    }

    setIsErrored(true);
    onError?.(e);
  };

  if (!imageSrc || isErrored) {
    return null;
  }

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default CachedImage;
