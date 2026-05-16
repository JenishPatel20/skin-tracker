'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Droplet, 
  Sun, 
  Moon, 
  Heart, 
  Bell, 
  Camera,
  ChevronRight,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { skinTypes, skinConcerns } from '@/lib/mock-data'

interface OnboardingFlowProps {
  onComplete: () => void
}

const steps = [
  'welcome',
  'skin-type',
  'concerns',
  'am-routine',
  'pm-routine',
  'lifestyle',
  'permissions',
] as const

type Step = typeof steps[number]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [selectedSkinType, setSelectedSkinType] = useState<string>('')
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])

  const currentIndex = steps.indexOf(currentStep)
  const progress = ((currentIndex) / (steps.length - 1)) * 100

  const nextStep = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    } else {
      onComplete()
    }
  }

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/3 -right-32 w-80 h-80 bg-accent/15 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Progress Bar */}
      {currentStep !== 'welcome' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary z-10">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 glow"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                SkinPulse AI
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground max-w-xs mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Your intelligent skincare companion. Track, analyze, and transform your skin health.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs"
              >
                <Button 
                  onClick={nextStep}
                  className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Skin Type Selection */}
          {currentStep === 'skin-type' && (
            <motion.div
              key="skin-type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Droplet className="w-7 h-7 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">What&apos;s your skin type?</h2>
                <p className="text-muted-foreground">This helps us personalize your experience</p>
              </div>

              <div className="space-y-3 mb-8">
                {skinTypes.map((type, index) => (
                  <motion.button
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedSkinType(type.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      selectedSkinType === type.id
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'glass hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{type.label}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      {selectedSkinType === type.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <Button 
                onClick={nextStep}
                disabled={!selectedSkinType}
                className="h-14 text-lg rounded-2xl"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Skin Concerns */}
          {currentStep === 'concerns' && (
            <motion.div
              key="concerns"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Heart className="w-7 h-7 text-accent" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Select your concerns</h2>
                <p className="text-muted-foreground">Choose all that apply</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {skinConcerns.map((concern, index) => (
                  <motion.button
                    key={concern}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleConcern(concern)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selectedConcerns.includes(concern)
                        ? 'bg-primary text-primary-foreground'
                        : 'glass text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {concern}
                  </motion.button>
                ))}
              </div>

              <Button 
                onClick={nextStep}
                disabled={selectedConcerns.length === 0}
                className="h-14 text-lg rounded-2xl"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* AM Routine */}
          {currentStep === 'am-routine' && (
            <motion.div
              key="am-routine"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Sun className="w-7 h-7 text-yellow-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Morning Routine</h2>
                <p className="text-muted-foreground">We&apos;ll help you build the perfect AM routine</p>
              </div>

              <div className="space-y-3 mb-8">
                {['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen'].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-2xl flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-foreground font-medium">{step}</span>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={nextStep}
                className="h-14 text-lg rounded-2xl"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* PM Routine */}
          {currentStep === 'pm-routine' && (
            <motion.div
              key="pm-routine"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Moon className="w-7 h-7 text-indigo-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Evening Routine</h2>
                <p className="text-muted-foreground">Night is when your skin repairs itself</p>
              </div>

              <div className="space-y-3 mb-8">
                {['Oil Cleanser', 'Cleanser', 'Exfoliant', 'Treatment', 'Moisturizer'].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-2xl flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-foreground font-medium">{step}</span>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={nextStep}
                className="h-14 text-lg rounded-2xl"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Lifestyle */}
          {currentStep === 'lifestyle' && (
            <motion.div
              key="lifestyle"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Heart className="w-7 h-7 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Lifestyle Factors</h2>
                <p className="text-muted-foreground">These affect your skin more than you think</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Track sleep patterns', icon: Moon },
                  { label: 'Monitor stress levels', icon: Heart },
                  { label: 'Log food triggers', icon: Droplet },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-2xl flex items-center gap-4"
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{item.label}</span>
                    <div className="ml-auto w-10 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={nextStep}
                className="h-14 text-lg rounded-2xl"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Permissions */}
          {currentStep === 'permissions' && (
            <motion.div
              key="permissions"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Bell className="w-7 h-7 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Stay on track</h2>
                <p className="text-muted-foreground">Enable features to maximize your results</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Routine reminders', description: 'Never miss a step', icon: Bell },
                  { label: 'Photo access', description: 'Track visual progress', icon: Camera },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="w-10 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={onComplete}
                className="h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Start Your Journey
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      {currentStep !== 'welcome' && currentStep !== 'permissions' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          onClick={nextStep}
        >
          Skip
        </motion.button>
      )}
    </div>
  )
}
