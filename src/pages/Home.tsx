import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { History, Download, CheckCircle, Loader2 } from 'lucide-react';

import VehicleCarousel from '@/components/VehicleCarousel';
import { Progress } from '@/components/ui/progress';
import forestRoadBg from '@/assets/forest-road-bg.jpg';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import { vehicleCategories, getQuestionsForVehicle } from '@/data/questions';
import { cacheImages, getImageUrlsFromQuestions, getCacheStats } from '@/lib/imageCache';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0, category: '' });
  const [cacheStatus, setCacheStatus] = useState({ count: 0, estimatedSize: 0 });
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Check cache status on mount
  useEffect(() => {
    getCacheStats().then(setCacheStatus);
  }, []);

  const handleNavigate = (mode: 'subject' | 'all' | 'exam') => {
    const categoryId = vehicleCategories[selectedCategory].id;
    navigate(`/${mode}/${categoryId}`);
  };

  const handleDownloadForOffline = async () => {
    setIsDownloading(true);
    setDownloadComplete(false);
    
    try {
      // Collect all unique image URLs from ALL vehicle categories
      const allImageUrls = new Set<string>();
      
      for (const category of vehicleCategories) {
        const questions = getQuestionsForVehicle(category.id);
        const urls = getImageUrlsFromQuestions(questions);
        urls.forEach(url => allImageUrls.add(url));
      }
      
      const uniqueUrls = Array.from(allImageUrls);
      setDownloadProgress({ current: 0, total: uniqueUrls.length, category: t('ყველა კატეგორია', 'All categories') });
      
      await cacheImages(uniqueUrls, (current, total) => {
        setDownloadProgress({ current, total, category: t('ყველა კატეგორია', 'All categories') });
      });
      
      // Update cache status
      const newStatus = await getCacheStats();
      setCacheStatus(newStatus);
      setDownloadComplete(true);
      
      // Reset complete status after 3 seconds
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const progressPercent = downloadProgress.total > 0 
    ? Math.round((downloadProgress.current / downloadProgress.total) * 100) 
    : 0;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${forestRoadBg})` }}
    >
      {/* Overlay */}
      <div className="min-h-screen bg-black/60 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 pt-6">
          <a href="tel:574747581" className="text-white/80 text-sm font-medium hover:text-white transition-colors">
            574-747-581
          </a>
          <img src={avtoskolaLogo} alt="ავტოსკოლა ვარკეთილში" className="h-12 w-auto" />
        </header>

        {/* Title */}
        <div className="text-center mt-4">
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
            {t('ავტოსკოლა ვარკეთილში', 'Driving School in Varketili')}
          </h1>
        </div>

        {/* Vehicle Carousel */}
        <VehicleCarousel 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Menu Buttons */}
        <div className="flex-1 flex flex-col justify-center px-6 gap-4 max-w-md mx-auto w-full pb-20">
          <button
            onClick={() => handleNavigate('subject')}
            className="btn-menu"
          >
            {t('თემატიკის მიხედვით', 'By Subject')}
          </button>
          
          <button
            onClick={() => handleNavigate('all')}
            className="btn-menu"
          >
            {t('ყველა ბილეთი', 'All Questions')}
          </button>
          
          <button
            onClick={() => handleNavigate('exam')}
            className="btn-menu"
          >
            {t('გამოცდა', 'Exam')}
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="btn-menu flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            {t('ისტორია', 'History')}
          </button>

          {/* Download for Offline Section */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadForOffline}
              disabled={isDownloading}
              className="btn-menu w-full flex items-center justify-center gap-2 bg-primary/80 hover:bg-primary disabled:opacity-70"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('ჩამოტვირთვა', 'Downloading')}...
                </>
              ) : downloadComplete ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {t('ჩამოტვირთულია!', 'Downloaded!')}
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {t('ყველას ჩამოტვირთვა ოფლაინისთვის', 'Download All for Offline')}
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isDownloading && (
              <div className="space-y-2">
                <Progress value={progressPercent} className="h-3 bg-white/20" />
                <p className="text-center text-white/80 text-sm">
                  {downloadProgress.current} / {downloadProgress.total} ({progressPercent}%)
                </p>
              </div>
            )}

            {/* Cache Status */}
            {cacheStatus.count > 0 && !isDownloading && (
              <p className="text-center text-white/60 text-sm">
                {t('ქეშირებული სურათები', 'Cached images')}: {cacheStatus.count} ({formatSize(cacheStatus.estimatedSize)})
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
