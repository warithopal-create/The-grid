'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getSupabase } from '@/lib/supabase';
import { surveyQuestions } from '@/data/survey-questions';
import { Language } from '@/types/survey';

interface UseSurveyProps {
  language: Language;
}

export function useSurvey({ language }: UseSurveyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  const totalQuestions = surveyQuestions.length;
  const currentQuestion = surveyQuestions[currentIndex];
  const progress = ((currentIndex) / totalQuestions) * 100;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let token = localStorage.getItem('survey-session-token');
    if (!token) {
      token = uuidv4();
      localStorage.setItem('survey-session-token', token);
    }
    setSessionToken(token);

    const savedAnswers = localStorage.getItem('survey-answers');
    if (savedAnswers) {
      try { setAnswers(JSON.parse(savedAnswers)); } catch { /* ignore */ }
    }

    const savedOthers = localStorage.getItem('survey-other-texts');
    if (savedOthers) {
      try { setOtherTexts(JSON.parse(savedOthers)); } catch { /* ignore */ }
    }

    const savedIndex = localStorage.getItem('survey-current-index');
    if (savedIndex) {
      const idx = parseInt(savedIndex, 10);
      if (idx >= 0 && idx < surveyQuestions.length) {
        setCurrentIndex(idx);
      }
    }

    const savedCompleted = localStorage.getItem('survey-completed');
    if (savedCompleted === 'true') setIsCompleted(true);

    setStartTime(Date.now());
    setTimeout(() => setReady(true), 0);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('survey-answers', JSON.stringify(answers));
  }, [answers, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('survey-other-texts', JSON.stringify(otherTexts));
  }, [otherTexts, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('survey-current-index', String(currentIndex));
  }, [currentIndex, ready]);

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setValidationError(null);
  }, []);

  const setOtherText = useCallback((questionId: string, text: string) => {
    setOtherTexts(prev => ({ ...prev, [questionId]: text }));
  }, []);

  const validateCurrentQuestion = useCallback((): boolean => {
    const q = currentQuestion;
    const answer = answers[q.id];

    if (!q.required) return true;

    if (q.type === 'single') {
      if (!answer || (typeof answer === 'string' && !answer.trim())) return false;
      if (answer === 'other' && (!otherTexts[q.id] || !otherTexts[q.id].trim())) return false;
    }

    if (q.type === 'multiple') {
      if (!answer || !Array.isArray(answer) || answer.length === 0) return false;
      if (answer.includes('other') && (!otherTexts[q.id] || !otherTexts[q.id].trim())) return false;
    }

    if (q.type === 'rating') {
      if (!answer || (typeof answer === 'string' && !answer.trim())) return false;
    }

    if (q.type === 'text' && q.required) {
      if (!answer || (typeof answer === 'string' && !answer.trim())) return false;
    }

    return true;
  }, [currentQuestion, answers, otherTexts]);

  const goNext = useCallback(() => {
    if (!validateCurrentQuestion()) {
      setValidationError(
        currentQuestion.type === 'multiple'
          ? (language === 'ar' ? 'يرجى اختيار خيار واحد على الأقل' : 'Please select at least one option')
          : (language === 'ar' ? 'هذا السؤال مطلوب' : 'This question is required')
      );
      return false;
    }
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [validateCurrentQuestion, currentIndex, totalQuestions, currentQuestion, language]);

  const goBack = useCallback(() => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const submitSurvey = useCallback(async () => {
    if (!validateCurrentQuestion()) {
      setValidationError(
        currentQuestion.type === 'multiple'
          ? (language === 'ar' ? 'يرجى اختيار خيار واحد على الأقل' : 'Please select at least one option')
          : (language === 'ar' ? 'هذا السؤال مطلوب' : 'This question is required')
      );
      return false;
    }

    setIsSubmitting(true);
    const completionTime = Math.round((Date.now() - startTime) / 1000);

    const finalAnswers = { ...answers };
    Object.keys(otherTexts).forEach(qId => {
      if (otherTexts[qId]) {
        finalAnswers[`${qId}_other`] = otherTexts[qId];
      }
    });

    try {
      const deviceInfo = typeof navigator !== 'undefined'
        ? `${navigator.userAgent} | ${window.screen.width}x${window.screen.height}`
        : 'unknown';

      const { error } = await getSupabase().from('responses').insert({
        session_token: sessionToken,
        language,
        answers: finalAnswers,
        completed: true,
        device_info: deviceInfo,
        completion_time_seconds: completionTime,
      });

      if (error) throw error;

      setIsCompleted(true);
      localStorage.setItem('survey-completed', 'true');
      localStorage.removeItem('survey-answers');
      localStorage.removeItem('survey-other-texts');
      localStorage.removeItem('survey-current-index');
      return true;
    } catch (err) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
      return false;
    }
  }, [validateCurrentQuestion, answers, otherTexts, sessionToken, language, startTime, currentQuestion]);

  const resetSurvey = useCallback(() => {
    setAnswers({});
    setOtherTexts({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsSubmitting(false);
    setValidationError(null);
    localStorage.removeItem('survey-answers');
    localStorage.removeItem('survey-other-texts');
    localStorage.removeItem('survey-current-index');
    localStorage.removeItem('survey-completed');
    localStorage.removeItem('survey-session-token');
    const newToken = uuidv4();
    localStorage.setItem('survey-session-token', newToken);
    setSessionToken(newToken);
    setStartTime(Date.now());
  }, []);

  return {
    ready,
    currentIndex,
    currentQuestion,
    totalQuestions,
    progress,
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
    resetSurvey,
  };
}
