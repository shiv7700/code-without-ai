/**
 * Putting something in the middle without cutting the array open
 *
 * Topics: array state · slice · immutable insert
 * Read:   https://react.dev/learn/updating-arrays-in-state#inserting-into-an-array
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 *
 * @param {string[]} initial  the starting items
 *
 * Render a <ul> with one <li> per item, an input labelled "New item", and on
 * every row a button named "Insert after <item>".
 *
 * Rules:
 *  1. the new item goes directly after the row whose button was pressed
 *  2. inserting empties the input
 *  3. inserting after the last row puts it on the end
 *  4. a blank or whitespace-only input inserts nothing
 *  5. it keeps working — insert twice and both land where they were asked to
 *  6. `initial` is never modified
 *
 * `splice` is the method everyone reaches for, and it is the one that edits the
 * array in place and hands you back the bit it cut out. Two slices and a spread
 * say the same thing without touching what you were given.
 */
export default function InsertList({ initial = [] }) {
  return null
}
