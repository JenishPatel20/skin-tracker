'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Moon,
  Droplet,
  Coffee,
  Activity
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { mockWeeklyData } from '@/lib/mock-data'

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

// Correlation data
const sleepCorrelation = [
  { sleep: 5, breakouts: 8 },
  { sleep: 5.5, breakouts: 7 },
  { sleep: 6, breakouts: 6 },
  { sleep: 6.5, breakouts: 5 },
  { sleep: 7, breakouts: 4 },
  { sleep: 7.5, breakouts: 3 },
  { sleep: 8, breakouts: 2 },
  { sleep: 8.5, breakouts: 2 },
]

const dairyCorrelation = [
  { week: 'W1', withDairy: 6, withoutDairy: 2 },
  { week: 'W2', withDairy: 7, withoutDairy: 3 },
  { week: 'W3', withDairy: 5, withoutDairy: 2 },
  { week: 'W4', withDairy: 8, withoutDairy: 3 },
]

const adherenceHeatmap = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1],
]

export function AnalyticsScreen() {
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
          <BarChart3 className="w-6 h-6 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground">Deep insights into your skin health</p>
      </motion.div>

      {/* Acne Trend Chart */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Acne Count Trend</h2>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingDown className="w-4 h-4" />
            -25% this week
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockWeeklyData}>
              <defs>
                <linearGradient id="acneGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.14 180)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="oklch(0.72 0.14 180)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" />
              <XAxis dataKey="day" stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <YAxis stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(0.16 0.008 260)', 
                  border: '1px solid oklch(0.25 0.015 260)',
                  borderRadius: '12px',
                  color: 'oklch(0.95 0.01 240)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="acne" 
                stroke="oklch(0.72 0.14 180)" 
                strokeWidth={2}
                fill="url(#acneGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Oiliness & Dryness */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-400" />
            Oiliness vs Dryness
          </h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" />
              <XAxis dataKey="day" stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <YAxis stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(0.16 0.008 260)', 
                  border: '1px solid oklch(0.25 0.015 260)',
                  borderRadius: '12px',
                  color: 'oklch(0.95 0.01 240)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="oiliness" 
                stroke="oklch(0.85 0.15 85)" 
                strokeWidth={2}
                dot={{ fill: 'oklch(0.85 0.15 85)', r: 4 }}
                name="Oiliness"
              />
              <Line 
                type="monotone" 
                dataKey="dryness" 
                stroke="oklch(0.65 0.15 220)" 
                strokeWidth={2}
                dot={{ fill: 'oklch(0.65 0.15 220)', r: 4 }}
                name="Dryness"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-xs text-muted-foreground">Oiliness</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs text-muted-foreground">Dryness</span>
          </div>
        </div>
      </motion.div>

      {/* Adherence Heatmap */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Routine Adherence
          </h2>
          <span className="text-sm text-muted-foreground">Last 4 weeks</span>
        </div>
        <div className="space-y-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8">{day}</span>
              <div className="flex gap-1 flex-1">
                {adherenceHeatmap.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className={`flex-1 h-6 rounded-md transition-colors ${
                      week[dayIndex] === 1 
                        ? 'bg-primary/80' 
                        : 'bg-secondary/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-xs text-muted-foreground">4 weeks ago</span>
          <span className="text-xs text-muted-foreground">This week</span>
        </div>
      </motion.div>

      {/* Sleep Correlation */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            Sleep vs Breakouts
          </h2>
          <span className="px-2 py-1 rounded-full bg-indigo-400/20 text-indigo-400 text-xs font-medium">
            AI Correlation
          </span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sleepCorrelation}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 280)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="oklch(0.65 0.18 280)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" />
              <XAxis dataKey="sleep" stroke="oklch(0.65 0.02 240)" fontSize={12} unit="h" />
              <YAxis stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(0.16 0.008 260)', 
                  border: '1px solid oklch(0.25 0.015 260)',
                  borderRadius: '12px',
                  color: 'oklch(0.95 0.01 240)'
                }}
                formatter={(value: number) => [value, 'Breakouts']}
                labelFormatter={(label: number) => `${label}h sleep`}
              />
              <Area 
                type="monotone" 
                dataKey="breakouts" 
                stroke="oklch(0.65 0.18 280)" 
                strokeWidth={2}
                fill="url(#sleepGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Less sleep correlates with more breakouts
        </p>
      </motion.div>

      {/* Dairy Correlation */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Coffee className="w-5 h-5 text-orange-400" />
            Dairy Impact
          </h2>
          <span className="px-2 py-1 rounded-full bg-orange-400/20 text-orange-400 text-xs font-medium">
            Potential Trigger
          </span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dairyCorrelation}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" />
              <XAxis dataKey="week" stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <YAxis stroke="oklch(0.65 0.02 240)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(0.16 0.008 260)', 
                  border: '1px solid oklch(0.25 0.015 260)',
                  borderRadius: '12px',
                  color: 'oklch(0.95 0.01 240)'
                }}
              />
              <Bar dataKey="withDairy" fill="oklch(0.75 0.15 45)" name="With Dairy" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withoutDairy" fill="oklch(0.72 0.14 180)" name="Without Dairy" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-xs text-muted-foreground">Days with dairy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Days without</span>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <TrendingDown className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">-40%</p>
          <p className="text-xs text-muted-foreground">Acne reduction</p>
          <p className="text-xs text-green-400">Last 30 days</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">92%</p>
          <p className="text-xs text-muted-foreground">Avg adherence</p>
          <p className="text-xs text-primary">Last 30 days</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
