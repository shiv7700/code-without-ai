/**
 * LEVEL 31 — subscribing to something outside React
 *
 * Topics: external stores · effect subscribe/unsubscribe · matchMedia
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * @param {string} query  e.g. "(min-width: 768px)"
 * @returns {boolean} whether it currently matches
 *
 * Rules:
 *  1. The first render already reports the right answer — no false-then-true
 *     flash on mount.
 *  2. When the match changes, the component re-renders with the new value.
 *  3. Changing the `query` prop resubscribes: the old listener is removed and
 *     a new MediaQueryList is used.
 *  4. Unmounting removes the listener. Nothing left attached.
 *
 * Rule 1 rules out "start at false, fix it in an effect". Read the initial
 * value where state is created.
 */
export function useMediaQuery(query) {
  throw new Error('not implemented')
}
