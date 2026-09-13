/**
 * The value from the render before this one
 *
 * Topics: useRef · useEffect · render vs commit
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/referencing-values-with-refs#differences-between-refs-and-state
 *
 * @param {*} value
 * @returns {*} what `value` was on the previous render, `undefined` on the first
 *
 * Rules:
 *  1. the first render gives back `undefined`
 *  2. after that it gives back the value the PREVIOUS render was handed
 *  3. a re-render with an unchanged value is still a render — the previous
 *     value becomes that same value
 *  4. it never causes a render of its own
 *
 * Where the ref is written decides the whole thing. Write it and read it in
 * that order while rendering and you have handed back the value you were just
 * given, which is right every time you check it by eye and never right.
 */
export function usePrevious(value) {
  throw new Error('not implemented')
}
