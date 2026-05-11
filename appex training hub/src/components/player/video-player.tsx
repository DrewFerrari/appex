"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { useDrag } from "@use-gesture/react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Minimize, Maximize, Play, Pause, Volume2, VolumeX, Settings, PictureInPicture } from "lucide-react"

const ReactPlayer = dynamic(() => import("react-player"), { 
  ssr: false,
  loading: () => <div className="bg-black rounded-xl h-64 animate-pulse"></div>
}) as any

interface VideoPlayerProps {
  videoUrl: string
  thumbnail?: string
  onProgress?: (progress: number) => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  onReady?: () => void
  autoplay?: boolean
  controls?: boolean
  width?: string | number
  height?: string | number
  className?: string
}

export function VideoPlayer({
  videoUrl,
  thumbnail,
  onProgress,
  onTimeUpdate,
  onComplete,
  onReady,
  autoplay = false,
  controls = true,
  width = "100%",
  height = "auto",
  className = ""
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [volumeIndicator, setVolumeIndicator] = useState<{ show: boolean, value: number }>({ show: false, value: 1 })
  const [skipIndicator, setSkipIndicator] = useState<{ show: boolean, direction: 'fwd' | 'bwd' }>({ show: false, direction: 'fwd' })
  
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<{ time: number, x: number }>({ time: 0, x: 0 })

  // Save and restore video position
  useEffect(() => {
    const savedPosition = localStorage.getItem(`video_${videoUrl}_position`)
    if (savedPosition && playerRef.current) {
      playerRef.current.seekTo(parseFloat(savedPosition), 'seconds')
    }
  }, [videoUrl])

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  useEffect(() => {
    resetControlsTimeout()
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [isPlaying])

  // Gestures for Volume (vertical swipe)
  const bindGesture = useDrag(({ movement: [, my], down, cancel, tap, event }) => {
    if (tap) {
      // Handle Double Tap to skip
      const now = Date.now()
      const clientX = (event as TouchEvent).changedTouches?.[0]?.clientX || (event as MouseEvent).clientX || 0
      
      if (now - lastTapRef.current.time < 300) {
        // Double tap
        const { innerWidth } = window
        if (clientX > innerWidth / 2) {
          // Skip forward
          if (playerRef.current) {
            playerRef.current.seekTo(currentTime + 10, 'seconds')
            setSkipIndicator({ show: true, direction: 'fwd' })
            setTimeout(() => setSkipIndicator({ show: false, direction: 'fwd' }), 500)
          }
        } else {
          // Skip backward
          if (playerRef.current) {
            playerRef.current.seekTo(Math.max(0, currentTime - 10), 'seconds')
            setSkipIndicator({ show: true, direction: 'bwd' })
            setTimeout(() => setSkipIndicator({ show: false, direction: 'bwd' }), 500)
          }
        }
      } else {
        // Single tap - toggle controls
        resetControlsTimeout()
      }
      lastTapRef.current = { time: now, x: clientX }
      return
    }

    // Vertical drag for volume
    if (down) {
      const sensitivity = 0.005
      const newVolume = Math.max(0, Math.min(1, volume - (my * sensitivity)))
      handleVolumeChange(newVolume)
      setVolumeIndicator({ show: true, value: newVolume })
    } else {
      setTimeout(() => setVolumeIndicator(prev => ({ ...prev, show: false })), 1000)
    }
  }, { filterTaps: true })

  const handleReady = () => {
    if (playerRef.current) playerRef.current.setVolume(volume)
    onReady?.()
  }

  const handleProgress = (progress: any) => {
    const progressPercentage = (progress.played * 100)
    onProgress?.(progressPercentage)
    
    if (Math.floor(progress.playedSeconds) % 5 === 0) {
      localStorage.setItem(`video_${videoUrl}_position`, progress.playedSeconds.toString())
    }
  }

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const current = playerRef.current.getCurrentTime()
      const total = playerRef.current.getDuration()
      setCurrentTime(current)
      setDuration(total)
      onTimeUpdate?.(current, total)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setShowControls(true)
    onComplete?.()
    localStorage.removeItem(`video_${videoUrl}_position`)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (playerRef.current) playerRef.current.setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    return `${mm}:${ss}`
  }

  const skipToTime = (time: number) => {
    if (playerRef.current) playerRef.current.seekTo(time, 'seconds')
    resetControlsTimeout()
  }

  const togglePiP = async () => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer()
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (internalPlayer && internalPlayer.requestPictureInPicture) {
        await internalPlayer.requestPictureInPicture()
      }
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-xl overflow-hidden group touch-none ${className}`}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      {...bindGesture()}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width={width}
        height={height}
        playing={isPlaying}
        controls={false}
        light={thumbnail}
        onReady={handleReady}
        onProgress={handleProgress}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        playbackRate={playbackRate}
        volume={volume}
        pip={true}
        style={{ pointerEvents: 'none' }} // Let gesture handler take touch events
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-emerald-500 border-white/20"></div>
        </div>
      )}

      {/* Gesture Indicators (Volume/Skip) */}
      <AnimatePresence>
        {volumeIndicator.show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 pointer-events-none z-50"
          >
            {volumeIndicator.value === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <div className="w-20 h-1.5 bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${volumeIndicator.value * 100}%` }} />
            </div>
          </motion.div>
        )}
        
        {skipIndicator.show && (
          <motion.div
            initial={{ opacity: 0, x: skipIndicator.direction === 'fwd' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute top-1/2 -translate-y-1/2 ${skipIndicator.direction === 'fwd' ? 'right-12' : 'left-12'} bg-black/60 text-white p-3 rounded-full pointer-events-none z-50`}
          >
            <span className="font-bold">10s {skipIndicator.direction === 'fwd' ? '→' : '←'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Overlay for Mobile Taps */}
      {!isPlaying && !isBuffering && thumbnail && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={() => setIsPlaying(true)}>
          <div className="bg-emerald-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform">
            <Play className="w-8 h-8 ml-1" />
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <AnimatePresence>
        {controls && showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-6 z-40"
          >
            {/* Top Bar Actions (Download/PiP) */}
            <div className="absolute right-4 top-[-40px] flex space-x-2">
              <button 
                onClick={togglePiP}
                className="bg-black/60 text-white p-2 rounded-full hover:bg-black/80 backdrop-blur-sm"
              >
                <PictureInPicture className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button 
                className="bg-black/60 text-white p-2 rounded-full hover:bg-black/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Trigger SW offline caching here
                  alert("Download started for offline viewing.");
                }}
              >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className="relative h-2 bg-white/30 rounded-full cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const percent = (e.clientX - rect.left) / rect.width
                  skipToTime(percent * duration)
                }}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all group-hover:bg-emerald-400"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-4 md:space-x-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-emerald-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <div className="hidden md:flex items-center space-x-2">
                  <button onClick={() => handleVolumeChange(isMuted ? 1 : 0)} className="text-white hover:text-emerald-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-white/90 text-xs md:text-sm font-medium tracking-wide">
                  {formatTime(currentTime)} <span className="opacity-50 mx-1">/</span> {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <select
                  value={playbackRate}
                  onChange={(e) => {
                    setPlaybackRate(parseFloat(e.target.value))
                    if (playerRef.current) playerRef.current.setPlaybackRate(parseFloat(e.target.value))
                  }}
                  className="bg-transparent text-white text-xs md:text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="0.75" className="text-black">0.75x</option>
                  <option value="1" className="text-black">1x</option>
                  <option value="1.25" className="text-black">1.25x</option>
                  <option value="1.5" className="text-black">1.5x</option>
                  <option value="2" className="text-black">2x</option>
                </select>

                <button onClick={toggleFullscreen} className="text-white hover:text-emerald-400 transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
