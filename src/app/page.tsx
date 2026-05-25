'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Lock } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚡</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              THE GRID
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-white/80 hover:text-white transition">Home</a>
            <a href="#survey" className="text-white/80 hover:text-white transition">Survey</a>
            <a href="#about" className="text-white/80 hover:text-white transition">About</a>
          </div>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 hover:border-emerald-400/60 text-emerald-300 hover:text-emerald-200 transition-all group"
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Admin</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 px-4">
        {/* Gradient Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-emerald-400 font-semibold text-sm mb-2 tracking-widest">EV DRIVER SURVEY</p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Shape Oman's
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  EV Future
                </span>
              </h1>
            </div>

            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              Your insights directly influence THE GRID — a premium EV charging destination being designed for Muscat. Help us build the future of sustainable transport in Oman.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/survey')}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
              >
                Start Survey
              </button>
              <button
                onClick={() => document.getElementById('survey')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
              >
                Learn More
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-white/60 text-sm">Takes just 3 minutes</p>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>Completely Anonymous</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>Data Aggregated Only</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-[600px] hidden md:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl backdrop-blur-xl border border-white/10" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <span className="text-6xl">⚡</span>
              </div>

              <div className="text-center space-y-2">
                <p className="text-white/40 text-sm">Trusted by EV Drivers</p>
                <p className="text-4xl font-bold">1000+ Responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/40 text-xs tracking-widest">SCROLL</p>
            <ChevronDown className="w-5 h-5 text-emerald-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Survey Info Section */}
      <section id="survey" className="min-h-screen flex items-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Your Opinion Matters</h2>
            <p className="text-white/60 text-lg">Help us understand EV charging needs across Oman</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Real Insights',
                description: 'Your responses shape actual infrastructure decisions for THE GRID charging hub'
              },
              {
                icon: '🔒',
                title: 'Your Privacy',
                description: 'Completely anonymous survey. We aggregate responses only — no personal data stored'
              },
              {
                icon: '⚡',
                title: 'Quick & Easy',
                description: 'Just 24 questions. Takes 3 minutes. Mobile-friendly survey experience'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/30 transition-all space-y-4 group"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to shape Oman's EV future?
          </h2>
          <p className="text-white/60 text-lg">
            Your insights take just 3 minutes and directly influence THE GRID's development
          </p>
          <button
            onClick={() => router.push('/survey')}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 inline-block"
          >
            Start Survey Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-white/40 text-sm">© 2026 THE GRID. All rights reserved.</p>
          <p className="text-white/40 text-sm">EV Driver Survey — Oman 2026</p>
        </div>
      </footer>
    </div>
  );
}
