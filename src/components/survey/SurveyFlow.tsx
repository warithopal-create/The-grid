'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useSurvey } from '@/hooks/useSurvey';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import CompletionScreen from './CompletionScreen';
import { ArrowRight, ArrowLeft, Send } from 'lucide-react';

export default function SurveyFlow() {
  const { language, t, isRTL } = useLanguage();
  const [direction, setDirection] = useState(1);
  const prevIndexRef = useRef(0);

  const {
    ready,
    currentIndex,
    currentQuestion,
    totalQuestions,
    answers,
    otherTexts,
    isSubmitting,
    isCompleted,
    validationError,
    setAnswer,
    setOtherText,
    goNext,
    goBack,
    submitSurvey,
  } = useSurvey({ language: language! });

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (isCompleted) {
    return <CompletionScreen />;
  }

  const handleNext = () => {
    setDirection(1);
    prevIndexRef.current = currentIndex;
    if (currentIndex === totalQuestions - 1) {
      submitSurvey();
    } else {
      goNext();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    prevIndexRef.current = currentIndex;
    goBack();
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const NextArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <ProgressBar
        currentIndex={currentIndex}
        total={totalQuestions}
        currentQuestion={currentQuestion}
      />

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        <QuestionCard
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          otherText={otherTexts[currentQuestion.id] || ''}
          onAnswer={(value) => setAnswer(currentQuestion.id, value)}
          onOtherText={(text) => setOtherText(currentQuestion.id, text)}
          direction={direction}
          validationError={validationError}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center justify-between mt-10 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              currentIndex === 0
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
            } ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <BackArrow className="w-4 h-4" />
            {t('back')}
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isLastQuestion
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-emerald-500/20'
                : 'bg-white/10 text-white hover:bg-white/15 border border-white/10 hover:border-white/20'
            } ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                {t('submitting')}
              </span>
            ) : isLastQuestion ? (
              <>
                {t('submit')}
                <Send className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('next')}
                <NextArrow className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-emerald-400 w-4'
                    : i < currentIndex
                    ? 'bg-emerald-400/40'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
