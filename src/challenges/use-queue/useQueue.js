/**
 * A first-in first-out queue whose functions never change
 *
 * Topics: updater form · useCallback · stable identity
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {Array} initial  defaults to []
 * @returns {{queue, first, last, size, add, remove, clear}}
 *
 * Rules:
 *  1. `queue` starts as `initial`; `first`, `last` and `size` describe it
 *  2. `add(item)` puts it on the end, `remove()` takes one off the front
 *  3. `remove()` on an empty queue changes nothing
 *  4. `clear()` empties it
 *  5. two `add` calls in the same handler both land — the queue ends up two
 *     longer, not one
 *  6. `add`, `remove` and `clear` are the same functions on every render
 *
 * Rule 5 is what the updater form is for. `setQueue([...queue, item])` reads
 * the `queue` belonging to the render the handler was created in, so the second
 * call builds on the same array the first one did and quietly wins. Rule 6 then
 * takes away the escape route of reading fresh state, because a function that
 * never changes can only ever see the render it was born in.
 */
export function useQueue(initial = []) {
  throw new Error('not implemented')
}
