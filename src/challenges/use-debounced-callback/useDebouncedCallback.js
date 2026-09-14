/**
 * Debounce, but the pending call must use the newest of everything
 *
 * Topics: useRef · stable identity · timer cleanup
 * Read:   https://react.dev/learn/separating-events-from-effects
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {Function} fn       a fresh arrow every render, closing over this render's state
 * @param {number} delay
 * @param {{set: Function, clear: Function}} timer  defaults to setTimeout/clearTimeout
 *
 * The timer is handed in so a test can fire it by hand: `timer.set(fn, delay)`
 * returns an id, `timer.clear(id)` cancels it.
 *
 * @returns {Function} the debounced version
 *
 * Rules:
 *  1. calling it schedules one timer for `delay`; `fn` has not run yet
 *  2. calls closer together than `delay` collapse — one timer pending, not four
 *  3. when it fires, `fn` runs once, with the arguments of the LAST call
 *  4. the `fn` that runs is the one from the latest render, not the one that
 *     was current when the call was made
 *  5. the returned function keeps its identity across re-renders
 *  6. unmounting cancels anything pending
 *
 * Rules 4 and 5 are the pair. A debounced function rebuilt every render has no
 * pending call to collapse into — each render's copy owns its own timer, and
 * typing "hello" fires five times. Freeze it with an empty dependency list
 * instead and it will faithfully save the draft as it was five keystrokes ago.
 */
export function useDebouncedCallback(
  fn,
  delay,
  timer = { set: setTimeout, clear: clearTimeout },
) {
  throw new Error('not implemented')
}
