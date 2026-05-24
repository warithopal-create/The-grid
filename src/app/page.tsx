'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelect from '@/components/survey/LanguageSelect';
import IntroScreen from '@/components/survey/IntroScreen';
import SurveyFlow from '@/components/survey/SurveyFlow';
import { Language } from '@/types/survey';
import { Lock } from 'lucide-react';

type Screen = 'language' | 'intro' | 'survey';

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const [screen, setScreen] = useState<Screen>('language');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem('survey-completed');
    if (completed === 'true') {
      setScreen('survey');
      return;
    }
    const savedLang = localStorage.getItem('survey-language');
    const savedIndex = localStorage.getItem('survey-current-index');
    if (savedLang && savedIndex && parseInt(savedIndex) > 0) {
      setScreen('survey');
    } else if (savedLang) {
      setScreen('intro');
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setScreen('intro');
  };

  const handleStartSurvey = () => {
    setScreen('survey');
  };

  const pageContent = (() => {
    if (screen === 'language' || !language) {
      return <LanguageSelect onSelect={handleLanguageSelect} />;
    }

    if (screen === 'intro') {
      return <IntroScreen onStart={handleStartSurvey} />;
    }

    return <SurveyFlow />;
  })();

  return (
    <>
      {/* Hidden Admin Login Button */}
      <Link
        href="/admin/login"
        className="fixed top-4 right-4 p-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 text-white/20 hover:text-emerald-400 hover:bg-emerald-400/5 group z-50"
        title="Admin"
      >
        <Lock className="w-4 h-4" />
      </Link>
      {pageContent}
    </>
  );
}
