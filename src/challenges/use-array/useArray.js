/**
 * A list in state, and why what comes back is never the array you had
 *
 * Topics: immutable updates · state identity · updater form
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 *
 * @param {Array} initial  default []
 * @returns {{items: Array, push: Function, remove: Function, clear: Function}}
 *
 * Rules:
 *  1. `push(item)` appends, `remove(index)` drops that one, `clear()` empties it
 *  2. each of them produces a NEW array — the one you were holding a moment
 *     ago still says what it said, `initial` included
 *  3. `push`, `remove` and `clear` keep their identity across re-renders
 *  4. `push('a'); push('b');` in one handler lands both, in that order
 *  5. `remove` on an index that is not there leaves the contents alone
 *
 * Rule 2 is not a style preference. Hand React back the array it already has
 * and it compares the two, finds the same object, and skips the render — the
 * data is updated and the screen is not.
 */
export function useArray(initial = []) {
  throw new Error('not implemented')
}
