/**
 * LEVEL 28 — a timer you can pause, and an effect that must not restart
 *
 * Topics: setInterval · effect dependencies · cleanup
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * Props: { from = 10, onDone }
 *
 * Render the remaining seconds in an element with data-testid="left", plus
 * "Start", "Pause" and "Reset" buttons.
 *
 * Rules:
 *  1. Starts at `from`, and does not tick until Start is pressed.
 *  2. Once started it counts down one per second.
 *  3. Pause stops it where it is; Start resumes from there.
 *  4. Reset puts it back to `from` and stops it.
 *  5. At zero it stops on its own and calls onDone — exactly once, never below
 *     zero, and never again while it sits at zero.
 *  6. Unmounting clears the interval.
 *
 * One interval, not one per tick. If your effect depends on the seconds left
 * it will tear down and rebuild every second — works, but it is the wrong
 * shape. Depend on whether it is running, and use the updater form inside.
 */
export default function Countdown({ from = 10, onDone }) {
  return null
}
