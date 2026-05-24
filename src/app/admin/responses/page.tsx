'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Download, Trash2, X, ChevronDown, Eye } from 'lucide-react';
import { surveyQuestions } from '@/data/survey-questions';
import { SurveyResponse } from '@/types/survey';
import * as XLSX from 'xlsx';

function getLabel(qId: string, answerId: string): string {
  const q = surveyQuestions.find(q => q.id === qId);
  if (!q) return answerId;
  const opt = q.options?.find(o => o.id === answerId);
  return opt?.en || answerId;
}

function formatAnswer(qId: string, answer: string | string[] | undefined): string {
  if (!answer) return '-';
  if (Array.isArray(answer)) return answer.map(a => getLabel(qId, a)).join(', ');
  return getLabel(qId, answer);
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = () => {
    setLoading(true);
    fetch('/api/admin/responses')
      .then(r => r.json())
      .then(d => { setResponses(d.responses || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const filtered = useMemo(() => {
    return responses.filter(r => {
      if (langFilter !== 'all' && r.language !== langFilter) return false;
      if (brandFilter !== 'all' && r.answers['q4'] !== brandFilter) return false;
      if (ageFilter !== 'all' && r.answers['q1'] !== ageFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const matchesAny = Object.values(r.answers).some(v => {
          if (typeof v === 'string') return v.toLowerCase().includes(s);
          if (Array.isArray(v)) return v.some(a => a.toLowerCase().includes(s));
          return false;
        });
        if (!matchesAny && !r.id.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [responses, langFilter, brandFilter, ageFilter, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this response?')) return;
    await fetch('/api/admin/responses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setResponses(prev => prev.filter(r => r.id !== id));
    if (selectedResponse?.id === id) setSelectedResponse(null);
  };

  const exportData = (format: 'csv' | 'xlsx') => {
    const headers = ['ID', 'Date', 'Language', 'Duration (s)', ...surveyQuestions.map(q => `Q${q.number}: ${q.en}`)];
    const rows = filtered.map(r => [
      r.id,
      new Date(r.created_at).toISOString(),
      r.language,
      r.completion_time_seconds || '',
      ...surveyQuestions.map(q => {
        const a = r.answers[q.id];
        const other = r.answers[`${q.id}_other`];
        let val = formatAnswer(q.id, a);
        if (other) val += ` (Other: ${other})`;
        return val;
      }),
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');

    if (format === 'csv') {
      XLSX.writeFile(wb, 'the-grid-responses.csv', { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, 'the-grid-responses.xlsx');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Responses</h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} of {responses.length} responses</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => exportData('xlsx')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search responses..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
          />
        </div>
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-emerald-400/50"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-emerald-400/50"
        >
          <option value="all">All Brands</option>
          {surveyQuestions.find(q => q.id === 'q4')?.options?.map(o => (
            <option key={o.id} value={o.id}>{o.en}</option>
          ))}
        </select>
        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-emerald-400/50"
        >
          <option value="all">All Ages</option>
          {surveyQuestions.find(q => q.id === 'q1')?.options?.map(o => (
            <option key={o.id} value={o.id}>{o.en}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left py-3 px-4 text-white/40 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-white/40 font-medium">Lang</th>
                <th className="text-left py-3 px-4 text-white/40 font-medium">Age</th>
                <th className="text-left py-3 px-4 text-white/40 font-medium">EV Brand</th>
                <th className="text-left py-3 px-4 text-white/40 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-white/40 font-medium">Duration</th>
                <th className="text-right py-3 px-4 text-white/40 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-white/30">No responses found.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white/70">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${r.language === 'en' ? 'bg-blue-400/10 text-blue-400' : 'bg-amber-400/10 text-amber-400'}`}>
                        {r.language.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70">{formatAnswer('q1', r.answers['q1'])}</td>
                    <td className="py-3 px-4 text-white/70">{formatAnswer('q4', r.answers['q4'])}</td>
                    <td className="py-3 px-4 text-white/70">{formatAnswer('q2', r.answers['q2'])}</td>
                    <td className="py-3 px-4 text-white/50">
                      {r.completion_time_seconds ? `${Math.round(r.completion_time_seconds / 60)}m` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedResponse(r)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Response Details</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 text-sm text-white/50">
                <span>Date: {new Date(selectedResponse.created_at).toLocaleString()}</span>
                <span>Language: {selectedResponse.language.toUpperCase()}</span>
                <span>Duration: {selectedResponse.completion_time_seconds ? `${Math.round(selectedResponse.completion_time_seconds / 60)}m` : '-'}</span>
              </div>
              <div className="w-full h-px bg-white/10" />
              {surveyQuestions.map(q => {
                const answer = selectedResponse.answers[q.id];
                const other = selectedResponse.answers[`${q.id}_other`];
                return (
                  <div key={q.id} className="space-y-1">
                    <p className="text-sm text-white/40">Q{q.number}. {q.en}</p>
                    <p className="text-sm text-white">
                      {formatAnswer(q.id, answer)}
                      {other && <span className="text-white/50"> (Other: {other})</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
