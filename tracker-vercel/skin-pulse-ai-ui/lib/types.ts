// Types for SkinPulse AI

export interface SkinMetrics {
  oiliness: number
  dryness: number
  redness: number
  irritation: number
  acneCount: number
  blackheadSeverity: number
  beardIrritation: number
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'anxious'
  sleepHours: number
  hydration: number
  date: string
}

export interface Product {
  id: string
  name: string
  brand: string
  type: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment' | 'mask' | 'exfoliant'
  completed?: boolean
}

export interface Routine {
  id: string
  name: string
  time: 'AM' | 'PM'
  products: Product[]
  days: string[]
}

export interface AIInsight {
  id: string
  type: 'warning' | 'improvement' | 'suggestion' | 'correlation'
  title: string
  description: string
  icon: string
  date: string
}

export interface PhotoEntry {
  id: string
  date: string
  url: string
  notes?: string
}

export interface UserProfile {
  name: string
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive'
  concerns: string[]
  streak: number
  weeklyAdherence: number
  skinScore: number
}

export interface DailyLog extends SkinMetrics {
  id: string
  foodTriggers: string[]
  notes: string
}

export interface WeeklyData {
  day: string
  acne: number
  oiliness: number
  dryness: number
  adherence: number
  sleep: number
}
