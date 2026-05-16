'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun,
  Download,
  Share2,
  MessageSquare,
  User,
  Shield,
  HelpCircle,
  ChevronRight,
  Check,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

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

export function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [morningReminder, setMorningReminder] = useState(true)
  const [eveningReminder, setEveningReminder] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [exported, setExported] = useState(false)

  const handleExport = (format: string) => {
    setExported(true)
    setTimeout(() => setExported(false), 2000)
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
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">Alex</h2>
              <p className="text-sm text-muted-foreground">Combination Skin</p>
              <p className="text-xs text-primary">14 day streak</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Appearance
        </h2>
        <div className="glass rounded-2xl divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme</p>
              </div>
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={setIsDarkMode}
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Notifications
        </h2>
        <div className="glass rounded-2xl divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Enable all notifications</p>
              </div>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-foreground">Morning Reminder</p>
                <p className="text-xs text-muted-foreground">7:00 AM</p>
              </div>
            </div>
            <Switch 
              checked={morningReminder} 
              onCheckedChange={setMorningReminder}
              disabled={!notifications}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="font-medium text-foreground">Evening Reminder</p>
                <p className="text-xs text-muted-foreground">9:00 PM</p>
              </div>
            </div>
            <Switch 
              checked={eveningReminder} 
              onCheckedChange={setEveningReminder}
              disabled={!notifications}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Weekly AI Report</p>
                <p className="text-xs text-muted-foreground">Every Sunday</p>
              </div>
            </div>
            <Switch 
              checked={weeklyReport} 
              onCheckedChange={setWeeklyReport}
              disabled={!notifications}
            />
          </div>
        </div>
      </motion.div>

      {/* Export & Share */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Export & Share
        </h2>
        <div className="glass rounded-2xl divide-y divide-border">
          <button 
            onClick={() => handleExport('json')}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Export Data (JSON)</p>
                <p className="text-xs text-muted-foreground">Download all your skin data</p>
              </div>
            </div>
            {exported ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Export Summary (PDF)</p>
                <p className="text-xs text-muted-foreground">Formatted report for dermatologist</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Share with Dermatologist</p>
                <p className="text-xs text-muted-foreground">Generate shareable link</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Export for ChatGPT</p>
                <p className="text-xs text-muted-foreground">Format for AI consultation</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Support */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Support
        </h2>
        <div className="glass rounded-2xl divide-y divide-border">
          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              <p className="font-medium text-foreground">Help & FAQ</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <p className="font-medium text-foreground">Privacy Policy</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Version */}
      <motion.div variants={itemVariants} className="text-center pb-4">
        <p className="text-xs text-muted-foreground">SkinPulse AI v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">Made with care for your skin</p>
      </motion.div>
    </motion.div>
  )
}
