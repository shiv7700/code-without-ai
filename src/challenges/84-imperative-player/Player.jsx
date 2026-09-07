/**
 * LEVEL 84 — a component the parent can command
 *
 * Topics: useImperativeHandle · ref as a prop · what stays private
 * Read:   https://react.dev/reference/react/useImperativeHandle
 * Read:   https://react.dev/reference/react-dom/components/common#ref-callback
 *
 * Props: { duration, ref }  — in React 19 a function component takes `ref`
 *                             as an ordinary prop, no forwardRef needed
 *
 * Render:
 *   - <span data-testid="time"> reading "2 / 5"
 *   - <span data-testid="state"> reading "playing" or "paused"
 *
 * The ref exposes exactly five things: `play`, `pause`, `seek`, `isPlaying`
 * and `currentTime`. Nothing else — no setState, no internals.
 *
 * Rules:
 *  1. Starts paused at 0.
 *  2. `play()` advances the time by 1 every second. `pause()` stops it where
 *     it is, and `play()` again resumes from there.
 *  3. `seek(t)` jumps, clamped to 0…duration, and does not change whether it
 *     is playing.
 *  4. Reaching `duration` stops it on its own.
 *  5. `isPlaying()` and `currentTime()` report the current values, not the
 *     ones from when the handle was created.
 *  6. Unmounting mid-play leaves no interval behind.
 *
 * Rule 5 is the trap. `useImperativeHandle`'s object is rebuilt only when its
 * dependencies change — a getter closing over a stale `time` returns a stale
 * number. Either depend on it, or read it through a ref.
 */
export default function Player({ duration, ref }) {
  return null
}
