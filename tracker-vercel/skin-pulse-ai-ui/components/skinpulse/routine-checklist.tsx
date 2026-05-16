'use client'

import { motion } from 'framer-motion'
import { Check, LucideIcon } from 'lucide-react'
import { Routine } from '@/lib/types'

interface RoutineChecklistProps {
  routine: Routine
  icon: LucideIcon
  iconColor: string
}

export function RoutineChecklist({ routine, icon: Icon, iconColor }: RoutineChecklistProps) {
  const completedCount = routine.products.filter(p => p.completed).length
  const totalCount = routine.products.length
  const progress = (completedCount / totalCount) * 100

  return (
    <div className="glass rounded-2xl p-4 relative overflow-hidden">
      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className="font-semibold text-foreground text-sm">{routine.time}</span>
        <span className="ml-auto text-xs text-muted-foreground">{completedCount}/{totalCount}</span>
      </div>

      <div className="space-y-2">
        {routine.products.slice(0, 3).map((product) => (
          <div 
            key={product.id}
            className="flex items-center gap-2"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              product.completed 
                ? 'border-primary bg-primary' 
                : 'border-muted-foreground/30'
            }`}>
              {product.completed && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
            </div>
            <span className={`text-xs ${product.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {product.name.split(' ').slice(0, 2).join(' ')}
            </span>
          </div>
        ))}
        {routine.products.length > 3 && (
          <span className="text-xs text-muted-foreground">+{routine.products.length - 3} more</span>
        )}
      </div>
    </div>
  )
}
