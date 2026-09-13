/**
 * A boolean and the three things anyone ever does to it
 *
 * Topics: useMemo · stable identity · dep arrays
 * Read:   https://react.dev/reference/react/useMemo
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 *
 * @param {boolean} initial  default false
 * @returns {[boolean, {on: Function, off: Function, toggle: Function}]}
 *
 * Rules:
 *  1. `on()` sets it true, `off()` sets it false, `toggle()` flips it
 *  2. the three functions keep their identity across re-renders
 *  3. so does the OBJECT holding them — `actions` is what goes into a dep
 *     array, and a fresh object every render defeats the whole point
 *  4. `toggle(); toggle();` in one handler leaves it where it was
 *
 * Rule 3 is the one that gets missed. Three `useCallback`s and then a plain
 * `{ on, off, toggle }` on the way out looks stable and is not: the functions
 * inside it are the same, the wrapper around them is new every single render.
 */
export function useBoolean(initial = false) {
  throw new Error('not implemented')
}
