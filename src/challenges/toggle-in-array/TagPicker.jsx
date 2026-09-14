/**
 * Present means remove, absent means add
 *
 * Topics: array state · toggling · copy before you write
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 *
 * @param {{id: string, label: string}[]} tags
 * @param {string[]} initial  the ids selected to start with
 * @param {(selected: string[]) => void} onChange
 *
 * Render one <button> per tag, named with its label and carrying aria-pressed.
 * Below them a <ul> with one <li> per selected id, showing that tag's label.
 *
 * Rules:
 *  1. clicking an unselected tag appends its id to the END of the selection
 *  2. clicking a selected tag removes it, and the rest keep their order
 *  3. removing one and clicking it again puts it back at the end, not where it
 *     used to be
 *  4. every change calls `onChange` with the new array
 *  5. `initial` is never modified
 *
 * `splice` is the trap and it fails twice over: it edits the array already sat
 * in state — the very one `initial` handed you — and it evaluates to what it
 * removed, so that is what the updater puts back. Either way React is given the
 * same array it already had, and declines to render.
 */
export default function TagPicker({ tags = [], initial = [], onChange }) {
  return null
}
