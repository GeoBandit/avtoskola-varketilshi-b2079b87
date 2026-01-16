import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';

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
      {language === 'ka' ? (
        <span className="text-2xl">🇬🇪</span>
      ) : (
        <span className="text-2xl">🇬🇧</span>
      )}
      <ChevronDown className="w-4 h-4 text-gray-600" />
    </button>
  );
};

export default LanguageSelector;
