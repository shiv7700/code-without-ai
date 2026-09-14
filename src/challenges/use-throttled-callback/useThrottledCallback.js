/**
 * Same tools as debounce, opposite manners
 *
 * Topics: useRef · leading and trailing edges · stable identity
 * Read:   https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {Function} fn
 * @param {number} delay  the length of the quiet window after a call
 * @param {{set: Function, clear: Function}} timer  defaults to setTimeout/clearTimeout
 * @returns {Function} the throttled version
 *
 * Rules:
 *  1. the first call runs `fn` immediately — a throttled scroll handler that
 *     waits is a throttled scroll handler nobody notices
 *  2. calls made inside the window do not run `fn`; they are remembered
 *  3. when the window closes, `fn` runs once more with the arguments of the
 *     LAST call made during it
 *  4. a window that closes with nothing waiting runs nothing — one call means
 *     exactly one invocation, not two
 *  5. `fn` is always the version from the latest render, and the returned
 *     function keeps its identity across re-renders
 *  6. unmounting cancels a waiting trailing call
 *
 * Rule 4 is the one that separates a throttle from a thing that fires twice for
 * every click. Rules 2 and 3 together say the remembered arguments have to live
 * somewhere that survives a render without causing one, and rule 5 says the
 * same of the pending timer — state for either of them and the identity goes,
 * taking the window with it.
 */
export function useThrottledCallback(
  fn,
  delay,
  timer = { set: setTimeout, clear: clearTimeout },
) {
  throw new Error('not implemented')
}
