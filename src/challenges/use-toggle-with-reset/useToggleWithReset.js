/**
 * Reset means back to where it started, not back to whatever is being passed now
 *
 * Topics: useRef · initial value captured once · useCallback
 * Read:   https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * @param {boolean} initial  default false
 * @returns {[boolean, Function, Function]}  [on, toggle, reset]
 *
 * Rules:
 *  1. it starts at `initial` and `toggle()` flips it
 *  2. `reset()` puts it back to the value `initial` had on the FIRST render —
 *     every later `initial` is ignored, the same way `useState(initial)`
 *     already ignores it
 *  3. `toggle` and `reset` keep their identity across re-renders
 *  4. `toggle(); toggle();` in one handler leaves it where it was
 *
 * `initial` is a prop, so it turns up again on every render, and `reset`
 * reading it straight is the mistake. Nothing breaks while the parent keeps
 * passing the same thing — and the day it passes something else, reset quietly
 * starts going somewhere new.
 */
export function useToggleWithReset(initial = false) {
  throw new Error('not implemented')
}
