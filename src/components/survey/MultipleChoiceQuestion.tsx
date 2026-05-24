'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Question } from '@/types/survey';
import { Check } from 'lucide-react';

interface Props {
  question: Question;
  answer: string[] | undefined;
  otherText: string;
  onAnswer: (value: string[]) => void;
  onOtherText: (text: string) => void;
}

export default function MultipleChoiceQuestion({ question, answer, otherText, onAnswer, onOtherText }: Props) {
  const { language, isRTL, t } = useLanguage();
  const selected = answer || [];

  const toggleOption = (optionId: string) => {
    if (selected.includes(optionId)) {
      onAnswer(selected.filter(id => id !== optionId));
    } else {
      onAnswer([...selected, optionId]);
    }
  };

  return (
    <div className="space-y-2.5">
      {question.options?.map((option, index) => {
        const isSelected = selected.includes(option.id);
        const label = language === 'ar' ? option.ar : option.en;

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => toggleOption(option.id)}
            className={`w-full group relative overflow-hidden rounded-xl border transition-all duration-300 ${
              isSelected
                ? 'border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-400/5'
                : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            <div className={`flex items-center gap-4 p-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400'
                    : 'border-white/30 group-hover:border-white/50'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-3 h-3 text-black" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              <span className={`text-sm md:text-base font-medium ${isSelected ? 'text-white' : 'text-white/70'} ${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                {label}
              </span>
            </div>

            {option.hasOtherInput && isSelected && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 pb-4"
              >
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => onOtherText(e.target.value)}
                  placeholder={t('otherPlaceholder')}
                  className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  autoFocus
                />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
