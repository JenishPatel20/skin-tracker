'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Flame, 
  Droplet, 
  AlertTriangle,
  ChevronRight,
  Camera,
  Settings,
  TrendingUp,
  Clock
} from 'lucide-react'
import { mockUser, mockAMRoutine, mockPMRoutine, mockInsights } from '@/lib/mock-data'
import { SkinScoreGauge } from './skin-score-gauge'
import { RoutineChecklist } from './routine-checklist'
import { cn } from '@/lib/utils'

interface DashboardProps {
  onNavigate: (screen: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold text-foreground">{mockUser.name}</h1>
        </div>
        <button 
          onClick={() => onNavigate('settings')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-secondary/50 transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </motion.div>

      {/* Skin Health Score */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center gap-6">
            <SkinScoreGauge score={mockUser.skinScore} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-1">Skin Health Score</h2>
              <p className="text-sm text-muted-foreground mb-3">Your skin is doing great today!</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5 this week
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{mockUser.streak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{mockUser.weeklyAdherence}%</p>
          <p className="text-xs text-muted-foreground">Adherence</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Droplet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">6/8</p>
          <p className="text-xs text-muted-foreground">Hydration</p>
        </div>
      </motion.div>

      {/* Today's Routines */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Today&apos;s Routines</h2>
          <button 
            onClick={() => onNavigate('routine')}
            className="text-primary text-sm font-medium flex items-center gap-1"
          >
            Edit <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <RoutineChecklist 
            routine={mockAMRoutine} 
            icon={Sun}
            iconColor="text-yellow-500"
          />
          <RoutineChecklist 
            routine={mockPMRoutine} 
            icon={Moon}
            iconColor="text-indigo-400"
          />
        </div>
      </motion.div>

      {/* AI Insights Preview */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insights
          </h2>
          <button 
            onClick={() => onNavigate('insights')}
            className="text-primary text-sm font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {mockInsights.slice(0, 2).map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={cn(
                "glass rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:bg-secondary/30 transition-colors",
                insight.type === 'warning' && "border-l-2 border-l-orange-400"
              )}
              onClick={() => onNavigate('insights')}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                insight.type === 'warning' ? "bg-orange-400/20" : 
                insight.type === 'improvement' ? "bg-green-500/20" :
                insight.type === 'correlation' ? "bg-blue-400/20" : "bg-primary/20"
              )}>
                {insight.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                ) : insight.type === 'improvement' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{insight.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Log Button */}
      <motion.div variants={itemVariants}>
        <button 
          onClick={() => onNavigate('check-in')}
          className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-secondary/30 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-foreground">Log Today&apos;s Check-in</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
      </motion.div>

      {/* Photo Preview */}
      <motion.div variants={itemVariants}>
        <button 
          onClick={() => onNavigate('photos')}
          className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Camera className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Track Your Progress</p>
            <p className="text-sm text-muted-foreground">Take a photo to see your transformation</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </motion.div>
    </motion.div>
  )
}
