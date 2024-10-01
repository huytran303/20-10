'use client'

import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Music, VolumeX, Heart, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const MemoizedImage = memo(({ src, alt, currentIndex }: { src: string; alt: string; currentIndex: number }) => (
  <motion.img
    key={currentIndex}
    src={src}
    alt={alt}
    className="rounded-lg shadow-md w-full h-auto object-cover border-4 border-white"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.5 }}
  />
))

MemoizedImage.displayName = 'MemoizedImage'

export default function RomanticLetter() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [isLetterRead, setIsLetterRead] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [petals, setPetals] = useState<React.CSSProperties[]>([])
  const [hearts, setHearts] = useState<React.CSSProperties[]>([])
  const [isAlbumComplete, setIsAlbumComplete] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const images = [
    '/placeholder.svg?height=300&width=400&text=Romantic+Moment+1',
    '/placeholder.svg?height=300&width=400&text=Romantic+Moment+2',
    '/placeholder.svg?height=300&width=400&text=Romantic+Moment+3',
    '/placeholder.svg?height=300&width=400&text=Romantic+Moment+4',
    '/placeholder.svg?height=300&width=400&text=Romantic+Moment+5',
  ]

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/nhac.mp3')
      audioRef.current.loop = true
    }
  }, [])

  const playAudio = useCallback(() => {
    if (audioRef.current && !isAudioPlaying) {
      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch(error => console.error("Audio playback failed:", error))
    }
  }, [isAudioPlaying])

  const pauseAudio = useCallback(() => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.pause()
      setIsAudioPlaying(false)
    }
  }, [isAudioPlaying])

  useEffect(() => {
    initializeAudio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [initializeAudio])

  useEffect(() => {
    const createPetals = () => {
      return Array.from({ length: 30 }, () => ({
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${10 + Math.random() * 10}s`
      }))
    }

    const createHearts = () => {
      return Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 5}s`
      }))
    }

    setPetals(createPetals())
    setHearts(createHearts())

    const interval = setInterval(() => {
      setPetals(createPetals())
    }, 20000) // Recreate petals every 20 seconds

    return () => clearInterval(interval)
  }, [])

  const handleNavigation = useCallback(() => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true)
      playAudio()
    } else if (!isLetterRead) {
      setIsLetterRead(true)
    } else if (!isAlbumComplete) {
      const nextIndex = (currentImageIndex + 1) % images.length
      setCurrentImageIndex(nextIndex)
      if (nextIndex === 0) {
        setIsAlbumComplete(true)
      }
    }
  }, [isEnvelopeOpen, isLetterRead, isAlbumComplete, currentImageIndex, images.length, playAudio])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === 'ArrowRight') {
      handleNavigation()
    }
  }, [handleNavigation])

  useEffect(() => {
    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.focus()
      currentContainer.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleKeyDown])

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAudioPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 to-red-100 flex items-center justify-center overflow-hidden relative p-4"
      ref={containerRef}
      tabIndex={0}
      aria-label="Romantic Letter Interactive Experience"
    >
      <div className="absolute inset-0 border-[20px] border-red-300 rounded-3xl m-4 sm:m-8 pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none">
        {petals.map((style, i) => (
          <motion.div
            key={`petal-${i}`}
            className="petal absolute"
            style={style}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((style, i) => (
          <motion.div
            key={`heart-${i}`}
            className="floating-heart absolute text-red-400"
            style={style}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute top-0 left-0 m-4 sm:m-8 text-2xl sm:text-4xl"
        initial={{ rotate: -45, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        🌹
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-0 m-4 sm:m-8 text-2xl sm:text-4xl"
        initial={{ rotate: 45, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        🌹
      </motion.div>

      <LayoutGroup>
        <motion.div
          layout
          className={`cursor-pointer bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg overflow-hidden ${isEnvelopeOpen
            ? 'w-[95%] max-w-md h-auto aspect-[3/4] sm:w-[90%] sm:max-w-2xl sm:aspect-[4/3]'
            : 'w-64 h-48 sm:w-72 sm:h-56'
            }`}
          onClick={handleNavigation}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'ArrowRight') {
              handleNavigation()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={isEnvelopeOpen ? (isLetterRead ? "View next image" : "Read letter") : "Open envelope"}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div layout className="w-full h-full relative p-4">
            {!isEnvelopeOpen && (
              <>
                <motion.div
                  className="absolute top-0 left-0 w-full h-1/2 bg-red-400 origin-bottom"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isEnvelopeOpen ? -180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[128px] border-l-transparent border-b-[96px] border-b-red-500 sm:border-l-[144px] sm:border-b-[112px]"></div>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[128px] border-r-transparent border-b-[96px] border-b-red-500 sm:border-r-[144px] sm:border-b-[112px]"></div>
                </motion.div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1/2 bg-red-600"
                  initial={{ y: 0 }}
                  animate={{ y: isEnvelopeOpen ? 20 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute top-0 left-0 w-0 h-0 border-l-[128px] border-l-transparent border-t-[96px] border-t-red-500 sm:border-l-[144px] sm:border-t-[112px]"></div>
                  <div className="absolute top-0 right-0 w-0 h-0 border-r-[128px] border-r-transparent border-t-[96px] border-t-red-500 sm:border-r-[144px] sm:border-t-[112px]"></div>
                </motion.div>
                <motion.div
                  className="absolute inset-2 border-4 border-white rounded-lg opacity-50"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: isEnvelopeOpen ? 0 : 0.5 }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isEnvelopeOpen ? 0 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg" />
                </motion.div>
              </>
            )}

            <AnimatePresence mode="wait">
              {isEnvelopeOpen && !isLetterRead && (
                <motion.div
                  key="letter"
                  className="text-center relative z-10 flex flex-col items-center justify-between h-full sm:block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.h1
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 font-serif drop-shadow-lg"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    My Dearest Love
                  </motion.h1>
                  <motion.div
                    className="relative inline-block mb-2 sm:mb-4"
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Image
                      src="/anh1.jpeg"
                      alt="Romantic"
                      className="rounded-lg shadow-md w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 object-cover border-4 border-white"
                      width={192}
                      height={192}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent rounded-lg"></div>
                  </motion.div>
                  <motion.div
                    className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-serif italic px-2 sm:px-4 leading-relaxed drop-shadow overflow-y-auto max-h-[40vh] sm:max-h-none scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="mb-2">
                      Your love is the most beautiful thing in my life. Every moment with you is a treasure I cherish deeply.
                    </p>
                    <p>
                      You are the rose in my garden of life, the melody in my heart&apos;s song. With each passing day, my love for you grows stronger, deeper, and more profound.
                    </p>
                  </motion.div>
                  <motion.div
                    className="mt-2 sm:mt-4 inline-block bg-white/80 text-red-500 px-2 py-1 sm:px-3 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    Click to see our memories
                  </motion.div>
                </motion.div>
              )}
              {isEnvelopeOpen && isLetterRead && !isAlbumComplete && (
                <motion.div
                  key="album"
                  className="text-center relative z-10 flex flex-col items-center justify-between h-full sm:block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.h1
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 font-serif drop-shadow-lg"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Our Love Album
                  </motion.h1>
                  <motion.div
                    className="relative inline-block mb-2 sm:mb-4 w-full max-w-[250px] sm:max-w-none"
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <MemoizedImage
                      src={images[currentImageIndex]}
                      alt={`Romantic Moment ${currentImageIndex + 1}`}
                      currentIndex={currentImageIndex}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent rounded-lg"></div>
                  </motion.div>
                  <motion.p
                    className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-serif italic px-2 sm:px-4 leading-relaxed drop-shadow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Click to see the next beautiful moment we&apos;ve shared together.
                  </motion.p>
                  <motion.div
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/80 text-red-500 p-1 sm:p-2 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </motion.div>
                </motion.div>
              )}
              {isAlbumComplete && (
                <motion.div
                  key="finalMessage"
                  className="text-center relative z-10 flex flex-col items-center justify-center h-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-serif drop-shadow-lg"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Happy 20/10
                  </motion.div>
                  <motion.p
                    className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-serif italic mt-4 px-4 leading-relaxed drop-shadow"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Thank you for being the most wonderful person in my life. I love you more than words can express.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </LayoutGroup>

      <motion.button
        onClick={toggleAudio}
        className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-colors duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        aria-label={isAudioPlaying ? "Pause music" : "Play music"}
      >
        {isAudioPlaying ? <VolumeX className="w-4 h-4 sm:w-6 sm:h-6" /> : <Music className="w-4 h-4 sm:w-6 sm:h-6" />}
      </motion.button>
    </div>
  )
}