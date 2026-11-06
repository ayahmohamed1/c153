'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import type { GiftData } from '@/lib/giftData'

interface Props {
  data: GiftData
}

// عناصر خلفية ناعمة تطير بشكل مستمر وسلس بدون استهلاك للمعالج
const BACKGROUND_HEARTS = [
  { id: 1, left: '6%', size: 26, duration: '6.5s', delay: '0s', sway: '20px', rot: '12deg', emoji: '💙', opacity: 0.75 },
  { id: 2, left: '14%', size: 30, duration: '8s', delay: '2.5s', sway: '-25px', rot: '-15deg', emoji: '🤍', opacity: 0.8 },
  { id: 3, left: '22%', size: 20, duration: '7s', delay: '1s', sway: '15px', rot: '10deg', emoji: '✨', opacity: 0.7 },
  { id: 4, left: '30%', size: 28, duration: '9s', delay: '3.5s', sway: '-30px', rot: '-20deg', emoji: '🧸', opacity: 0.85 },
  { id: 5, left: '38%', size: 24, duration: '6.2s', delay: '0.5s', sway: '25px', rot: '18deg', emoji: '💙', opacity: 0.7 },
  { id: 6, left: '48%', size: 32, duration: '7.8s', delay: '4s', sway: '-15px', rot: '-10deg', emoji: '☕', opacity: 0.75 },
  { id: 7, left: '56%', size: 26, duration: '8.5s', delay: '1.8s', sway: '20px', rot: '14deg', emoji: '🤍', opacity: 0.8 },
  { id: 8, left: '64%', size: 22, duration: '6.8s', delay: '3s', sway: '-20px', rot: '-12deg', emoji: '✨', opacity: 0.7 },
  { id: 9, left: '72%', size: 28, duration: '7.5s', delay: '0.8s', sway: '30px', rot: '20deg', emoji: '💙', opacity: 0.85 },
  { id: 10, left: '80%', size: 24, duration: '8.2s', delay: '2.2s', sway: '-25px', rot: '-16deg', emoji: '💫', opacity: 0.75 },
  { id: 11, left: '88%', size: 30, duration: '7.2s', delay: '4.5s', sway: '15px', rot: '12deg', emoji: '🤍', opacity: 0.8 },
  { id: 12, left: '94%', size: 22, duration: '6.5s', delay: '1.5s', sway: '-18px', rot: '-14deg', emoji: '💙', opacity: 0.7 },
  { id: 13, left: '18%', size: 26, duration: '8.7s', delay: '5s', sway: '22px', rot: '15deg', emoji: '🧸', opacity: 0.75 },
  { id: 14, left: '84%', size: 28, duration: '7.6s', delay: '3.8s', sway: '-22px', rot: '-18deg', emoji: '✨', opacity: 0.7 },
  { id: 15, left: '50%', size: 34, duration: '9.2s', delay: '2s', sway: '18px', rot: '10deg', emoji: '💙', opacity: 0.8 },
]

