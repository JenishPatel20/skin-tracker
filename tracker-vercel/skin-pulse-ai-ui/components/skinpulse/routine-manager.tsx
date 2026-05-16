'use client'

import { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { 
  Sun, 
  Moon, 
  Plus, 
  GripVertical,
  Trash2,
  Clock,
  Calendar,
  ChevronDown,
  Bell,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockAMRoutine, mockPMRoutine } from '@/lib/mock-data'
import { Product } from '@/lib/types'

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

const productTypeColors: Record<string, string> = {
  cleanser: 'bg-blue-400/20 text-blue-400',
  toner: 'bg-purple-400/20 text-purple-400',
  serum: 'bg-pink-400/20 text-pink-400',
  moisturizer: 'bg-green-400/20 text-green-400',
  sunscreen: 'bg-yellow-400/20 text-yellow-400',
  treatment: 'bg-orange-400/20 text-orange-400',
  mask: 'bg-indigo-400/20 text-indigo-400',
  exfoliant: 'bg-red-400/20 text-red-400',
}

type RoutineTab = 'AM' | 'PM'

export function RoutineManager() {
  const [activeTab, setActiveTab] = useState<RoutineTab>('AM')
  const [amProducts, setAmProducts] = useState<Product[]>(mockAMRoutine.products)
  const [pmProducts, setPmProducts] = useState<Product[]>(mockPMRoutine.products)
  const [showDaysDropdown, setShowDaysDropdown] = useState(false)
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

  const currentProducts = activeTab === 'AM' ? amProducts : pmProducts
  const setCurrentProducts = activeTab === 'AM' ? setAmProducts : setPmProducts

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const removeProduct = (id: string) => {
    setCurrentProducts(prev => prev.filter(p => p.id !== id))
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
        <h1 className="text-2xl font-bold text-foreground">Routine Manager</h1>
        <p className="text-muted-foreground">Build your perfect skincare routine</p>
      </motion.div>

      {/* AM/PM Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2">
        <button
          onClick={() => setActiveTab('AM')}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'AM'
              ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50'
              : 'glass hover:bg-secondary/50'
          }`}
        >
          <Sun className={`w-5 h-5 ${activeTab === 'AM' ? 'text-yellow-400' : 'text-muted-foreground'}`} />
          <span className={`font-semibold ${activeTab === 'AM' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Morning
          </span>
        </button>
        <button
          onClick={() => setActiveTab('PM')}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'PM'
              ? 'bg-gradient-to-r from-indigo-400/20 to-purple-400/20 border-2 border-indigo-400/50'
              : 'glass hover:bg-secondary/50'
          }`}
        >
          <Moon className={`w-5 h-5 ${activeTab === 'PM' ? 'text-indigo-400' : 'text-muted-foreground'}`} />
          <span className={`font-semibold ${activeTab === 'PM' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Evening
          </span>
        </button>
      </motion.div>

      {/* Schedule Settings */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Schedule</p>
              <p className="text-xs text-muted-foreground">{selectedDays.length} days selected</p>
            </div>
          </div>
          <button 
            onClick={() => setShowDaysDropdown(!showDaysDropdown)}
            className="flex items-center gap-1 text-primary"
          >
            <span className="text-sm">Edit</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDaysDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showDaysDropdown && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border"
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDays.includes(day)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                }`}
              >
                {day}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Routine Steps */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {activeTab === 'AM' ? 'Morning' : 'Evening'} Steps
          </h2>
          <span className="text-sm text-muted-foreground">{currentProducts.length} products</span>
        </div>

        <Reorder.Group 
          axis="y" 
          values={currentProducts} 
          onReorder={setCurrentProducts}
          className="space-y-2"
        >
          {currentProducts.map((product, index) => (
            <Reorder.Item
              key={product.id}
              value={product}
              className="glass rounded-2xl p-4 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{product.brand}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${productTypeColors[product.type]}`}>
                      {product.type}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => removeProduct(product.id)}
                  className="w-8 h-8 rounded-lg hover:bg-destructive/20 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Add Product Button */}
        <Button 
          variant="outline" 
          className="w-full mt-4 h-14 rounded-2xl border-dashed border-2"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </motion.div>

      {/* Reminders */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Routine Reminder</p>
              <p className="text-xs text-muted-foreground">
                {activeTab === 'AM' ? '7:00 AM' : '9:00 PM'}
              </p>
            </div>
          </div>
          <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-5 h-5 bg-primary-foreground rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Time Settings */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Routine Time</p>
            <p className="text-xs text-muted-foreground">When should we remind you?</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-secondary text-foreground text-sm font-medium">
            {activeTab === 'AM' ? '7:00 AM' : '9:00 PM'}
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="pb-4">
        <Button 
          className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Check className="w-5 h-5 mr-2" />
          Save Routine
        </Button>
      </motion.div>
    </motion.div>
  )
}
