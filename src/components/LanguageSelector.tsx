import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import georgiaFlag from '@/assets/flags/ge.svg';
import ukFlag from '@/assets/flags/gb.svg';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ka' ? 'en' : 'ka');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 bg-white rounded-lg px-3 py-2 shadow-md transition-all hover:shadow-lg"
    >
      <img 
        src={language === 'ka' ? georgiaFlag : ukFlag} 
        alt={language === 'ka' ? 'Georgian' : 'English'}
        className="w-7 h-5 object-cover rounded-sm"
      />
      <ChevronDown className="w-4 h-4 text-gray-600" />
    </button>
  );
};

export default LanguageSelector;
