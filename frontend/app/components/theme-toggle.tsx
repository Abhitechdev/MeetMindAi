"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = mounted ? currentTheme === "dark" : true

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-foreground/5 transition-colors cursor-pointer text-muted hover:text-foreground shrink-0"
      aria-label="Toggle theme"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${mounted && !isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${!mounted || isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

