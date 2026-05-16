export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  am_completed: boolean;
  pm_completed: boolean;
  am_steps: AMSteps;
  pm_steps: PMSteps;
  pm_routine_type: "la-roche" | "mytret" | "recovery";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AMSteps {
  cleanser: boolean;
  spf: boolean;
  moisturizer: boolean;
  eye_cream: boolean;
  custom: string[];
}

export interface PMSteps {
  gentle_cleanser: boolean;
  la_roche_cleanser: boolean;
  mytret: boolean;
  moisturizer: boolean;
  recovery_routine: boolean;
  spot_treatment: boolean;
  skipped: boolean;
}

export interface SymptomEntry {
  id: string;
  user_id: string;
  date: string;
  oiliness: number;
  dryness: number;
  burning: number;
  sensitivity: number;
  redness: number;
  irritation: number;
  itching: number;
  new_pimples: number;
  painful_acne: number;
  whiteheads: number;
  blackhead_severity: number;
  forehead_congestion: number;
  beard_irritation: number;
  dark_spot_severity: number;
  overall_trend: "better" | "same" | "worse";
  created_at: string;
}

export interface LifestyleEntry {
  id: string;
  user_id: string;
  date: string;
  sleep_hours: number;
  water_intake: number;
  stress_level: number;
  sugar_intake: "none" | "low" | "medium" | "high";
  dairy_consumed: boolean;
  whey_protein_consumed: boolean;
  junk_food_consumed: boolean;
  exercise: boolean;
  sweating: boolean;
  pillowcase_changed: boolean;
  beard_shaved: boolean;
  face_touched_frequently: boolean;
  created_at: string;
}

export interface PhotoEntry {
  id: string;
  user_id: string;
  date: string;
  front_url: string | null;
  left_url: string | null;
  right_url: string | null;
  forehead_url: string | null;
  nose_url: string | null;
  beard_jaw_url: string | null;
  lighting_notes: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  generated_at: string;
  insight_type: "pattern" | "warning" | "improvement" | "correlation";
  title: string;
  body: string;
  confidence: number;
  date_range_start: string;
  date_range_end: string;
}

export interface HabitStats {
  current_streak: number;
  longest_streak: number;
  am_streak: number;
  pm_streak: number;
  weekly_completion: number;
  total_logs: number;
}

export interface SkinHealthScore {
  score: number;
  adherence_factor: number;
  acne_factor: number;
  irritation_factor: number;
  oil_balance_factor: number;
  trend_factor: number;
  calculated_at: string;
}
