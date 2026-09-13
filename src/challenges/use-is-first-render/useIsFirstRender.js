/**
 * True exactly once, and then never again
 *
 * Topics: useRef · renders vs effects · per-instance state
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/referencing-values-with-refs
 *
 * @returns {boolean} true on this component's first render, false on every one after
 *
 * Rules:
 *  1. the first render sees `true`
 *  2. every render after it sees `false`
 *  3. mounting causes exactly one render — the hook does not schedule a second
 *  4. each instance gets its own answer, so a component mounted later still
 *     sees `true` on its own first render
 *
 * Rules 3 and 4 are the two ways this goes wrong, and they pull in opposite
 * directions. State flips it a render too late and charges you a render for
 * the privilege; a flag declared outside the hook flips it once for everybody,
 * and the second component to mount has already missed its turn.
 */
export function useIsFirstRender() {
  throw new Error('not implemented')
}
