import { UserProfile, Routine, AIInsight, PhotoEntry, WeeklyData, DailyLog } from './types'

export const mockUser: UserProfile = {
  name: 'Alex',
  skinType: 'combination',
  concerns: ['Acne', 'Oiliness', 'Blackheads'],
  streak: 14,
  weeklyAdherence: 87,
  skinScore: 78,
}

export const mockAMRoutine: Routine = {
  id: 'am-routine',
  name: 'Morning Routine',
  time: 'AM',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  products: [
    { id: '1', name: 'Gentle Foaming Cleanser', brand: 'CeraVe', type: 'cleanser', completed: true },
    { id: '2', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', type: 'serum', completed: true },
    { id: '3', name: 'Moisturizing Cream', brand: 'CeraVe', type: 'moisturizer', completed: false },
    { id: '4', name: 'UV Clear SPF 46', brand: 'EltaMD', type: 'sunscreen', completed: false },
  ],
}

export const mockPMRoutine: Routine = {
  id: 'pm-routine',
  name: 'Evening Routine',
  time: 'PM',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  products: [
    { id: '5', name: 'Oil Cleanser', brand: 'DHC', type: 'cleanser', completed: false },
    { id: '6', name: 'Hydrating Cleanser', brand: 'CeraVe', type: 'cleanser', completed: false },
    { id: '7', name: 'Glycolic Acid 7% Toning Solution', brand: 'The Ordinary', type: 'exfoliant', completed: false },
    { id: '8', name: 'Retinol 0.5%', brand: 'The Ordinary', type: 'treatment', completed: false },
    { id: '9', name: 'Night Cream', brand: 'CeraVe', type: 'moisturizer', completed: false },
  ],
}

export const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'correlation',
    title: 'Breakouts after poor sleep',
    description: 'Your acne count increases 40% when you sleep less than 6 hours. Try to maintain 7-8 hours consistently.',
    icon: 'moon',
    date: '2024-01-15',
  },
  {
    id: '2',
    type: 'improvement',
    title: 'Forehead congestion improving',
    description: 'Blackhead count on your forehead has decreased 25% over the past 3 weeks. Your current routine is working!',
    icon: 'trending-up',
    date: '2024-01-14',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Potential dairy trigger detected',
    description: 'Breakouts appear within 48 hours of dairy consumption. Consider reducing dairy intake for 2 weeks to confirm.',
    icon: 'alert-triangle',
    date: '2024-01-13',
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Dryness spikes on tret nights',
    description: 'Your skin shows 35% more dryness the morning after tretinoin. Try adding a heavier occlusive on those nights.',
    icon: 'droplet',
    date: '2024-01-12',
  },
]

export const mockPhotos: PhotoEntry[] = [
  { id: '1', date: '2024-01-15', url: '/photos/progress-1.jpg', notes: 'Morning, natural light' },
  { id: '2', date: '2024-01-08', url: '/photos/progress-2.jpg', notes: 'One week progress' },
  { id: '3', date: '2024-01-01', url: '/photos/progress-3.jpg', notes: 'Starting point' },
  { id: '4', date: '2023-12-25', url: '/photos/progress-4.jpg', notes: 'Before new routine' },
]

export const mockWeeklyData: WeeklyData[] = [
  { day: 'Mon', acne: 4, oiliness: 65, dryness: 20, adherence: 100, sleep: 7.5 },
  { day: 'Tue', acne: 4, oiliness: 70, dryness: 15, adherence: 100, sleep: 6 },
  { day: 'Wed', acne: 5, oiliness: 75, dryness: 18, adherence: 85, sleep: 5.5 },
  { day: 'Thu', acne: 6, oiliness: 80, dryness: 22, adherence: 100, sleep: 7 },
  { day: 'Fri', acne: 5, oiliness: 68, dryness: 25, adherence: 70, sleep: 8 },
  { day: 'Sat', acne: 4, oiliness: 60, dryness: 20, adherence: 100, sleep: 8.5 },
  { day: 'Sun', acne: 3, oiliness: 55, dryness: 18, adherence: 100, sleep: 9 },
]

export const mockTodayLog: DailyLog = {
  id: 'today',
  date: new Date().toISOString(),
  oiliness: 65,
  dryness: 20,
  redness: 30,
  irritation: 15,
  acneCount: 4,
  blackheadSeverity: 3,
  beardIrritation: 2,
  mood: 'good',
  sleepHours: 7.5,
  hydration: 6,
  foodTriggers: ['Coffee'],
  notes: 'Skin feeling balanced today, slight oiliness in T-zone',
}

export const skinConcerns = [
  'Acne',
  'Oiliness',
  'Dryness',
  'Blackheads',
  'Whiteheads',
  'Redness',
  'Sensitivity',
  'Dark spots',
  'Fine lines',
  'Uneven texture',
  'Large pores',
  'Dullness',
]

export const skinTypes = [
  { id: 'oily', label: 'Oily', description: 'Shiny, prone to breakouts' },
  { id: 'dry', label: 'Dry', description: 'Tight, flaky patches' },
  { id: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks' },
  { id: 'normal', label: 'Normal', description: 'Balanced, few issues' },
  { id: 'sensitive', label: 'Sensitive', description: 'Reactive, easily irritated' },
]

export const foodTriggers = [
  'Dairy',
  'Sugar',
  'Gluten',
  'Alcohol',
  'Coffee',
  'Spicy food',
  'Processed food',
  'Chocolate',
  'Nuts',
  'Soy',
]
