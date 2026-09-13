/**
 * Still here?
 *
 * Topics: useRef · effect cleanup · unmount
 * Read:   https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
 * Read:   https://react.dev/reference/react/useRef
 *
 * @returns {{current: boolean}} true while mounted, false once it is not
 *
 * Rules:
 *  1. `current` is true from the first render onwards
 *  2. it stays true across re-renders
 *  3. it is the same ref object every render
 *  4. once the component unmounts `current` is false — including when read
 *     from a callback captured while it was still mounted
 *  5. unmounting one component says nothing about another one still up
 *
 * Rule 4 is why this is a ref and not a `useState(true)`. Whatever needs the
 * answer — the `.then` of a request, a subscription handler — was created
 * before the unmount, so it is holding the boolean from back then, and it will
 * cheerfully answer "yes, still here" for as long as it is alive.
 */
export function useMountedRef() {
  throw new Error('not implemented')
}
