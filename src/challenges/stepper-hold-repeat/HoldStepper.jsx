/**
 * Hold the button down and the repeat must see the newest value, not the one it was born with
 *
 * Topics: role=spinbutton · stale closures · cleanup on pointerup and unmount
 * Read:   https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 *
 * Props: { value, onChange, min = 0, max = 10, step = 1, schedule,
 *          label = 'Quantity' }
 *
 * `schedule(fn)` books one repeat and hands back a function that cancels it.
 * The test decides when a booked repeat actually runs.
 *
 * Rules:
 *  1. A role="spinbutton" named `label`, showing the value, with
 *     aria-valuemin, aria-valuemax and aria-valuenow. Beside it, buttons named
 *     "Increase" and "Decrease".
 *  2. Pressing a button moves the value one step straight away, and books the
 *     next repeat.
 *  3. Every repeat moves one more step and books another, so holding counts
 *     4, 5, 6, 7 — not 4, 5, 5, 5.
 *  4. Letting go, moving the pointer off the button, or the button losing the
 *     focus all stop it: the booked repeat is cancelled and nothing more is
 *     booked.
 *  5. It stops at the limits. At `max` the Increase button is disabled and
 *     nothing is booked; same for Decrease at `min`.
 *  6. Unmounting while a repeat is booked cancels it.
 *  7. Controlled: a parent that ignores onChange leaves the display alone.
 *
 * Rule 3 is the whole exercise. The function you hand to `schedule` is built
 * once, when the press happens, and it remembers the value that was on screen
 * at that instant — so every repeat computes the same answer from the same
 * stale number. Getting the newest value into a function that was created
 * before that value existed is the trick worth learning here.
 */
export default function HoldStepper({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  schedule,
  label = 'Quantity',
}) {
  return null
}
