import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useLanguage } from '@/context/LanguageContext';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import forestRoadBg from '@/assets/forest-road-bg.jpg';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth('apple', {
        redirect_uri: window.location.origin + '/auth',
      });
      if (result.error) {
        setError(t('Apple-ით შესვლა ვერ მოხერხდა', 'Apple sign in failed'));
      }
    } catch (err) {
      setError(t('დაფიქსირდა შეცდომა', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${forestRoadBg})` }}
    >
      <div className="min-h-screen bg-black/70 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <img src={avtoskolaLogo} alt="ავტოსკოლა ვარკეთილში" className="h-16 w-auto mb-8" />

        {/* Title */}
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          {t('ავტოსკოლა ვარკეთილში', 'Driving School Varketili')}
        </h1>
        <p className="text-white/60 text-sm text-center mb-10">
          {t('შედით პროგრესის შესანახად', 'Sign in to save your progress')}
        </p>

        {/* Apple Sign In Button */}
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={handleAppleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 px-6 rounded-xl text-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {/* Apple icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {loading
              ? t('შესვლა...', 'Signing in...')
              : t('Apple-ით შესვლა', 'Sign in with Apple')}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Skip option */}
          <button
            onClick={handleSkip}
            className="w-full text-white/50 text-sm text-center py-2 hover:text-white/80 transition-colors"
          >
            {t('გარეშე გაგრძელება', 'Continue without signing in')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
