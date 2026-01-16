import React from 'react';

interface StartLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const StartLogo: React.FC<StartLogoProps> = ({ size = 'medium' }) => {
  const dimensions = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  return (
    <div className={`${dimensions[size]} rounded-full bg-app-navy border-2 border-app-blue flex items-center justify-center`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-app-blue flex items-center justify-center">
          <div className="w-4 h-2 bg-white rounded-sm" />
        </div>
        <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-app-blue text-xs font-bold">
          START
        </span>
      </div>
    </div>
  );
};

export default StartLogo;
