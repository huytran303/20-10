"use client"

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Pause, Play } from 'lucide-react'
import Image from 'next/image'

const memories = [
  { id: 1, src: "/anh1.jpeg", alt: "Kỷ niệm 1" },
  { id: 2, src: "/anh1.jpeg", alt: "Kỷ niệm 2" },
  { id: 3, src: "/anh1.jpeg", alt: "Kỷ niệm 3" },
  { id: 4, src: "/anh1.jpeg", alt: "Kỷ niệm 4" },
  { id: 5, src: "/anh1.jpeg", alt: "Kỷ niệm 5" },
  { id: 6, src: "/anh1.jpeg", alt: "Kỷ niệm 6" },
]

const sections = ['home', 'memories', 'message', 'gift']

const StarryBackground = memo(() => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(100)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    ))}
  </div>
))

StarryBackground.displayName = 'StarryBackground'

const MemoryImage = memo(({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="aspect-square relative overflow-hidden rounded-lg shadow-lg"
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className={`transition-all duration-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
        onLoadingComplete={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-pink-200 animate-pulse" />
      )}
    </motion.div>
  )
})

MemoryImage.displayName = 'MemoryImage'

export function Page() {
  const [activeSection, setActiveSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [isAudioLoaded, setIsAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/nhac.mp3')
    audioRef.current.loop = true

    audioRef.current.addEventListener('canplaythrough', () => {
      setIsAudioLoaded(true)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playAudio = useCallback(() => {
    if (audioRef.current && isAudioLoaded) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.log("Autoplay prevented:", error)
          setIsPlaying(false)
        })
    }
  }, [isAudioLoaded])

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isPlaying && isAudioLoaded) {
        playAudio()
      }
      document.removeEventListener('click', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [isPlaying, isAudioLoaded, playAudio])

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    setActiveSection(prevSection => {
      if (direction === 'next') {
        return (prevSection + 1) % sections.length
      } else {
        return (prevSection - 1 + sections.length) % sections.length
      }
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNavigation('next')
      } else if (event.key === 'ArrowLeft') {
        handleNavigation('prev')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNavigation])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      handleNavigation('next')
    }
  }, [handleNavigation])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleNavigation('prev')
  }, [handleNavigation])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 overflow-hidden cursor-pointer"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Quicksand', sans-serif;
        }
      `}</style>

      <StarryBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={sections[activeSection]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mt-16 md:mt-20"
        >
          {sections[activeSection] === 'home' && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-6xl font-bold text-pink-300 mb-4 md:mb-8"
              >
                Chúc Mừng 20/10!
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-lg md:text-2xl text-center text-pink-200 mb-4 md:mb-8"
              >
                Gửi đến người con gái tuyệt vời nhất của anh
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Heart className="text-pink-500 mx-auto" size={48} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-sm md:text-base text-pink-200 mt-8"
              >

              </motion.p>
            </div>
          )}

          {sections[activeSection] === 'memories' && (
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-pink-300 mb-6 md:mb-8">Những Kỷ Niệm Đẹp</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {memories.map((memory) => (
                  <MemoryImage key={memory.id} src={memory.src} alt={memory.alt} />
                ))}
              </div>
            </div>
          )}

          {sections[activeSection] === 'message' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="bg-pink-800 bg-opacity-70 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl md:text-2xl font-bold text-pink-300 mb-3 md:mb-4">Thông Điệp Yêu Thương</h2>
              <p className="text-sm md:text-base text-pink-100">
                Em yêu, mỗi ngày bên em là một hành trình tuyệt vời trong dải ngân hà tình yêu của chúng ta.
                Cảm ơn em đã luôn ở bên anh, chia sẻ những khoảnh khắc đẹp đẽ và cả những lúc khó khăn.
                Em là ngôi sao sáng nhất trong vũ trụ của anh. Anh yêu em nhiều lắm!
              </p>
            </motion.div>
          )}

          {sections[activeSection] === 'gift' && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-pink-800 bg-opacity-70 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg text-center"
            >
              <h2 className="text-xl md:text-2xl font-bold text-pink-300 mb-3 md:mb-4">Món Quà Đặc Biệt</h2>
              <p className="text-sm md:text-base text-pink-100 mb-4">Nhấn vào nút bên dưới để mở món quà của em</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-pink-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowGift(true)
                }}
              >
                Mở Quà
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              e.stopPropagation()
              setShowGift(false)
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-pink-100 p-4 md:p-6 rounded-lg shadow-xl max-w-xs md:max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl md:text-2xl font-bold text-pink-800 mb-3 md:mb-4">Món Quà Của Em</h3>
              <p className="text-sm md:text-base text-pink-900 mb-3 md:mb-4">
                Đây là [Mô tả món quà]. Anh hy vọng em sẽ thích nó!
              </p>
              <div className="relative w-full aspect-square mb-3 md:mb-4">
                <Image
                  src="/anh1.jpeg"
                  alt="Món quà"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-md"
                />
              </div>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm md:text-base"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowGift(false)
                }}
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-4 right-4 bg-pink-500 text-white p-2 md:p-3 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation()
          toggleMusic()
        }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </motion.button>
    </div>
  )
}