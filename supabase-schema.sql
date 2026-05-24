-- THE GRID EV Driver Survey — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'ar')),
  answers JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN NOT NULL DEFAULT false,
  device_info TEXT,
  completion_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  intro_en TEXT NOT NULL DEFAULT '',
  intro_ar TEXT NOT NULL DEFAULT '',
  completion_en TEXT NOT NULL DEFAULT '',
  completion_ar TEXT NOT NULL DEFAULT '',
  survey_title_en TEXT NOT NULL DEFAULT 'EV Driver Survey — Oman 2026',
  survey_title_ar TEXT NOT NULL DEFAULT 'استبيان سائقي السيارات الكهربائية — عُمان ٢٠٢٦',
  primary_color TEXT NOT NULL DEFAULT '#00D4AA',
  accent_color TEXT NOT NULL DEFAULT '#0EA5E9',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO settings (
  intro_en, intro_ar, completion_en, completion_ar
) VALUES (
  E'Thank you for taking 3 minutes to help us understand the EV charging experience in Oman.\n\nYour honest answers will directly shape THE GRID — a premium EV charging destination currently being designed for Muscat.\n\nThis survey is completely anonymous and your responses will only be used in aggregate.',
  E'شكرًا لمنحنا ٣ دقائق من وقتك لمساعدتنا في فهم تجربة شحن السيارات الكهربائية في عُمان.\n\nستساهم إجاباتك الصادقة في تشكيل مشروع ذا قريد — وجهة متميزة لشحن السيارات الكهربائية يتم تصميمها خصيصًا لمسقط.\n\nهذا الاستبيان مجهول الهوية تمامًا، وستُستخدم إجاباتك بصورة مجمّعة فقط.',
  E'Thank you.\n\nYour input directly shapes how Oman''s EV future gets built.',
  E'شكرًا لك.\n\nإجاباتك تساهم مباشرة في تشكيل مستقبل السيارات الكهربائية في عُمان.'
) ON CONFLICT DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_responses_session ON responses(session_token);
CREATE INDEX IF NOT EXISTS idx_responses_language ON responses(language);
CREATE INDEX IF NOT EXISTS idx_responses_completed ON responses(completed);
CREATE INDEX IF NOT EXISTS idx_responses_created ON responses(created_at DESC);

-- Enable RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anonymous inserts for survey responses
CREATE POLICY "Allow anonymous inserts" ON responses
  FOR INSERT TO anon WITH CHECK (true);

-- Allow read for authenticated/service role
CREATE POLICY "Allow service role read" ON responses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow anon read own" ON responses
  FOR SELECT TO anon USING (true);

-- Settings readable by everyone
CREATE POLICY "Allow public read settings" ON settings
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow service update settings" ON settings
  FOR ALL TO authenticated USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
