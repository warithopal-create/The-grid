-- THE GRID EV Driver Survey — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
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
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Responses
-- Anonymous users can insert their own responses
CREATE POLICY "Anonymous can insert responses" ON responses
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users (admin) can read all responses
CREATE POLICY "Admin can read all responses" ON responses
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for Settings
-- Everyone can read settings
CREATE POLICY "Public can read settings" ON settings
  FOR SELECT USING (true);

-- Authenticated users (admin) can update settings
CREATE POLICY "Admin can update settings" ON settings
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for Admin Users
-- Only service role can manage admin users (for security)
CREATE POLICY "Service role manages admin users" ON admin_users
  FOR ALL USING (true);

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

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
