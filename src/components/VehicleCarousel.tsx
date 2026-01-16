import React from 'react';
import { ChevronLeft, ChevronRight, Car, Truck, Bus } from 'lucide-react';
import { vehicleCategories } from '@/data/questions';

interface VehicleCarouselProps {
  selectedCategory: number;
  onCategoryChange: (index: number) => void;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ selectedCategory, onCategoryChange }) => {
  const category = vehicleCategories[selectedCategory];

  const goToPrevious = () => {
    onCategoryChange(selectedCategory === 0 ? vehicleCategories.length - 1 : selectedCategory - 1);
  };

  const goToNext = () => {
    onCategoryChange(selectedCategory === vehicleCategories.length - 1 ? 0 : selectedCategory + 1);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'car':
        return <Car className="w-24 h-24 text-white" strokeWidth={1.5} />;
      case 'truck':
        return <Truck className="w-24 h-24 text-white" strokeWidth={1.5} />;
      case 'bus':
        return <Bus className="w-24 h-24 text-white" strokeWidth={1.5} />;
      case 'tractor':
        return (
          <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="17" r="3" />
            <circle cx="17" cy="17" r="2" />
            <path d="M14 17H10M5 17V9a2 2 0 012-2h6l3 4h2a2 2 0 012 2v4" />
          </svg>
        );
      default:
        return <Car className="w-24 h-24 text-white" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 py-6">
      <button
        onClick={goToPrevious}
        className="text-white/70 hover:text-white transition-colors p-2"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div className="flex flex-col items-center animate-fade-in">
        {getIcon(category.icon)}
        <span className="text-white text-2xl font-semibold mt-2">{category.name}</span>
      </div>

      <button
        onClick={goToNext}
        className="text-white/70 hover:text-white transition-colors p-2"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default VehicleCarousel;
