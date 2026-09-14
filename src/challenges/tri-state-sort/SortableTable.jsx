/**
 * Sorting a list you were handed is not the same as sorting your own
 *
 * Topics: aria-sort · sorting without mutating · derived state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/table/
 *
 * Props: { columns: [{ key, label }], rows }
 *
 * Rules:
 *  1. A <table> with one <th> per column, each holding a button named after
 *     the column. The body has one row per entry, in whatever order applies.
 *  2. Pressing a column's button cycles it: ascending, then descending, then
 *     back to no sorting at all.
 *  3. Unsorted means the order the rows arrived in — not reversed, not
 *     "whatever was left".
 *  4. Exactly one <th> ever carries aria-sort, and it says "ascending" or
 *     "descending". Sorting a different column moves it and starts that one
 *     from ascending.
 *  5. Rows that compare equal keep the order they were in.
 *  6. The `rows` array belongs to the parent. It comes back from this
 *     component exactly as it went in.
 *
 * Rules 3 and 6 are one bug wearing two hats. The usual way to sort an array
 * rearranges it where it lies, and the array you were handed is the parent's —
 * so the original order you need to get back to has already been destroyed, by
 * you, on the first click.
 */
export default function SortableTable({ columns = [], rows = [] }) {
  return null
}