export default function GiftClient({ data }: Props) {
  const [isPasswordAccepted, setIsPasswordAccepted] = useState(false)
  const [password, setPassword] = useState('')
  const [hasPasswordError, setHasPasswordError] = useState(false)

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== '711') {
      setHasPasswordError(true)
      return
    }

    setIsPasswordAccepted(true)
    setHasPasswordError(false)
  }

  // مشغل الأغنية
  const [isSongPlaying, setIsSongPlaying] = useState(false)
  const [songProgress, setSongProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const songAudioRef = useRef<HTMLAudioElement | null>(null)

  // تفاعلات لمس الشاشة
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number; emoji: string; burstX: number; burstY: number; rot: number; size: number }[]>([])

  // التمرير السلس بين الأقسام
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // دالة تشغيل / إيقاف الأغنية
  const toggleOurSong = () => {
    if (!songAudioRef.current) return
    if (isSongPlaying) {
      songAudioRef.current.pause()
      setIsSongPlaying(false)
    } else {
      songAudioRef.current.play().then(() => {
        setIsSongPlaying(true)
      }).catch((error) => {
        console.error("Error playing the song:", error)
      })
    }
  }

  const handleSongTimeUpdate = () => {
    if (songAudioRef.current) {
      setCurrentTime(songAudioRef.current.currentTime)
      if (songAudioRef.current.duration) {
        setSongProgress((songAudioRef.current.currentTime / songAudioRef.current.duration) * 100)
      }
    }
  }

  const handleSongLoadedMetadata = () => {
    if (songAudioRef.current) {
      setDuration(songAudioRef.current.duration)
    }
  }

  const handleSongSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (songAudioRef.current && songAudioRef.current.duration) {
      const newTime = (Number(e.target.value) / 100) * songAudioRef.current.duration
      songAudioRef.current.currentTime = newTime
      setCurrentTime(newTime)
      setSongProgress(Number(e.target.value))
    }
  }

  const skipForward = () => {
    if (songAudioRef.current) {
      songAudioRef.current.currentTime = Math.min(songAudioRef.current.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    if (songAudioRef.current) {
      songAudioRef.current.currentTime = Math.max(songAudioRef.current.currentTime - 10, 0)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // تفجير قلوب عند لمس الشاشة
  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX = 0
    let clientY = 0
    if ('touches' in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else return
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const emojis = ['💙', '🤍', '✨', '🧸', '💙', '💫']
    const newHearts: typeof clickHearts = []
    const count = 5 + Math.floor(Math.random() * 3)

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
      const distance = 35 + Math.random() * 45
      newHearts.push({
        id: Date.now() + Math.random() + i,
        x: clientX,
        y: clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        burstX: Math.cos(angle) * distance,
        burstY: -Math.abs(Math.sin(angle) * distance) - (25 + Math.random() * 45),
        rot: (Math.random() - 0.5) * 40,
        size: 18 + Math.random() * 12
      })
    }

    setClickHearts(prev => [...prev.slice(-20), ...newHearts])
  }, [])

  useEffect(() => {
    if (clickHearts.length === 0) return
    const timer = setTimeout(() => {
      setClickHearts([])
    }, 1300)
    return () => clearTimeout(timer)
  }, [clickHearts])

  if (!isPasswordAccepted) {
    return (
      <main className="password-gate">
        <div className="password-gate-corners" aria-hidden="true">
          <span className="password-gate-corner top-left" />
          <span className="password-gate-corner top-right" />
          <span className="password-gate-corner bottom-left" />
          <span className="password-gate-corner bottom-right" />
        </div>
        <div className="password-gate-card">
          <div className="password-gate-icon" aria-hidden="true">🔒</div>
          <p className="password-gate-eyebrow">A PRIVATE LITTLE SURPRISE</p>
          <h1 className="password-gate-title">Just for <span>you</span></h1>
          <p className="password-gate-description">Enter the password to open your gift ✨</p>
          <form className="password-gate-form" onSubmit={handlePasswordSubmit}>
            <label htmlFor="gift-password">Password</label>
            <div className="password-digit-input">
              <div className="password-digit-slots" aria-hidden="true">
                {Array.from({ length: 3 }, (_, index) => (
                  <span
                    key={index}
                    className={index < password.length ? 'filled' : ''}
                  />
                ))}
              </div>
              <input
                id="gift-password"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={3}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value.replace(/\D/g, '').slice(0, 3))
                  setHasPasswordError(false)
                }}
                aria-label={`Password, ${password.length} of 3 digits entered`}
                aria-invalid={hasPasswordError}
                aria-describedby={hasPasswordError ? 'gift-password-error' : undefined}
                autoFocus
              />
            </div>
            {hasPasswordError && (
              <p id="gift-password-error" className="password-gate-error" role="alert">
                That password isn&apos;t quite right. Try again 💙
              </p>
            )}
            <button className="btn-primary" type="submit">Unlock your surprise 💙</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <div className="gift-page" onClick={handlePageClick}>
      <div className="gift-content-body">
        {/* إطار الشاشة الفخم */}
        <div className="corners-overlay">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>
        </div>
        <div className="side-text left">ANNIVERSARY • CELEBRATION</div>
        <div className="side-text right">WITH LOVE • FOR YOU</div>

        {/* عناصر خلفية مستمرة بدون تهنيج */}
        <div className="letter-hearts-container" aria-hidden="true">
          {BACKGROUND_HEARTS.map((h) => (
            <span
              key={h.id}
              className="floating-heart"
              style={{
                left: h.left,
                fontSize: `${h.size}px`,
                ['--duration' as any]: h.duration,
                ['--delay' as any]: h.delay,
                ['--sway-x' as any]: h.sway,
                ['--rot' as any]: h.rot,
                ['--max-opacity' as any]: h.opacity,
              }}
            >
              {h.emoji}
            </span>
          ))}
        </div>

        {/* قلوب النقر التفاعلية */}
        {clickHearts.map((ch) => (
          <span
            key={ch.id}
            className="click-heart-burst"
            style={{
              left: `${ch.x}px`,
              top: `${ch.y}px`,
              fontSize: `${ch.size}px`,
              ['--burst-x' as any]: `${ch.burstX}px`,
              ['--burst-y' as any]: `${ch.burstY}px`,
              ['--burst-rot' as any]: `${ch.rot}deg`,
            }}
          >
            {ch.emoji}
          </span>
        ))}

        {/* شريط تنقل سريع عائم أسفل الشاشة */}
        <nav className="floating-navbar" aria-label="Quick jump">
          <button onClick={() => scrollTo('intro')} title="Home">✨</button>
          <button onClick={() => scrollTo('letter')} title="Message">💌</button>
          <button onClick={() => scrollTo('song')} title="Our Song">🎵</button>
        </nav>

        {/* أعلام الزينة أعلى الصفحة */}
        <BuntingSVG />

        {/* ── 1. SECTION: HERO / INTRO ── */}
        <section id="intro" className="gift-section" style={{ minHeight: '92vh', paddingTop: '80px' }}>
          <div className="content-wrapper">
            <p className="subtitle">✦ Something special is waiting ✦</p>
            <h1 className="gift-title">A Gift <br /><span>just for You</span></h1>
            <div className="crown-icon">👑</div>
            <div className="dots">• • •</div>
            <p className="description">
              "Today is a day as beautiful as you are. I've prepared a little digital surprise to celebrate your special moment."
            </p>
            <button className="btn-primary" onClick={() => scrollTo('envelope')}>
              Open your letter 💌
            </button>
            <div
              onClick={() => scrollTo('envelope')}
              style={{
                marginTop: '35px',
                color: '#5aa9ff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Scroll to your letter</span>
              <span style={{ fontSize: '1.3rem' }}>↓</span>
            </div>
          </div>
        </section>

        <div style={{ width: '100%', animation: 'fadeIn 0.8s ease-in-out' }}>
            <div className="section-divider">✦ • 💌 • ✦</div>

            {/* ── 2. SECTION: THE ANNIVERSARY LETTER ENVELOPE ── */}
            <section id="envelope" className="gift-section">
              <div className="content-wrapper">
                <p className="subtitle">✦ A little something, just for you ✦</p>
                <h2 className="gift-title">Happy <span>Anniversary</span> 💙</h2>
                <p className="description">A little love note is waiting inside.</p>
                <button
                  type="button"
                  className="envelope-button"
                  onClick={() => scrollTo('letter')}
                  aria-label="Click here to read a letter"
                >
                  <Image
                    src="/images/anniversary-envelope.png"
                    alt="A navy blue envelope sealed with a blue wax seal"
                    width={1200}
                    height={675}
                    priority
                    unoptimized
                  />
                </button>
                <p className="envelope-hint">Click here to read a letter</p>
              </div>
            </section>

            <div className="section-divider">✦ • 💌 • ✦</div>

            {/* ── 3. SECTION: THE LETTER (THE MESSAGE) ── */}
            <section id="letter" className="gift-section">
              <div className="content-wrapper">
                <div className="letter-card">
                  <div className="top-accent-sq"></div>

                  <h2 className="letter-title" style={{ marginTop: '0', color: '#fff4f8' }}>Happy Anniversary, my love 💙</h2>

                  <div className="letter-scroll-area">
                    <div className="letter-body" style={{ color: '#fff4f8' }}>{data.message}</div>
                    <div className="letter-divider"><span>✦</span></div>
                    <div className="signature" style={{ color: '#5aa9ff' }}>
                      <p>With all my love,</p>
                      <p>{data.senderName || 'your love'} ✨</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="section-divider">✦ • 🎵 • ✦</div>

            {/* ── 4. SECTION: OUR SONG ── */}
            <section id="song" className="gift-section">
              <div className="content-wrapper">
                <div className="player-container">
                  <div className={`vinyl-record-container ${isSongPlaying ? 'vinyl-spin' : 'vinyl-paused'}`}>
                    <VinylSVG />
                  </div>

                  <div className="music-player-card">
                    <div className="player-cover">
                      <Image src="/images/pic5.jpg" alt="Our Song Cover" fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>

                    <div className="player-info">
                      <div className="player-title">Our Song</div>
                      <div className="player-artist">every word for you</div>
                    </div>

                    <div className="timeline-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={songProgress || 0}
                        onChange={handleSongSeek}
                        className="ios-slider"
                      />
                      <div className="time-labels">
                        <span>{formatTime(currentTime)}</span>
                        <span>-{formatTime(duration - currentTime)}</span>
                      </div>
                    </div>

                    <div className="player-controls">
                      <button className="control-btn" onClick={skipBackward}><BackwardIcon /></button>
                      <button className="control-btn play-pause-circle" onClick={toggleOurSong}>
                        {isSongPlaying ? <PauseIcon /> : <PlayIcon />}
                      </button>
                      <button className="control-btn" onClick={skipForward}><ForwardIcon /></button>
                    </div>

                    <div className="volume-container">
                      <VolumeMinIcon />
                      <input type="range" className="ios-slider" style={{ marginBottom: 0 }} defaultValue="80" />
                      <VolumeMaxIcon />
                    </div>
                  </div>
                </div>

                <audio
                  ref={songAudioRef}
                  src="/audio/song.mp3"
                  preload="auto"
                  onTimeUpdate={handleSongTimeUpdate}
                  onLoadedMetadata={handleSongLoadedMetadata}
                  onEnded={() => setIsSongPlaying(false)}
                />
              </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ textAlign: 'center', padding: '40px 15px 110px 15px', position: 'relative', zIndex: 20 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>👑</div>
              <p style={{ color: '#fff4f8', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 600 }}>
                Made with all my love for you, {data.name || 'habibty'} ❤️
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9cbce0', marginTop: '6px', letterSpacing: '0.15em' }}>
                FOREVER & ALWAYS
              </p>
              <button
                onClick={() => scrollTo('intro')}
                className="btn-secondary"
                style={{ marginTop: '22px', padding: '0.5rem 1.8rem', fontSize: '0.85rem' }}
              >
                ↑ Back to Top
              </button>
            </footer>
          </div>
      </div>

    </div>
  )
}

// =============================================
// HELPER COMPONENTS & PURE SVGS
// =============================================

function Sparkles() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <span key={i} style={{
          position: 'absolute', width: '3px', height: '3px', background: '#5aa9ff', borderRadius: '50%',
          top: `${10 + (i * 12) % 80}%`, left: `${5 + (i * 13) % 90}%`,
          boxShadow: '0 0 10px #5aa9ff', opacity: 0.6
        }} />
      ))}
    </div>
  )
}

