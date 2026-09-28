import { useState, useLayoutEffect } from 'react'
import { flushSync } from 'react-dom'

// Shared light/dark theme state, backed by localStorage + the
// html[data-theme] attribute. Used by every top-level route (App, Shop, ...)
// so the toggle set on one page is reflected everywhere else, instead of
// each page owning its own disconnected copy of the theme.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('combo-breaker-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useLayoutEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('combo-breaker-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(() => flushSync(() => setTheme(next)))
    } else {
      setTheme(next)
    }
  }

  return [theme, toggleTheme]
}
