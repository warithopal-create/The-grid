'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Question } from '@/types/survey';

interface Props {
  question: Question;
  answer: string | undefined;
  onAnswer: (value: string) => void;
}

export default function TextQuestion({ question, answer, onAnswer }: Props) {
  const { isRTL, t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <textarea
        value={answer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder={t('textPlaceholder')}
        rows={5}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-base text-white placeholder-white/25 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition-all resize-none leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
      />
      {!question.required && (
        <p className={`mt-2 text-xs text-white/30 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'اختياري' : 'Optional'}
        </p>
      )}
    </motion.div>
  );
}
