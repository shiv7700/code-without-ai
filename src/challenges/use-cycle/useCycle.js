/**
 * Step through a list and come back round
 *
 * Topics: useRef · stale closures · updater form
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * @param {Array} values  at least one
 * @returns {[*, Function, Function]}  [current, next, reset]
 *
 * Rules:
 *  1. it starts on `values[0]`
 *  2. `next()` moves one along, and wraps from the last back to the first
 *  3. `reset()` goes back to the first
 *  4. `next` and `reset` keep their identity across re-renders
 *  5. `next()` twice in one handler moves two along
 *  6. `values` is nearly always written inline, so it is a new array on every
 *     render — that must not move the position, and `next` must wrap around
 *     the list as it is NOW
 *
 * Rules 4 and 6 are the squeeze. Put `values` in the dep array and the stable
 * identity is gone; leave it out and `next` is still wrapping around the list
 * it was handed on the first render, which is the same length right up until
 * the day it is not.
 */
export function useCycle(values) {
  throw new Error('not implemented')
}
