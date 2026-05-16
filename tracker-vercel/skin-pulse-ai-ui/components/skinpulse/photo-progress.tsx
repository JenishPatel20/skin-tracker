'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  Calendar,
  X,
  ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

// Mock photo data with gradient placeholders
const mockPhotos = [
  { id: '1', date: '2024-01-15', gradient: 'from-primary/40 to-accent/40' },
  { id: '2', date: '2024-01-08', gradient: 'from-blue-400/40 to-cyan-400/40' },
  { id: '3', date: '2024-01-01', gradient: 'from-purple-400/40 to-pink-400/40' },
  { id: '4', date: '2023-12-25', gradient: 'from-orange-400/40 to-red-400/40' },
  { id: '5', date: '2023-12-18', gradient: 'from-green-400/40 to-teal-400/40' },
  { id: '6', date: '2023-12-11', gradient: 'from-indigo-400/40 to-violet-400/40' },
]

type ViewMode = 'week' | 'month'

export function PhotoProgress() {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [sliderPosition, setSliderPosition] = useState(50)
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null)

  const togglePhotoSelection = (id: string) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(prev => prev.filter(p => p !== id))
    } else if (selectedPhotos.length < 2) {
      setSelectedPhotos(prev => [...prev, id])
    }
  }

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
          <h1 className="text-2xl font-bold text-foreground">Photo Progress</h1>
          <p className="text-muted-foreground">Track your transformation</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? 'Exit Compare' : 'Compare'}
        </Button>
      </motion.div>

      {/* View Toggle */}
      <motion.div variants={itemVariants} className="flex gap-2">
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'week' 
              ? 'bg-primary text-primary-foreground' 
              : 'glass text-muted-foreground hover:text-foreground'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'month' 
              ? 'bg-primary text-primary-foreground' 
              : 'glass text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly
        </button>
      </motion.div>

      {/* Compare View */}
      {compareMode && selectedPhotos.length === 2 && (
        <motion.div 
          variants={itemVariants}
          className="glass rounded-3xl p-4 space-y-4"
        >
          <h3 className="text-sm font-medium text-muted-foreground text-center">Before / After Comparison</h3>
          
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            {/* Before Image */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${mockPhotos.find(p => p.id === selectedPhotos[0])?.gradient}`}
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                <span className="text-xs text-white">Before</span>
              </div>
            </div>
            
            {/* After Image */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${mockPhotos.find(p => p.id === selectedPhotos[1])?.gradient}`}
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                <span className="text-xs text-white">After</span>
              </div>
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => setSelectedPhotos([])}
          >
            Clear Selection
          </Button>
        </motion.div>
      )}

      {/* Photo Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Timeline
          </h2>
          {compareMode && (
            <span className="text-xs text-muted-foreground">
              Select 2 photos ({selectedPhotos.length}/2)
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {mockPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                onClick={() => compareMode ? togglePhotoSelection(photo.id) : setZoomedPhoto(photo.id)}
                className={`aspect-square w-full rounded-2xl bg-gradient-to-br ${photo.gradient} relative overflow-hidden transition-all ${
                  compareMode && selectedPhotos.includes(photo.id)
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'hover:scale-105'
                }`}
              >
                {/* Face alignment guide mockup */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-16 h-20 border-2 border-dashed border-white rounded-full" />
                </div>

                {/* Selection indicator */}
                {compareMode && selectedPhotos.includes(photo.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">
                      {selectedPhotos.indexOf(photo.id) + 1}
                    </span>
                  </div>
                )}

                {/* Zoom indicator */}
                {!compareMode && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upload Button */}
      <motion.div variants={itemVariants}>
        <Button 
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Progress Photo
        </Button>
      </motion.div>

      {/* Empty State Upload */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Facial Alignment Guide</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For best results, align your face with the guide when taking photos
          </p>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Upload from Gallery
          </Button>
        </div>
      </motion.div>

      {/* Photo Zoom Modal */}
      <AnimatePresence>
        {zoomedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomedPhoto(null)}
          >
            <button 
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              onClick={() => setZoomedPhoto(null)}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br ${
                mockPhotos.find(p => p.id === zoomedPhoto)?.gradient
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
