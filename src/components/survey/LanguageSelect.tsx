'use client';

import { motion } from 'framer-motion';
import { Language } from '@/types/survey';

interface Props {
  onSelect: (lang: Language) => void;
}

export default function LanguageSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative text-center max-w-md w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-2"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              THE GRID
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12 space-y-1"
        >
          <p className="text-sm text-white/50 tracking-widest uppercase">
            EV Driver Survey — Oman 2026
          </p>
          <p className="text-sm text-white/40 font-arabic" dir="rtl">
            استبيان سائقي السيارات الكهربائية — عُمان ٢٠٢٦
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/40 text-sm mb-8 tracking-wide"
        >
          Select your language / اختر لغتك
        </motion.p>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('en')}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 hover:border-emerald-400/40 hover:bg-emerald-400/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/5 group-hover:to-cyan-400/5 transition-all duration-500" />
            <div className="relative">
              <span className="text-2xl mb-3 block">🇬🇧</span>
              <span className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                English
              </span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('ar')}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:to-emerald-400/5 transition-all duration-500" />
            <div className="relative">
              <span className="text-2xl mb-3 block">🇴🇲</span>
              <span className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors font-arabic">
                العربية
              </span>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  );
}
