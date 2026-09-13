/**
 * Adding to an array in state, without push
 *
 * Topics: array state · immutable update · controlled input
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://react.dev/learn/updating-arrays-in-state#adding-to-an-array
 *
 * @param {string[]} initial  the starting tasks
 *
 * Render a <ul> with one <li> per task, an input labelled "Task" and a button
 * labelled "Add".
 *
 * Rules:
 *  1. the list starts as `initial` and new tasks go on the end
 *  2. adding empties the input, ready for the next one
 *  3. a blank or whitespace-only task is ignored — the list does not grow
 *  4. the same task twice is two rows, not one
 *  5. `initial` is never modified
 *
 * `push` returns a length, not a list, and it edits the array React is already
 * holding. Hand that same array back to the setter and React compares it with
 * itself, finds nothing changed, and skips the render — so the row is in your
 * state and nowhere on screen.
 */
export default function TaskList({ initial = [] }) {
  return null
}
