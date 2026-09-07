/**
 * LEVEL 57 — start, stop, resume
 *
 * Topics: useEffect · setInterval · an effect that depends on a flag
 * Read:   https://react.dev/reference/react/useEffect#parameters
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 *
 * Render:
 *   - <span data-testid="elapsed"> holding seconds to one decimal: "0.0"
 *   - a button reading "Start", which reads "Stop" while it is running
 *   - a button reading "Reset"
 *
 * Rules:
 *  1. Starts at "0.0" and stays there until Start is pressed.
 *  2. While running, the elapsed time advances every 100ms.
 *  3. Stop freezes the display. Start again RESUMES — 1.0s then 0.5s more
 *     reads "1.5", not "0.5".
 *  4. Reset sets it back to "0.0" and stops it.
 *  5. Unmounting while running must not leave an interval behind.
 *
 * Rule 3 is what tells you where the state boundary is: the elapsed time and
 * "is it running" are two separate pieces of state, and only one of them is
 * cleared by Reset.
 *
 * An effect that returns early when not running is not a broken effect — the
 * dependency array is what starts and stops the interval.
 */
export default function Stopwatch() {
  return null
}
