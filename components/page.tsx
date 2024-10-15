"use client"

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Pause, Play, Gift } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Head from 'next/head'

// Mảng chứa các kỷ niệm (hình ảnh) sẽ hiển thị
const memories = [
  { id: 1, src: "/anh1.jpeg", alt: "Kỷ niệm 1" },
  { id: 2, src: "/anh2.jpg", alt: "Kỷ niệm 2" },
  { id: 3, src: "/anh3.jpg", alt: "Kỷ niệm 3" },
  { id: 4, src: "/anh4.jpg", alt: "Kỷ niệm 4" },
  { id: 5, src: "/anh5.png", alt: "Kỷ niệm 5" },
  { id: 6, src: "/anh6.png", alt: "Kỷ niệm 6" },
]

// Mảng chứa các section khác nhau của trang web
const sections = ['home', 'memories', 'message', 'gift']

// Component nền sao lấp lánh
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

// Component hiển thị hình ảnh kỷ niệm
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

// Component chính của trang
export function Page() {
  const [activeSection, setActiveSection] = useState(0) // Quản lý section hiện tại
  const [isPlaying, setIsPlaying] = useState(false) // Trạng thái âm nhạc
  const [showGift, setShowGift] = useState(false) // Trạng thái hiển thị quà
  const [isGiftOpened, setIsGiftOpened] = useState(false) // Trạng thái quà đã mở
  const [isAudioLoaded, setIsAudioLoaded] = useState(false) // Trạng thái âm thanh đã tải
  const audioRef = useRef<HTMLAudioElement | null>(null) // Tham chiếu đến phần tử audio

  // Tạo audio và quản lý sự kiện tải âm thanh
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

  // Hàm phát nhạc
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

  // Tự động phát nhạc khi người dùng tương tác
  // Tự động phát nhạc khi người dùng tương tác
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isPlaying && isAudioLoaded) {
        playAudio()
      }
      // Xóa bỏ sự kiện sau khi người dùng tương tác
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction) // Thêm sự kiện cho di động
    }

    // Thêm sự kiện lắng nghe click và touchstart
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction) // Thêm sự kiện cho di động

    return () => {
      // Xóa sự kiện khi unmount
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction) // Xóa bỏ sự kiện trên di động
    }
  }, [isPlaying, isAudioLoaded, playAudio])

  // Chuyển đổi trạng thái âm nhạc (phát/tạm dừng)
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

  // Chuyển đổi giữa các section
  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    setActiveSection(prevSection => {
      if (direction === 'next') {
        return (prevSection + 1) % sections.length
      } else {
        return (prevSection - 1 + sections.length) % sections.length
      }
    })
  }, [])

  // Xử lý phím mũi tên để chuyển section
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

  // Xử lý nhấp chuột trái và phải để chuyển section
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Nhấp chuột trái
      handleNavigation('next')
    }
  }, [handleNavigation])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleNavigation('prev') // Nhấp chuột phải
  }, [handleNavigation])

  // Các hiệu ứng của món quà
  const giftVariants = {
    closed: {
      scale: 1,
      rotateY: 0,
    },
    opening: {
      scale: [1, 1.1, 1],
      rotateY: 720,
      transition: {
        duration: 1.5,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    },
    opened: {
      scale: 1,
      rotateY: 720,
    },
  }

  // Hiệu ứng hiển thị nội dung quà
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <><Head>
      <title>My Website</title>
      <link rel="icon" href="/favicon.png" />
    </Head>
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
            {/* Section hiển thị lời chúc */}
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
                  Gửi em Bống iu dấu cụa anh!
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

            {/* Section hiển thị hình ảnh kỷ niệm */}
            {sections[activeSection] === 'memories' && (
              <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-pink-300 mb-6 md:mb-8">Ảnh của em nèe :3</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {memories.map((memory) => (
                    <MemoryImage key={memory.id} src={memory.src} alt={memory.alt} />
                  ))}
                </div>
              </div>
            )}

            {/* Section hiển thị thông điệp yêu thương */}
            {sections[activeSection] === 'message' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-pink-800 bg-opacity-70 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-xl md:text-2xl font-bold text-pink-300 mb-3 md:mb-4">Đôi lời iu thương</h2>
                <p className="text-sm md:text-base text-pink-100">
                  Anh chúc em Bống iu dấu của anh ngày càng xinh đẹp, luôn luôn bên cạnh anh để anh có thể yêu thương và che chở cho em nhìu hơn nữaa!
                  Chúc cho người con gái anh iu có một ngày lễ hạnh phúc và có thật nhìu niềm vui🥰🥰🥰
                  Và đặc biệt, anh chúc mừng em vì 20/10 này đã có được anh🤭🤭🤭
                </p>
              </motion.div>
            )}

            {/* Section hiển thị món quà đặc biệt */}
            {sections[activeSection] === 'gift' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-pink-800 bg-opacity-70 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg text-center"
              >
                <h2 className="text-xl md:text-2xl font-bold text-pink-300 mb-3 md:mb-4">Món Quà Đặc Biệt</h2>
                <p className="text-sm md:text-base text-pink-100 mb-4">Nhấn vào nút bên dưới để mở(lưu ý: quà này là phiên bản giới hạn, cần phải sử dụng cẩn thận!!!)</p>
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

        {/* Hiệu ứng hiển thị món quà khi nhấn vào */}
        <AnimatePresence>
          {showGift && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                e.stopPropagation()
                if (isGiftOpened) {
                  setShowGift(false)
                  setIsGiftOpened(false)
                }
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="bg-pink-100 p-4 md:p-6 rounded-lg shadow-xl max-w-xs md:max-w-md text-center relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait">
                  {!isGiftOpened ? (
                    <motion.div
                      key="gift-box"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => setIsGiftOpened(true)}
                      variants={giftVariants}
                      initial="closed"
                      animate="opening"
                      exit="opened"
                    >
                      <motion.div
                        className="w-40 h-40 bg-pink-500 rounded-lg relative"
                        animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.div
                          className="absolute inset-x-0 top-0 h-1/2 bg-pink-600 rounded-t-lg"
                          initial={{ scaleY: 1, originY: "bottom" }}
                          animate={{ scaleY: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                        />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 }}
                        >
                          <Gift size={64} className="text-white" />
                        </motion.div>
                      </motion.div>
                      <motion.p
                        className="mt-4 text-pink-800 font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        Nhấn để mở quà!
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gift-content"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-pink-800 mb-3 md:mb-4">Món Quà Của Em</h3>
                      <p className="text-sm md:text-base text-pink-900 mb-3 md:mb-4">
                        tadaaaa, đây là món quà dành cho em Bống iu dấu của anh🥰🥰🥰. Hi vọng là em sẽ thích nó :)))
                      </p>
                      <motion.div
                        className="relative w-full aspect-square mb-3 md:mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <Image
                          src="/qua.jpg"
                          alt="Món quà"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg shadow-md"
                        />
                      </motion.div>
                      <motion.button
                        className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm md:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowGift(false)
                          setIsGiftOpened(false)
                        }}
                      >
                        Đóng
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nút điều khiển phát/tạm dừng âm nhạc */}
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
    </>
  )
}
