import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

import VehicleCarousel from '@/components/VehicleCarousel';
import forestRoadBg from '@/assets/forest-road-bg.jpg';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import { vehicleCategories } from '@/data/questions';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleNavigate = (mode: 'subject' | 'all' | 'exam') => {
    const categoryId = vehicleCategories[selectedCategory].id;
    navigate(`/${mode}/${categoryId}`);
  };

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
        </div>

      </div>
    </div>
  );
};

export default Home;
