'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Question } from '@/types/survey';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
  currentQuestion: Question;
}

export default function ProgressBar({ currentIndex, total, currentQuestion }: ProgressBarProps) {
  const { language, t, isRTL } = useLanguage();
  const progress = ((currentIndex + 1) / total) * 100;
  const sectionName = language === 'ar' ? currentQuestion.sectionAr : currentQuestion.sectionEn;

  return (
    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
            {sectionName}
          </span>
          <span className="text-xs text-white/50 font-mono">
            {t('question')} {currentIndex + 1} {t('questionOf')} {total}
          </span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #00D4AA, #0EA5E9)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className={`flex items-center justify-end mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-white/30 font-mono">
            {Math.round(progress)}% {t('completed')}
          </span>
        </div>
      </div>
    </div>
  );
}
