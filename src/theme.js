import { useSyncExternalStore } from 'react'

const KEY = 'react-practice-theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

const listeners = new Set()

// Read fresh every time rather than caching: index.html already applied the
// class before paint, so the DOM is the one source of truth worth trusting.
export const currentTheme = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

const apply = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  listeners.forEach((fn) => fn())
}

export const setTheme = (theme) => {
  localStorage.setItem(KEY, theme)
  apply(theme)
}

export const toggleTheme = () =>
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark')

// Follow the OS until the choice is made explicitly.
media.addEventListener('change', (e) => {
  if (!localStorage.getItem(KEY)) apply(e.matches ? 'dark' : 'light')
})

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const useTheme = () => useSyncExternalStore(subscribe, currentTheme)
