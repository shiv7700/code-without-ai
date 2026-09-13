/**
 * LEVEL 16 — two derived states composing, and a mutation bug
 *
 * Topics: useMemo · derived state · immutability
 * Read:   https://react.dev/reference/react/useMemo
 * Read:   https://react.dev/learn/updating-arrays-in-state
 *
 * Props: { rows: [{ id, name, age }] }
 *
 * Render:
 *   - an input labelled "Search"
 *   - a <table>. Header cells for "Name" and "Age", each containing a <button>
 *     with that label.
 *   - one <tr data-testid="row"> per visible row, cells in order: name, age
 *   - a count in data-testid="count", formatted "3 of 8"
 *
 * Rules:
 *  1. search filters by name, case-insensitive substring
 *  2. clicking a column header sorts by it ascending; clicking the SAME header
 *     again flips to descending
 *  3. clicking a DIFFERENT header starts that column at ascending again
 *  4. the sorted <th> carries aria-sort="ascending" | "descending";
 *     the other one carries aria-sort="none"
 *  5. with no sort chosen, rows stay in the order they arrived.
 *     Name sorts case-insensitively ("alice" comes before "Bob") — plain `<`
 *     compares character codes and puts every capital letter first, which is
 *     not what a user expects. Age sorts as a number, not as text.
 *  6. search and sort compose — filter first, then sort what is left
 *  7. THE BUG: `Array.prototype.sort` mutates in place. The `rows` prop belongs
 *     to the parent. Reordering it is how you get a list that shuffles itself
 *     in a component you never touched. Never sort a prop directly.
 */
export default function DataTable({ rows }) {
  return null
}
