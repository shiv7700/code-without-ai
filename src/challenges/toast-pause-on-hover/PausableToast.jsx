/**
 * Pause the countdown, and what is left of it is the only thing worth keeping
 *
 * Topics: refs for values that do not render · cleanup · injected clock
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/
 *
 * Props: { message, onDismiss, duration = 5000, now, schedule }
 *
 * `now()` gives the time in milliseconds and `schedule(fn, ms)` books the
 * dismissal, handing back a function that cancels it. The test decides when a
 * booking runs, so nothing here waits on a real clock.
 *
 * Rules:
 *  1. A role="status" holding `message`, and a button named "Dismiss" that
 *     calls onDismiss.
 *  2. On mount it books its own dismissal, `duration` milliseconds away.
 *  3. When that booking runs, onDismiss is called.
 *  4. Pointing at the toast, or moving focus into it, cancels the booking. A
 *     toast being read is not counting down.
 *  5. Moving away again books what is left, not the whole thing over. Paused
 *     after two seconds of five, the new booking is for three.
 *  6. Pausing and resuming repeatedly keeps taking the time off. Three pauses
 *     of a second each leave two seconds.
 *  7. Unmounting cancels whatever is booked.
 *
 * Rule 5 is the one everybody ships broken. Nothing in this component knows
 * how long it has been on screen unless it asks the clock when the pause
 * starts and does the subtraction itself — so the easy version books five
 * seconds again on the way out, and a toast the user glances at twice never
 * leaves the corner of the screen.
 */
export default function PausableToast({
  message,
  onDismiss,
  duration = 5000,
  now,
  schedule,
}) {
  return null
}
