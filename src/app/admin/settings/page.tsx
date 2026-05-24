'use client';

import { useEffect, useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { defaultSettings } from '@/data/survey-questions';

interface SettingsForm {
  intro_en: string;
  intro_ar: string;
  completion_en: string;
  completion_ar: string;
  survey_title_en: string;
  survey_title_ar: string;
  primary_color: string;
  accent_color: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    intro_en: defaultSettings.intro_en,
    intro_ar: defaultSettings.intro_ar,
    completion_en: defaultSettings.completion_en,
    completion_ar: defaultSettings.completion_ar,
    survey_title_en: defaultSettings.survey_title_en,
    survey_title_ar: defaultSettings.survey_title_ar,
    primary_color: defaultSettings.primary_color,
    accent_color: defaultSettings.accent_color,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          setForm({
            intro_en: d.settings.intro_en || defaultSettings.intro_en,
            intro_ar: d.settings.intro_ar || defaultSettings.intro_ar,
            completion_en: d.settings.completion_en || defaultSettings.completion_en,
            completion_ar: d.settings.completion_ar || defaultSettings.completion_ar,
            survey_title_en: d.settings.survey_title_en || defaultSettings.survey_title_en,
            survey_title_ar: d.settings.survey_title_ar || defaultSettings.survey_title_ar,
            primary_color: d.settings.primary_color || defaultSettings.primary_color,
            accent_color: d.settings.accent_color || defaultSettings.accent_color,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setForm({
      intro_en: defaultSettings.intro_en,
      intro_ar: defaultSettings.intro_ar,
      completion_en: defaultSettings.completion_en,
      completion_ar: defaultSettings.completion_ar,
      survey_title_en: defaultSettings.survey_title_en,
      survey_title_ar: defaultSettings.survey_title_ar,
      primary_color: defaultSettings.primary_color,
      accent_color: defaultSettings.accent_color,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const Field = ({
    label,
    value,
    onChange,
    type = 'text',
    dir,
    rows,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    dir?: string;
    rows?: number;
  }) => (
    <div>
      <label className="block text-sm text-white/50 mb-2">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          dir={dir}
          className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 resize-none ${dir === 'rtl' ? 'text-right' : ''}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
          className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 ${dir === 'rtl' ? 'text-right' : ''} ${type === 'color' ? 'h-12 cursor-pointer' : ''}`}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/40 text-sm mt-1">Manage survey content and branding</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-sm font-medium text-white/60">Survey Titles</h3>
        <Field
          label="English Title"
          value={form.survey_title_en}
          onChange={(v) => setForm(f => ({ ...f, survey_title_en: v }))}
        />
        <Field
          label="Arabic Title"
          value={form.survey_title_ar}
          onChange={(v) => setForm(f => ({ ...f, survey_title_ar: v }))}
          dir="rtl"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-sm font-medium text-white/60">Introduction Text</h3>
        <Field
          label="English Introduction"
          value={form.intro_en}
          onChange={(v) => setForm(f => ({ ...f, intro_en: v }))}
          rows={5}
        />
        <Field
          label="Arabic Introduction"
          value={form.intro_ar}
          onChange={(v) => setForm(f => ({ ...f, intro_ar: v }))}
          rows={5}
          dir="rtl"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-sm font-medium text-white/60">Completion Message</h3>
        <Field
          label="English Completion"
          value={form.completion_en}
          onChange={(v) => setForm(f => ({ ...f, completion_en: v }))}
          rows={3}
        />
        <Field
          label="Arabic Completion"
          value={form.completion_ar}
          onChange={(v) => setForm(f => ({ ...f, completion_ar: v }))}
          rows={3}
          dir="rtl"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-sm font-medium text-white/60">Branding</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Primary Color"
            value={form.primary_color}
            onChange={(v) => setForm(f => ({ ...f, primary_color: v }))}
            type="color"
          />
          <Field
            label="Accent Color"
            value={form.accent_color}
            onChange={(v) => setForm(f => ({ ...f, accent_color: v }))}
            type="color"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.primary_color }} />
            <span className="text-xs text-white/40">{form.primary_color}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.accent_color }} />
            <span className="text-xs text-white/40">{form.accent_color}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
