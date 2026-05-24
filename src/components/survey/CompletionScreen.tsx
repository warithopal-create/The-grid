'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { defaultSettings } from '@/data/survey-questions';
import { CheckCircle2, Share2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  completionText?: { en: string; ar: string };
}

export default function CompletionScreen({ completionText }: Props) {
  const { language, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);

  const text = language === 'ar'
    ? (completionText?.ar || defaultSettings.completion_ar)
    : (completionText?.en || defaultSettings.completion_en);

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'THE GRID Survey', url });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-md w-full text-center"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-10"
        >
          {text.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className={`${i === 0 ? 'text-2xl font-semibold text-white' : 'text-base text-white/60 leading-relaxed'}`}
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <Share2 className="w-4 h-4" />
          {copied
            ? (language === 'ar' ? 'تم النسخ!' : 'Copied!')
            : (language === 'ar' ? 'شارك الاستبيان' : 'Share this survey')
          }
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4" />
          <p className="text-xs text-white/20">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
              THE GRID
            </span>
            {' '}— {language === 'ar' ? 'عُمان ٢٠٢٦' : 'Oman 2026'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
