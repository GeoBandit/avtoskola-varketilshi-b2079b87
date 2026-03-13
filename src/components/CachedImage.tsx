import React, { useState, useEffect } from 'react';
import { getCachedImageUrl } from '@/lib/imageCache';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Image component that serves cached images directly from Cache API.
 * Works without Service Workers — critical for Median.co / WKWebView on iOS.
 */
const CachedImage: React.FC<CachedImageProps> = ({
  src,
  fallbackSrc,
  alt,
  onError,
  ...props
}) => {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getCachedImageUrl(src).then(url => {
      if (!cancelled) setDisplaySrc(url);
    });

    return () => {
      cancelled = true;
      // Revoke blob URL on cleanup
      if (displaySrc.startsWith('blob:')) {
        URL.revokeObjectURL(displaySrc);
      }
    };
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && displaySrc !== fallbackSrc) {
      setDisplaySrc(fallbackSrc);
      return;
    }
    // If blob URL failed, try original URL as last resort
    if (displaySrc !== src && displaySrc.startsWith('blob:')) {
      setDisplaySrc(src);
      return;
    }
    setIsErrored(true);
    onError?.(e);
  };

  if (isErrored) return null;

  return (
    <img
      {...props}
      src={displaySrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default CachedImage;
