-- SkinTrack AI — Supabase Schema
-- Run this in your Supabase SQL editor to initialize the database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users (extends auth.users) ──────────────────────────────────
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamptz default now(),
  display_name text,
  skin_type text default 'oily',
  onboarded boolean default false
);
alter table public.user_profiles enable row level security;
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.user_profiles for insert with check (auth.uid() = id);

-- ── Daily logs ───────────────────────────────────────────────────
create table if not exists public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  am_completed boolean default false,
  pm_completed boolean default false,
  am_steps jsonb default '{"cleanser":false,"spf":false,"moisturizer":false,"eye_cream":false,"custom":[]}',
  pm_steps jsonb default '{"gentle_cleanser":false,"la_roche_cleanser":false,"mytret":false,"moisturizer":false,"recovery_routine":false,"spot_treatment":false,"skipped":false}',
  pm_routine_type text default 'recovery',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);
alter table public.daily_logs enable row level security;
create policy "Users can manage own logs" on public.daily_logs using (auth.uid() = user_id);

-- ── Symptom entries ──────────────────────────────────────────────
create table if not exists public.symptom_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  oiliness smallint default 5 check (oiliness between 0 and 10),
  dryness smallint default 3 check (dryness between 0 and 10),
  burning smallint default 0 check (burning between 0 and 10),
  sensitivity smallint default 3 check (sensitivity between 0 and 10),
  redness smallint default 3 check (redness between 0 and 10),
  irritation smallint default 2 check (irritation between 0 and 10),
  itching smallint default 0 check (itching between 0 and 10),
  new_pimples smallint default 0 check (new_pimples >= 0),
  painful_acne smallint default 0 check (painful_acne >= 0),
  whiteheads smallint default 0 check (whiteheads >= 0),
  blackhead_severity smallint default 0 check (blackhead_severity between 0 and 10),
  forehead_congestion smallint default 0 check (forehead_congestion between 0 and 10),
  beard_irritation smallint default 0 check (beard_irritation between 0 and 10),
  dark_spot_severity smallint default 0 check (dark_spot_severity between 0 and 10),
  overall_trend text default 'same' check (overall_trend in ('better','same','worse')),
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table public.symptom_entries enable row level security;
create policy "Users can manage own symptoms" on public.symptom_entries using (auth.uid() = user_id);

-- ── Lifestyle entries ────────────────────────────────────────────
create table if not exists public.lifestyle_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  sleep_hours numeric(4,1) default 7,
  water_intake smallint default 8,
  stress_level smallint default 5 check (stress_level between 0 and 10),
  sugar_intake text default 'low' check (sugar_intake in ('none','low','medium','high')),
  dairy_consumed boolean default false,
  whey_protein_consumed boolean default false,
  junk_food_consumed boolean default false,
  exercise boolean default false,
  sweating boolean default false,
  pillowcase_changed boolean default false,
  beard_shaved boolean default false,
  face_touched_frequently boolean default false,
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table public.lifestyle_entries enable row level security;
create policy "Users can manage own lifestyle" on public.lifestyle_entries using (auth.uid() = user_id);

-- ── Photo entries ────────────────────────────────────────────────
create table if not exists public.photo_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  front_url text,
  left_url text,
  right_url text,
  forehead_url text,
  nose_url text,
  beard_jaw_url text,
  lighting_notes text default '',
  created_at timestamptz default now()
);
alter table public.photo_entries enable row level security;
create policy "Users can manage own photos" on public.photo_entries using (auth.uid() = user_id);

-- ── AI insights ──────────────────────────────────────────────────
create table if not exists public.ai_insights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  generated_at timestamptz default now(),
  insight_type text check (insight_type in ('pattern','warning','improvement','correlation')),
  title text,
  body text,
  confidence numeric(4,2),
  date_range_start date,
  date_range_end date
);
alter table public.ai_insights enable row level security;
create policy "Users can manage own insights" on public.ai_insights using (auth.uid() = user_id);

-- ── Notification settings ────────────────────────────────────────
create table if not exists public.notification_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  am_reminder boolean default true,
  am_reminder_time time default '07:30',
  pm_reminder boolean default true,
  pm_reminder_time time default '21:30',
  hydration boolean default false,
  weekly_photo boolean default true,
  pillowcase boolean default false,
  updated_at timestamptz default now()
);
alter table public.notification_settings enable row level security;
create policy "Users can manage own notifications" on public.notification_settings using (auth.uid() = user_id);

-- ── Storage bucket for photos ────────────────────────────────────
-- Run separately in Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('skin-photos', 'skin-photos', false);
-- create policy "Users can upload own photos" on storage.objects for insert with check (auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users can view own photos" on storage.objects for select using (auth.uid()::text = (storage.foldername(name))[1]);
