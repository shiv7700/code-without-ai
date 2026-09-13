/**
 * LEVEL 26 — sorting without mutating, and a three-state header
 *
 * Topics: derived state · immutability · array methods
 * Read:   https://react.dev/learn/updating-arrays-in-state
 *
 * Props: { rows: [{ name, score }] }
 *
 * Render a table. Two header buttons, "Name" and "Score", each sorting by
 * that column. Each body row gets data-testid="row", with the name in its
 * first cell and the score in its second.
 *
 * Rules:
 *  1. Unsorted at first — rows appear in the order they were passed.
 *  2. Clicking a header sorts ascending by that column.
 *  3. Clicking the SAME header again flips to descending.
 *  4. Clicking the OTHER header starts that column ascending, not descending.
 *  5. The active header carries data-dir="asc" or "desc". The idle one has no
 *     data-dir at all.
 *  6. The `rows` prop is never mutated. Array.sort sorts in place — the array
 *     you sort had better be a copy.
 *
 * Sort order is not state you store. It is the two things you DO store —
 * which column, which direction — applied during render.
 */
export default function SortableList({ rows }) {
  return null
}
