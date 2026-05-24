'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Question } from '@/types/survey';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import RatingQuestion from './RatingQuestion';
import TextQuestion from './TextQuestion';

interface QuestionCardProps {
  question: Question;
  answer: string | string[] | undefined;
  otherText: string;
  onAnswer: (value: string | string[]) => void;
  onOtherText: (text: string) => void;
  direction: number;
  validationError: string | null;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function QuestionCard({
  question,
  answer,
  otherText,
  onAnswer,
  onOtherText,
  direction,
  validationError,
}: QuestionCardProps) {
  const { language, isRTL } = useLanguage();
  const questionText = language === 'ar' ? question.ar : question.en;
  const multiNote = question.multiSelectNote
    ? (language === 'ar' ? question.multiSelectNote.ar : question.multiSelectNote.en)
    : null;

  const effectiveDirection = isRTL ? -direction : direction;

  return (
    <AnimatePresence mode="wait" custom={effectiveDirection}>
      <motion.div
        key={question.id}
        custom={effectiveDirection}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-emerald-400 text-sm font-bold border border-emerald-400/20">
              {question.number}
            </span>
            {question.required && (
              <span className="text-[10px] uppercase tracking-wider text-emerald-400/60 font-medium">
                {language === 'ar' ? 'مطلوب' : 'Required'}
              </span>
            )}
          </div>
          <h2 className={`text-xl md:text-2xl font-semibold text-white leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
            {questionText}
          </h2>
          {multiNote && (
            <p className={`mt-2 text-sm text-white/40 ${isRTL ? 'text-right' : 'text-left'}`}>
              {multiNote}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {question.type === 'single' && (
            <SingleChoiceQuestion
              question={question}
              answer={answer as string}
              otherText={otherText}
              onAnswer={onAnswer}
              onOtherText={onOtherText}
            />
          )}
          {question.type === 'multiple' && (
            <MultipleChoiceQuestion
              question={question}
              answer={answer as string[]}
              otherText={otherText}
              onAnswer={onAnswer}
              onOtherText={onOtherText}
            />
          )}
          {question.type === 'rating' && (
            <RatingQuestion
              question={question}
              answer={answer as string}
              onAnswer={onAnswer}
            />
          )}
          {question.type === 'text' && (
            <TextQuestion
              question={question}
              answer={answer as string}
              onAnswer={onAnswer}
            />
          )}
        </div>

        {validationError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {validationError}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
