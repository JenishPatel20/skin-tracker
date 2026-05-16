'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Droplet, 
  Sun, 
  AlertCircle, 
  Smile, 
  Meh, 
  Frown,
  Moon,
  Coffee,
  Check,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { mockTodayLog, foodTriggers } from '@/lib/mock-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const moodOptions = [
  { id: 'great', label: 'Great', icon: Smile, color: 'text-green-400' },
  { id: 'good', label: 'Good', icon: Smile, color: 'text-primary' },
  { id: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-400' },
  { id: 'stressed', label: 'Stressed', icon: Frown, color: 'text-orange-400' },
  { id: 'anxious', label: 'Anxious', icon: Frown, color: 'text-red-400' },
]

export function DailyCheckIn() {
  const [oiliness, setOiliness] = useState(mockTodayLog.oiliness)
  const [dryness, setDryness] = useState(mockTodayLog.dryness)
  const [redness, setRedness] = useState(mockTodayLog.redness)
  const [irritation, setIrritation] = useState(mockTodayLog.irritation)
  const [acneCount, setAcneCount] = useState(mockTodayLog.acneCount)
  const [blackheadSeverity, setBlackheadSeverity] = useState(mockTodayLog.blackheadSeverity)
  const [mood, setMood] = useState(mockTodayLog.mood)
  const [sleepHours, setSleepHours] = useState(mockTodayLog.sleepHours)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(mockTodayLog.foodTriggers)
  const [notes, setNotes] = useState(mockTodayLog.notes)
  const [saved, setSaved] = useState(false)

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground">Daily Check-in</h1>
        <p className="text-muted-foreground">How&apos;s your skin feeling today?</p>
      </motion.div>

      {/* Skin Metrics Sliders */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5 space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Droplet className="w-5 h-5 text-primary" />
          Skin Metrics
        </h2>

        <MetricSlider 
          label="Oiliness" 
          value={oiliness} 
          onChange={setOiliness}
          color="from-yellow-400 to-orange-400"
        />
        <MetricSlider 
          label="Dryness" 
          value={dryness} 
          onChange={setDryness}
          color="from-blue-400 to-cyan-400"
        />
        <MetricSlider 
          label="Redness" 
          value={redness} 
          onChange={setRedness}
          color="from-red-400 to-pink-400"
        />
        <MetricSlider 
          label="Irritation" 
          value={irritation} 
          onChange={setIrritation}
          color="from-orange-400 to-red-400"
        />
      </motion.div>

      {/* Acne & Blackheads */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5 space-y-5">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Breakouts
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Active Acne Count</span>
              <span className="text-lg font-bold text-foreground">{acneCount}</span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setAcneCount(num)}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                    acneCount === num
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {num === 10 ? '10+' : num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Blackhead Severity</span>
              <span className="text-lg font-bold text-foreground">{blackheadSeverity}/5</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setBlackheadSeverity(num)}
                  className={`flex-1 h-12 rounded-xl text-sm font-medium transition-all ${
                    blackheadSeverity >= num
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mood & Sleep */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5 space-y-5">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Smile className="w-5 h-5 text-primary" />
          Mood & Energy
        </h2>

        <div>
          <span className="text-sm text-muted-foreground mb-3 block">How are you feeling?</span>
          <div className="flex gap-2">
            {moodOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setMood(option.id as typeof mood)}
                  className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    mood === option.id
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${mood === option.id ? option.color : 'text-muted-foreground'}`} />
                  <span className={`text-xs ${mood === option.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Sleep Hours
            </span>
            <span className="text-lg font-bold text-foreground">{sleepHours}h</span>
          </div>
          <Slider
            value={[sleepHours]}
            onValueChange={([val]) => setSleepHours(val)}
            min={0}
            max={12}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0h</span>
            <span>12h</span>
          </div>
        </div>
      </motion.div>

      {/* Food Triggers */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary" />
          Food Triggers Today
        </h2>

        <div className="flex flex-wrap gap-2">
          {foodTriggers.map((trigger) => (
            <button
              key={trigger}
              onClick={() => toggleTrigger(trigger)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTriggers.includes(trigger)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {trigger}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Notes</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any observations about your skin today..."
          className="bg-secondary/50 border-0 rounded-xl min-h-[100px] resize-none"
        />
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="pb-4">
        <Button 
          onClick={handleSave}
          className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Saved!
            </>
          ) : (
            'Save Check-in'
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}

function MetricSlider({ 
  label, 
  value, 
  onChange,
  color
}: { 
  label: string
  value: number
  onChange: (value: number) => void
  color: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}%</span>
      </div>
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
    </div>
  )
}
