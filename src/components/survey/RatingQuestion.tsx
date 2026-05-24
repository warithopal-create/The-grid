'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Question } from '@/types/survey';

interface Props {
  question: Question;
  answer: string | undefined;
  onAnswer: (value: string) => void;
}

export default function RatingQuestion({ question, answer, onAnswer }: Props) {
  const { language, isRTL } = useLanguage();
  const min = question.ratingMin || 1;
  const max = question.ratingMax || 5;
  const minLabel = language === 'ar' ? question.ratingMinLabelAr : question.ratingMinLabelEn;
  const maxLabel = language === 'ar' ? question.ratingMaxLabelAr : question.ratingMaxLabelEn;

  const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div>
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs text-white/40">{minLabel}</span>
        <span className="text-xs text-white/40">{maxLabel}</span>
      </div>
      <div className={`flex gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {ratings.map((rating, index) => {
          const isSelected = answer === String(rating);
          const gradientColors = [
            'from-red-500/20 to-red-400/10 border-red-400/30 shadow-red-400/10',
            'from-orange-500/20 to-orange-400/10 border-orange-400/30 shadow-orange-400/10',
            'from-yellow-500/20 to-yellow-400/10 border-yellow-400/30 shadow-yellow-400/10',
            'from-lime-500/20 to-lime-400/10 border-lime-400/30 shadow-lime-400/10',
            'from-emerald-500/20 to-emerald-400/10 border-emerald-400/30 shadow-emerald-400/10',
          ];
          const activeColors = [
            'from-red-500 to-red-600 border-red-400 shadow-red-400/30',
            'from-orange-500 to-orange-600 border-orange-400 shadow-orange-400/30',
            'from-yellow-500 to-yellow-600 border-yellow-400 shadow-yellow-400/30',
            'from-lime-500 to-lime-600 border-lime-400 shadow-lime-400/30',
            'from-emerald-500 to-emerald-600 border-emerald-400 shadow-emerald-400/30',
          ];

          return (
            <motion.button
              key={rating}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onAnswer(String(rating))}
              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl border font-bold text-lg transition-all duration-300 bg-gradient-to-br shadow-lg ${
                isSelected
                  ? `${activeColors[index]} text-white scale-110`
                  : `${gradientColors[index]} text-white/60 hover:scale-105`
              }`}
            >
              {rating}
              {isSelected && (
                <motion.div
                  layoutId="rating-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
