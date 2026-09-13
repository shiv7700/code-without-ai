/**
 * Fires once, cleans up after itself, and always calls the callback you have now
 *
 * Topics: useRef · effect cleanup · the latest-callback ref
 * Read:   https://react.dev/learn/separating-events-from-effects
 * Read:   https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 *
 * @param {Function} callback
 * @param {number|null} delay   `null` means do not schedule anything
 * @param {{set: Function, clear: Function}} timer  defaults to setTimeout/clearTimeout
 *
 * The timer is handed in so a test can fire it by hand: `timer.set(fn, delay)`
 * returns an id and `timer.clear(id)` cancels it.
 *
 * Rules:
 *  1. mounting schedules exactly one timer, with `delay`
 *  2. when it fires, the callback that runs is the one from the LATEST render
 *  3. a new callback on its own does NOT reschedule — the clock keeps running
 *  4. a new `delay` clears the pending timer and schedules a fresh one
 *  5. `delay === null` schedules nothing, and cancels anything already pending
 *  6. unmounting clears the pending timer
 *
 * Rules 2 and 3 are the pair that makes this awkward. Put `callback` in the dep
 * array and rule 3 goes: a parent re-rendering with a new inline arrow restarts
 * the countdown, so a timer whose parent renders often never fires at all.
 * Leave it out and rule 2 goes: it fires the arrow from the first render, still
 * holding the props from back then.
 */
export function useTimeout(
  callback,
  delay,
  timer = { set: setTimeout, clear: clearTimeout },
) {
  throw new Error('not implemented')
}
