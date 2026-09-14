/**
 * One instance per component, built once and never again
 *
 * Topics: useRef · sentinels · useMemo is a hint, not a promise
 * Read:   https://react.dev/reference/react/useMemo#caveats
 * Read:   https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
 *
 * @param {() => *} factory  builds the thing — an emitter, a Map, an id
 * @returns {*} the same value for as long as the component is mounted
 *
 * Rules:
 *  1. returns what `factory()` returned, usable during the first render
 *  2. every later render returns the identical value — `toBe`, not `toEqual`
 *  3. mutating it works: the next render sees the mutation
 *  4. two mounted components each get their own
 *  5. a factory that returns `null` is still called exactly once
 *
 * `useMemo(factory, [])` reads as "build it once", and React reserves the right
 * to throw a memo away and recompute it — fine for a cached number, not for the
 * one WebSocket everything is holding. So people reach for a ref and write
 * `if (!ref.current) ref.current = factory()`, which is rule 5: there is no
 * value the factory can return that means "not built yet", except one you
 * invent yourself.
 */
export function useConstant(factory) {
  throw new Error('not implemented')
}
