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

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-1 rounded-md hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors overflow-hidden flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <div className="w-6 h-6">
        <DotLottieReact 
          src="https://lottie.host/fd09de18-4e5a-43d2-aa7d-157383b3dd5f/MVV0TnD2FA.lottie" 
          autoplay 
          loop 
        />
      </div>
    </motion.button>
  )
}
