"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-1 rounded-md hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors overflow-hidden flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {/* ponytail: pointer-events-none prevents the canvas from stealing clicks from the button */}
      <div className="w-7 h-7 pointer-events-none">
        <DotLottieReact
          src="https://lottie.host/e27d486a-4656-499d-8942-d53b79065f69/0SDRtJ8Ldr.lottie"
          autoplay
          loop
        />
      </div>
    </motion.button>
  )
}


