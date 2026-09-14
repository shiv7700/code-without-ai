/**
 * Removing the middle row must not shuffle everyone's answers up
 *
 * Topics: keys · uncontrolled inputs · list state
 * Read:   https://react.dev/learn/preserving-and-resetting-state
 * Read:   https://react.dev/learn/rendering-lists#why-does-react-need-keys
 *
 * Props: none
 *
 * Rules:
 *  1. Starts with one row. Each row is an <input type="email"> labelled
 *     "Email 1", "Email 2", … by its position, counting from 1.
 *  2. The inputs are uncontrolled — the component keeps no copy of what is
 *     typed, only the list of rows.
 *  3. A button named "Add email" appends a row. Adding must not disturb what
 *     is already typed.
 *  4. Each row has a button named "Remove email 1", "Remove email 2", … which
 *     drops that row. The labels below it renumber.
 *  5. The last remaining row cannot be removed: with one row left, its remove
 *     button is disabled.
 *
 * Rule 2 is what makes this bite. With nothing in state to re-render from, the
 * typed text lives in the DOM node itself, and whether it survives depends
 * entirely on whether React decides that node still belongs to that row. Delete
 * the second of three and watch what the third one is showing.
 */
export default function RepeatableFields() {
  return null
}
