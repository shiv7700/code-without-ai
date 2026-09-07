/**
 * LEVEL 67 — the time, ticking
 *
 * Topics: setInterval · lazy initial state · formatting
 * Read:   https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 *
 * Render:
 *   <time data-testid="clock"> holding "HH:MM:SS" in 24-hour time.
 *
 * Rules:
 *  1. The first render already shows the current time — not "00:00:00" that
 *     an effect corrects a moment later.
 *  2. It updates every second.
 *  3. Every part is two digits: 09:05:03, not 9:5:3.
 *  4. Midnight is 00, not 24 and not 12.
 *  5. Unmounting stops the interval.
 *
 * Rule 1 is what `useState(() => new Date())` is for. Passing `new Date()`
 * directly also works here, but builds a Date on every render and throws it
 * away — the lazy form is the habit worth having.
 */
export default function Clock() {
  return null
}
