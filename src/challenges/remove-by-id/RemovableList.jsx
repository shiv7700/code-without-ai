/**
 * Removing by identity, not by position
 *
 * Topics: array state · filter · immutable update
 * Read:   https://react.dev/learn/updating-arrays-in-state#removing-from-an-array
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 *
 * @param {{id: string, label: string}[]} rows  the starting rows
 *
 * Render a <ul> with one <li> per row. Each row shows its label and a button
 * named "Remove <label>".
 *
 * Rules:
 *  1. the list starts as `rows`, in order
 *  2. the button removes its own row and leaves the rest in order
 *  3. it keeps working — remove three in a row and the right three go
 *  4. removing the last row leaves an empty list, not a crash
 *  5. `rows` is never modified
 *
 * `splice` cuts the array in place, and by index. Two removals in and the
 * indexes you looked up no longer describe the array you are cutting.
 */
export default function RemovableList({ rows = [] }) {
  return null
}
