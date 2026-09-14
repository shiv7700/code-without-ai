/**
 * The caption names the table, and the empty row has to span all of it
 *
 * Topics: table markup · caption · colSpan
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
 * Read:   https://react.dev/reference/react-dom/components/common
 *
 * @param {string} caption
 * @param {{key: string, header: string}[]} columns
 * @param {object[]} rows  each with an `id`
 *
 * Rules:
 *  1. a <table> whose accessible name is `caption` — which means the caption
 *     goes inside the table, as its first child, not in a heading above it
 *  2. a <thead> row of <th scope="col">, one per column, in order
 *  3. a <tbody> row per entry, one <td> per column, showing row[column.key]
 *  4. no rows — a single <tbody> row holding one <td> reading "No sales yet",
 *     spanning every column there is
 *  5. that span is however many columns were configured, not a number you typed
 *
 * Rule 1 is the reason to use a caption at all: it is the only thing that gives
 * a table a name without an aria attribute, and it only works from inside, in
 * that one position. Rule 5 is the ordinary one that still breaks — the empty
 * row is written once, on the day the table has three columns, and stays wrong
 * from the first time someone adds a fourth.
 */
export default function SalesTable() {
  return null
}
