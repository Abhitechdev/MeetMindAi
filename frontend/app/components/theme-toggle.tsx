"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const dotLottieRef = React.useRef<any>(null)
  const prevThemeRef = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === "dark"

  // ponytail: play animation on theme change, skip initial mount to avoid playing on load
  React.useEffect(() => {
    const lottie = dotLottieRef.current
    if (!lottie || !mounted) return

    if (prevThemeRef.current === undefined) {
      prevThemeRef.current = currentTheme
      // The Lottie file has Sun at frame 0 and Moon at the end
      if (isDark) {
        lottie.setFrame(lottie.totalFrames - 1)
      } else {
        lottie.setFrame(0)
      }
      return
    }

    prevThemeRef.current = currentTheme
    // Animate to Moon (forward) if switching to dark, animate to Sun (reverse) if switching to light
    lottie.setMode(isDark ? "forward" : "reverse")
    lottie.play()
  }, [isDark, mounted, currentTheme])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    // ponytail: Lottie's Shadow DOM eats clicks — transparent button overlay on top is the only reliable fix
    <div className="relative w-9 h-9">
      <div className="absolute inset-0 pointer-events-none">
        <DotLottieReact
          dotLottieRefCallback={(ref: any) => { dotLottieRef.current = ref }}
          src="https://lottie.host/e27d486a-4656-499d-8942-d53b79065f69/0SDRtJ8Ldr.lottie"
          autoplay={false}
          loop={false}
        />
      </div>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="absolute inset-0 z-10 rounded-md hover:bg-foreground/5 transition-colors cursor-pointer"
        aria-label="Toggle theme"
      />
    </div>
  )
}

