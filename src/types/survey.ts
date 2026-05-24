export type Language = 'en' | 'ar';

export type QuestionType = 'single' | 'multiple' | 'rating' | 'text';

export interface QuestionOption {
  id: string;
  en: string;
  ar: string;
  hasOtherInput?: boolean;
}

export interface Question {
  id: string;
  number: number;
  type: QuestionType;
  required: boolean;
  en: string;
  ar: string;
  section: string;
  sectionEn: string;
  sectionAr: string;
  options?: QuestionOption[];
  ratingMin?: number;
  ratingMax?: number;
  ratingMinLabelEn?: string;
  ratingMinLabelAr?: string;
  ratingMaxLabelEn?: string;
  ratingMaxLabelAr?: string;
  multiSelectNote?: { en: string; ar: string };
}

export interface SurveyResponse {
  id: string;
  session_token: string;
  language: Language;
  answers: Record<string, string | string[]>;
  completed: boolean;
  created_at: string;
  updated_at: string;
  device_info: string;
  completion_time_seconds?: number;
}

export interface SiteSettings {
  id: string;
  intro_en: string;
  intro_ar: string;
  completion_en: string;
  completion_ar: string;
  survey_title_en: string;
  survey_title_ar: string;
  primary_color: string;
  accent_color: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
}
