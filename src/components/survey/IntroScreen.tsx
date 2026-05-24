'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { defaultSettings } from '@/data/survey-questions';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onStart: () => void;
  introText?: { en: string; ar: string };
}

export default function IntroScreen({ onStart, introText }: Props) {
  const { language, t, isRTL } = useLanguage();

  const text = language === 'ar'
    ? (introText?.ar || defaultSettings.intro_ar)
    : (introText?.en || defaultSettings.intro_en);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-lg w-full text-center"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-2"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {language === 'ar' ? 'ذا قريد' : 'THE GRID'}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/50 text-sm tracking-wider uppercase mb-10"
        >
          {t('surveySubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-10"
        >
          {text.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className={`text-base text-white/60 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <span>{t('startSurvey')}</span>
          <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </motion.button>
      </motion.div>
    </div>
  );
}
