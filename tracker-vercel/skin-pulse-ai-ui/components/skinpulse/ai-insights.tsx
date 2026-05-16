'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb,
  Moon,
  Droplet,
  Coffee,
  Brain,
  ChevronRight
} from 'lucide-react'
import { mockInsights } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const insightIcons: Record<string, React.ReactNode> = {
  moon: <Moon className="w-5 h-5" />,
  'trending-up': <TrendingUp className="w-5 h-5" />,
  'alert-triangle': <AlertTriangle className="w-5 h-5" />,
  droplet: <Droplet className="w-5 h-5" />,
}

const insightTypeStyles: Record<string, { bg: string; border: string; iconColor: string }> = {
  warning: { 
    bg: 'bg-orange-400/10', 
    border: 'border-l-orange-400',
    iconColor: 'text-orange-400'
  },
  improvement: { 
    bg: 'bg-green-400/10', 
    border: 'border-l-green-400',
    iconColor: 'text-green-400'
  },
  suggestion: { 
    bg: 'bg-blue-400/10', 
    border: 'border-l-blue-400',
    iconColor: 'text-blue-400'
  },
  correlation: { 
    bg: 'bg-purple-400/10', 
    border: 'border-l-purple-400',
    iconColor: 'text-purple-400'
  },
}

// Additional AI-generated insights
const extendedInsights = [
  ...mockInsights,
  {
    id: '5',
    type: 'suggestion' as const,
    title: 'Sugar impact detected',
    description: 'Your breakouts correlate with sugar intake. Consider reducing sugary foods for 2 weeks to see improvements.',
    icon: 'droplet',
    date: '2024-01-11',
  },
  {
    id: '6',
    type: 'improvement' as const,
    title: 'Hydration improving',
    description: 'Your skin hydration levels have improved by 15% since you started drinking more water. Keep it up!',
    icon: 'trending-up',
    date: '2024-01-10',
  },
]

export function AIInsights() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Insights
        </h1>
        <p className="text-muted-foreground">Your personalized skin coach</p>
      </motion.div>

      {/* AI Summary Card */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Weekly Summary</h2>
                <p className="text-xs text-muted-foreground">Based on 7 days of data</p>
              </div>
            </div>
            <p className="text-foreground leading-relaxed">
              Your skin health is <span className="text-primary font-semibold">improving</span>. 
              Acne count decreased by 25% this week. Focus on getting more sleep and 
              reducing dairy intake to see even better results.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-400 text-xs font-medium">
                -25% Acne
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-400 text-xs font-medium">
                +15% Hydration
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                87% Adherence
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insight Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        {[
          { label: 'Warnings', count: 1, color: 'bg-orange-400/20 text-orange-400', icon: AlertTriangle },
          { label: 'Improvements', count: 2, color: 'bg-green-400/20 text-green-400', icon: TrendingUp },
          { label: 'Suggestions', count: 2, color: 'bg-blue-400/20 text-blue-400', icon: Lightbulb },
          { label: 'Correlations', count: 1, color: 'bg-purple-400/20 text-purple-400', icon: Brain },
        ].map((category) => (
          <div key={category.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", category.color)}>
              <category.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{category.count}</p>
              <p className="text-xs text-muted-foreground">{category.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Insights List */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Insights</h2>
        <div className="space-y-3">
          {extendedInsights.map((insight, index) => {
            const styles = insightTypeStyles[insight.type]
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "glass rounded-2xl p-4 border-l-4 cursor-pointer hover:bg-secondary/30 transition-colors",
                  styles.border
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    styles.bg
                  )}>
                    <span className={styles.iconColor}>
                      {insightIcons[insight.icon] || <Sparkles className="w-5 h-5" />}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-foreground">{insight.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(insight.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Ask AI Section */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-3xl p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Ask Your AI Coach</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized advice based on your skin data
          </p>
          <button className="w-full glass rounded-2xl p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
            <span className="text-muted-foreground">Ask a question...</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
