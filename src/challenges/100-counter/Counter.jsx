/**
 * LEVEL 1 — useState + event handlers
 *
 * Topics: useState · updater form · event handlers
 * Read:   https://react.dev/reference/react/useState
 * Read:   https://react.dev/learn/queueing-a-series-of-state-updates
 *
 * Render a counter:
 *   - the current count, inside an element with data-testid="count"
 *   - a button labelled "+"     → count + 1
 *   - a button labelled "-"     → count - 1
 *   - a button labelled "Reset" → back to `start`
 *
 * Rules:
 *  1. count starts at the `start` prop (default 0)
 *  2. count must never go below 0 — "-" at 0 does nothing
 *  3. "Reset" goes back to `start`, not to 0
 */
export default function Counter({ start = 0 }) {
  return null
}
