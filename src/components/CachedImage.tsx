import React, { useState } from 'react';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Image component that relies on the service worker for offline caching.
 * Simply renders an <img> tag - the Workbox service worker handles
 * serving cached responses when offline.
 */
const CachedImage: React.FC<CachedImageProps> = ({ 
  src, 
  fallbackSrc,
  alt,
  onError,
  ...props 
}) => {
  const [isErrored, setIsErrored] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setIsErrored(true);
    onError?.(e);
  };

  if (isErrored) return null;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default CachedImage;
