import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCacheStats } from '@/lib/imageCache';

const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheCount, setCacheCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false); // Reset dismissed state when coming back online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get cache stats
    getCacheStats().then(stats => setCacheCount(stats.count));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update cache count when coming back online
  useEffect(() => {
    if (isOnline) {
      getCacheStats().then(stats => setCacheCount(stats.count));
    }
  }, [isOnline]);

  if (isOnline || isDismissed) return null;

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span>{t('ოფლაინ რეჟიმი', 'Offline Mode')}</span>
      {cacheCount > 0 && (
        <>
          <span className="mx-1">•</span>
          <CheckCircle className="w-4 h-4 text-green-300" />
          <span>{cacheCount} {t('სურათი ხელმისაწვდომია', 'images available')}</span>
        </>
      )}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-2 p-1 hover:bg-amber-700 rounded transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default OfflineBanner;
