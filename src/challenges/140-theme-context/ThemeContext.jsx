/**
 * LEVEL 8 — context, and the provider-boundary guard
 *
 * Topics: createContext · useContext · useMemo
 * Read:   https://react.dev/learn/passing-data-deeply-with-context
 * Read:   https://react.dev/reference/react/useMemo
 *
 * Export two things:
 *
 *   <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
 *   useTheme()  →  { theme, toggle, setTheme }
 *
 * Rules:
 *  1. `theme` starts at `defaultTheme` (default "light")
 *  2. `toggle()` swaps light <-> dark
 *  3. useTheme() called OUTSIDE a provider throws an Error whose message
 *     contains "ThemeProvider". Returning undefined and letting the caller
 *     crash on `theme.something` is the bad version — the error should name
 *     the actual mistake.
 *  4. the context VALUE is memoised. A parent re-render that does not change
 *     the theme must not re-render consumers.
 *     (`value={{ theme, toggle }}` is a new object every render — that is the bug.)
 *
 * Do not export the raw context. Consumers go through useTheme().
 */
export function ThemeProvider({ children, defaultTheme = 'light' }) {
  return children
}

export function useTheme() {
  throw new Error('not implemented')
}
