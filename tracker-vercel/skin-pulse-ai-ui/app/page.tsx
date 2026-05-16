'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Camera, 
  PlusCircle, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react'
import { OnboardingFlow } from '@/components/skinpulse/onboarding-flow'
import { Dashboard } from '@/components/skinpulse/dashboard'
import { DailyCheckIn } from '@/components/skinpulse/daily-check-in'
import { PhotoProgress } from '@/components/skinpulse/photo-progress'
import { AnalyticsScreen } from '@/components/skinpulse/analytics-screen'
import { RoutineManager } from '@/components/skinpulse/routine-manager'
import { AIInsights } from '@/components/skinpulse/ai-insights'
import { SettingsScreen } from '@/components/skinpulse/settings-screen'

type Screen = 'dashboard' | 'check-in' | 'photos' | 'analytics' | 'routine' | 'insights' | 'settings'

const navItems = [
  { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
  { id: 'photos' as Screen, icon: Camera, label: 'Progress' },
  { id: 'check-in' as Screen, icon: PlusCircle, label: 'Log' },
  { id: 'analytics' as Screen, icon: BarChart3, label: 'Analytics' },
  { id: 'insights' as Screen, icon: Sparkles, label: 'AI' },
]

export default function SkinPulseApp() {
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')

  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={() => setHasOnboarded(true)} />
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-h-full"
          >
            {currentScreen === 'dashboard' && (
              <Dashboard 
                onNavigate={setCurrentScreen} 
              />
            )}
            {currentScreen === 'check-in' && <DailyCheckIn />}
            {currentScreen === 'photos' && <PhotoProgress />}
            {currentScreen === 'analytics' && <AnalyticsScreen />}
            {currentScreen === 'routine' && <RoutineManager />}
            {currentScreen === 'insights' && <AIInsights />}
            {currentScreen === 'settings' && <SettingsScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-strong safe-bottom z-50">
        <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id
            const Icon = item.icon
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${item.id === 'check-in' ? 'w-6 h-6' : ''}`} />
                <span className="text-xs font-medium relative z-10">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
