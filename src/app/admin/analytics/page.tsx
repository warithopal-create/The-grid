'use client';

import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { surveyQuestions } from '@/data/survey-questions';
import { SurveyResponse } from '@/types/survey';

const COLORS = ['#00D4AA', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

const pieLabel = ({ name, percent }: { name?: string; percent?: number }) =>
  `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`;

function tally(responses: SurveyResponse[], qId: string): Record<string, number> {
  const counts: Record<string, number> = {};
  responses.forEach(r => {
    const a = r.answers[qId];
    if (typeof a === 'string') {
      counts[a] = (counts[a] || 0) + 1;
    } else if (Array.isArray(a)) {
      a.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    }
  });
  return counts;
}

function toChartData(counts: Record<string, number>, qId: string) {
  const q = surveyQuestions.find(q => q.id === qId);
  return Object.entries(counts)
    .map(([id, value]) => ({
      name: q?.options?.find(o => o.id === id)?.en || id,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
      <h3 className="text-sm font-medium text-white/60 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/responses')
      .then(r => r.json())
      .then(d => { setResponses(d.responses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">No responses yet. Analytics will appear once responses are collected.</p>
      </div>
    );
  }

  const ageData = toChartData(tally(responses, 'q1'), 'q1');
  const occupationData = toChartData(tally(responses, 'q3'), 'q3');
  const brandData = toChartData(tally(responses, 'q4'), 'q4');
  const frequencyData = toChartData(tally(responses, 'q8'), 'q8');
  const painData = toChartData(tally(responses, 'q12'), 'q12');
  const amenityData = toChartData(tally(responses, 'q16'), 'q16');
  const pricingData = toChartData(tally(responses, 'q18'), 'q18');
  const locationData = toChartData(tally(responses, 'q22'), 'q22');
  const loyaltyData = toChartData(tally(responses, 'q20'), 'q20');
  const eventData = toChartData(tally(responses, 'q21'), 'q21');

  const infraRatings = responses.map(r => parseInt(r.answers['q11'] as string)).filter(v => !isNaN(v));
  const ratingDist = [1, 2, 3, 4, 5].map(r => ({
    name: `${r}`,
    value: infraRatings.filter(v => v === r).length,
  }));

  const hubRatings = responses.map(r => parseInt(r.answers['q15'] as string)).filter(v => !isNaN(v));
  const hubDist = [1, 2, 3, 4, 5].map(r => ({
    name: `${r}`,
    value: hubRatings.filter(v => v === r).length,
  }));

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: '#111',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '12px',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">{responses.length} total responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Age Groups">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ageData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={pieLabel}>
                {ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="EV Brands">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={brandData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={pieLabel}>
                {brandData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Occupation Sectors">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} width={150} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Charging Frequency">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#00D4AA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Infrastructure Rating Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {ratingDist.map((_, i) => <Cell key={i} fill={['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#00D4AA'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Charging Hub Interest Rating">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hubDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {hubDist.map((_, i) => <Cell key={i} fill={['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#00D4AA'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Biggest Pain Points">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={painData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} width={200} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Desired Amenities">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={amenityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} width={200} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fair Pricing Expectations">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pricingData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={pieLabel}>
                {pricingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Preferred Location">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={9} angle={-30} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Loyalty Programme Interest">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={loyaltyData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={pieLabel}>
                {loyaltyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Event Participation Interest">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={eventData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={pieLabel}>
                {eventData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
