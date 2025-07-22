"use client"

/**
 * Custom hook for sound effects
 * Uses Web Audio API for synthesized sounds
 */
export function useSoundEffects() {
  // Create audio context on demand to avoid issues with browser autoplay policies
  const getAudioContext = () => {
    if (typeof window === "undefined") return null
    try {
      return new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      console.warn("Web Audio API not supported")
      return null
    }
  }

  // Button click sound - short and subtle
  const buttonClick = () => {
    const audioContext = getAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  // Toggle switch sound
  const toggleSwitch = () => {
    const audioContext = getAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.15)
  }

  // Form submit sound
  const formSubmit = () => {
    const audioContext = getAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.2)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  // EXP gain sound
  const expGain = () => {
    const audioContext = getAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1)
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  // Level up sound - more dramatic
  const levelUp = () => {
    const audioContext = getAudioContext()
    if (!audioContext) return

    // First note
    const oscillator1 = audioContext.createOscillator()
    const gainNode1 = audioContext.createGain()

    oscillator1.type = "sine"
    oscillator1.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2)

    gainNode1.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator1.connect(gainNode1)
    gainNode1.connect(audioContext.destination)

    // Second note
    const oscillator2 = audioContext.createOscillator()
    const gainNode2 = audioContext.createGain()

    oscillator2.type = "sine"
    oscillator2.frequency.setValueAtTime(600, audioContext.currentTime + 0.2)
    oscillator2.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.4)

    gainNode2.gain.setValueAtTime(0.1, audioContext.currentTime + 0.2)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator2.connect(gainNode2)
    gainNode2.connect(audioContext.destination)

    // Third note
    const oscillator3 = audioContext.createOscillator()
    const gainNode3 = audioContext.createGain()

    oscillator3.type = "sine"
    oscillator3.frequency.setValueAtTime(900, audioContext.currentTime + 0.4)
    oscillator3.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.6)

    gainNode3.gain.setValueAtTime(0.1, audioContext.currentTime + 0.4)
    gainNode3.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.5)
    gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7)

    oscillator3.connect(gainNode3)
    gainNode3.connect(audioContext.destination)

    oscillator1.start()
    oscillator2.start()
    oscillator3.start()

    oscillator1.stop(audioContext.currentTime + 0.3)
    oscillator2.stop(audioContext.currentTime + 0.5)
    oscillator3.stop(audioContext.currentTime + 0.7)
  }

  return {
    buttonClick,
    toggleSwitch,
    formSubmit,
    expGain,
    levelUp,
  }
}
