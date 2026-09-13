/**
 * A ref that is always holding the newest value
 *
 * Topics: useRef · stale closures · reading the latest from a callback
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * @param {*} value
 * @returns {{current: *}} a ref whose `current` is the most recent `value`
 *
 * Rules:
 *  1. `current` is the value the hook was just handed
 *  2. after a re-render with a new value, `current` is the new one
 *  3. it is the SAME ref object on every render
 *  4. it never causes a render of its own
 *
 * This is the tool the other traps in this section are built out of, and rule 3
 * is the entire reason it works. Returning a fresh `{ current: value }` each
 * render reads correctly from everywhere except the one place it was needed:
 * a callback that was created once and is still holding the first object.
 */
export function useLatest(value) {
  throw new Error('not implemented')
}
