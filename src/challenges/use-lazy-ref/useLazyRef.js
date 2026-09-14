/**
 * An expensive initial value, computed exactly once
 *
 * Topics: useRef · lazy initialisation · what runs on every render
 * Read:   https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
 * Read:   https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 *
 * @param {() => *} init  the expensive thing
 * @returns {{current: *}} a ref already holding what `init` returned
 *
 * Rules:
 *  1. `current` is whatever `init()` returned, readable during the first render
 *  2. the same ref object comes back on every render
 *  3. writing to `current` sticks — a later render sees the written value
 *  4. two mounted components each get their own
 *  5. `init` is called exactly ONCE per component, however many times it renders
 *
 * Rule 5 is the one that is quietly broken everywhere. `useRef(init())` reads
 * correctly, because the ref keeps the first value and ignores the rest — and
 * it still runs the expensive thing on every render, then throws the result
 * away. Nothing about the returned value tells you it is happening.
 */
export function useLazyRef(init) {
  throw new Error('not implemented')
}
