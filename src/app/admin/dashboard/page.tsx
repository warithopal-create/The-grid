'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Clock,
  BarChart3,
  Zap,
  MapPin,
  CreditCard,
  Star,
  Globe,
} from 'lucide-react';
import { surveyQuestions } from '@/data/survey-questions';
import { SurveyResponse } from '@/types/survey';

interface Stats {
  totalResponses: number;
  avgCompletionTime: string;
  completionRate: string;
  topBrand: string;
  topLocation: string;
  avgInfraRating: string;
  subscriptionInterest: string;
  topAmenities: string[];
  languageBreakdown: { en: number; ar: number };
}

function computeStats(responses: SurveyResponse[]): Stats {
  const total = responses.length;
  if (total === 0) {
    return {
      totalResponses: 0,
      avgCompletionTime: '0m',
      completionRate: '0%',
      topBrand: '-',
      topLocation: '-',
      avgInfraRating: '-',
      subscriptionInterest: '0%',
      topAmenities: [],
      languageBreakdown: { en: 0, ar: 0 },
    };
  }

  const times = responses.filter(r => r.completion_time_seconds).map(r => r.completion_time_seconds!);
  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const avgMinutes = Math.floor(avgTime / 60);
  const avgSecs = avgTime % 60;

  const count = (qId: string) => {
    const tally: Record<string, number> = {};
    responses.forEach(r => {
      const a = r.answers[qId];
      if (typeof a === 'string') {
        tally[a] = (tally[a] || 0) + 1;
      } else if (Array.isArray(a)) {
        a.forEach(v => { tally[v] = (tally[v] || 0) + 1; });
      }
    });
    return tally;
  };

  const topKey = (tally: Record<string, number>) => {
    let max = 0, key = '-';
    Object.entries(tally).forEach(([k, v]) => { if (v > max) { max = v; key = k; } });
    return key;
  };

  const brandTally = count('q4');
  const topBrandId = topKey(brandTally);
  const brandQ = surveyQuestions.find(q => q.id === 'q4');
  const topBrand = brandQ?.options?.find(o => o.id === topBrandId)?.en || topBrandId;

  const locTally = count('q22');
  const topLocId = topKey(locTally);
  const locQ = surveyQuestions.find(q => q.id === 'q22');
  const topLocation = locQ?.options?.find(o => o.id === topLocId)?.en || topLocId;

  const ratings = responses.map(r => parseInt(r.answers['q11'] as string)).filter(v => !isNaN(v));
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '-';

  const subTally = count('q19');
  const interested = (subTally['yes-def'] || 0) + (subTally['prob-yes'] || 0);
  const subPct = total > 0 ? Math.round((interested / total) * 100) : 0;

  const amenTally = count('q16');
  const sortedAmen = Object.entries(amenTally).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const amenQ = surveyQuestions.find(q => q.id === 'q16');
  const topAmenities = sortedAmen.map(([id]) => amenQ?.options?.find(o => o.id === id)?.en || id);

  const enCount = responses.filter(r => r.language === 'en').length;
  const arCount = responses.filter(r => r.language === 'ar').length;

  return {
    totalResponses: total,
    avgCompletionTime: `${avgMinutes}m ${avgSecs}s`,
    completionRate: '100%',
    topBrand,
    topLocation,
    avgInfraRating: avgRating,
    subscriptionInterest: `${subPct}%`,
    topAmenities,
    languageBreakdown: { en: enCount, ar: arCount },
  };
}

export default function DashboardPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/responses')
      .then(r => r.json())
      .then(d => {
        setResponses(d.responses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = computeStats(responses);

  const cards = [
    { label: 'Total Responses', value: stats.totalResponses, icon: Users, color: 'emerald' },
    { label: 'Avg. Completion Time', value: stats.avgCompletionTime, icon: Clock, color: 'cyan' },
    { label: 'Infrastructure Rating', value: `${stats.avgInfraRating}/5`, icon: Star, color: 'yellow' },
    { label: 'Top EV Brand', value: stats.topBrand, icon: Zap, color: 'purple' },
    { label: 'Top Requested Location', value: stats.topLocation, icon: MapPin, color: 'rose' },
    { label: 'Subscription Interest', value: stats.subscriptionInterest, icon: CreditCard, color: 'blue' },
    { label: 'Completion Rate', value: stats.completionRate, icon: BarChart3, color: 'green' },
    {
      label: 'Language Split',
      value: `EN: ${stats.languageBreakdown.en} / AR: ${stats.languageBreakdown.ar}`,
      icon: Globe,
      color: 'orange',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-400/10 to-emerald-400/5 border-emerald-400/20 text-emerald-400',
    cyan: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-400',
    yellow: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20 text-yellow-400',
    purple: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-400',
    rose: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-400',
    blue: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-400',
    green: 'from-green-400/10 to-green-400/5 border-green-400/20 text-green-400',
    orange: 'from-orange-400/10 to-orange-400/5 border-orange-400/20 text-orange-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-white/40 text-sm mt-1">Real-time survey insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const colors = colorMap[card.color] || colorMap.emerald;
          return (
            <div
              key={card.label}
              className={`rounded-xl border bg-gradient-to-br p-5 ${colors}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/40 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {stats.topAmenities.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4">Most Requested Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topAmenities.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm"
              >
                #{i + 1} {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-sm font-medium text-white/60 mb-4">Recent Responses</h3>
        {responses.length === 0 ? (
          <p className="text-white/30 text-sm">No responses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-2 text-white/40 font-medium">Date</th>
                  <th className="text-left py-2 text-white/40 font-medium">Language</th>
                  <th className="text-left py-2 text-white/40 font-medium">EV Brand</th>
                  <th className="text-left py-2 text-white/40 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {responses.slice(0, 10).map((r) => {
                  const brandQ = surveyQuestions.find(q => q.id === 'q4');
                  const brand = brandQ?.options?.find(o => o.id === r.answers['q4'])?.en || '-';
                  return (
                    <tr key={r.id} className="border-b border-white/5">
                      <td className="py-2 text-white/70">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${r.language === 'en' ? 'bg-blue-400/10 text-blue-400' : 'bg-amber-400/10 text-amber-400'}`}>
                          {r.language === 'en' ? 'English' : 'العربية'}
                        </span>
                      </td>
                      <td className="py-2 text-white/70">{brand}</td>
                      <td className="py-2 text-white/50">
                        {r.completion_time_seconds ? `${Math.round(r.completion_time_seconds / 60)}m` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