function BuntingSVG() {
  return (
    <svg width="100%" height="80" viewBox="0 0 800 80" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 30, opacity: 0.85, pointerEvents: 'none' }}>
      <line x1="0" y1="20" x2="800" y2="20" stroke="#5aa9ff" strokeWidth="2" />
      {[...Array(10)].map((_, i) => (
        <polygon key={i} points={`${30 + i * 80},20 ${60 + i * 80},20 ${45 + i * 80},60`} fill={i % 2 === 0 ? "#1473e6" : "#3f85cf"} />
      ))}
    </svg>
  )
}

function VinylSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="100" cy="100" r="100" fill="#080608" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#24111b" strokeWidth="2" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="#24111b" strokeWidth="2" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="#24111b" strokeWidth="2" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="#24111b" strokeWidth="2" />
      <circle cx="100" cy="100" r="35" fill="#102b4d" />
      <circle cx="100" cy="100" r="30" fill="#287de0" />
      <circle cx="100" cy="100" r="5" fill="#ffb6d6" />
    </svg>
  )
}

function PlayIcon() { return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> }
function PauseIcon() { return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> }
function ForwardIcon() { return <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" /></svg> }
function BackwardIcon() { return <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6 z" /></svg> }
function VolumeMinIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z" /></svg> }
function VolumeMaxIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg> }