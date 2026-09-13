/**
 * Change one row, and leave the other rows as the very same objects
 *
 * Topics: array state · map · structural sharing
 * Read:   https://react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array
 * Read:   https://react.dev/learn/updating-objects-in-state#copy-objects-with-the-spread-syntax
 *
 * @param {{id: string, label: string, done: boolean}[]} items  the starting items
 * @param {(items: object[]) => void} onChange
 *
 * Render one checkbox per item, labelled with its label and checked from its
 * `done`.
 *
 * Rules:
 *  1. ticking a box flips that item's `done`, and nobody else's
 *  2. every change calls `onChange` with the whole new array
 *  3. `items` is never modified, nor is any item inside it
 *  4. the item you changed is a NEW object
 *  5. the items you did not change come back as the same objects they went in
 *     as — `next[1] === items[1]`
 *
 * Rule 5 is why `map` and not a deep copy of the lot — a memoised row that gets
 * a brand new object every time re-renders for nothing. Rule 3 is what rules
 * out the other shortcut, editing the object where it lies.
 */
export default function ToggleList({ items = [], onChange }) {
  return null
}
