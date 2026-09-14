/**
 * Group by a column you were not told about in advance
 *
 * Topics: grouping · insertion order · keys that are not strings
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
 *
 * Props: { rows: object[], columns: string[], value: string }
 *
 * Render:
 *   - a <select> labelled "Group by" holding `columns`, starting on the first
 *   - one <tr data-testid="group"> per group, three cells: the value, how many
 *     rows are in it, and their `value` column added up
 *   - one <tr data-testid="total"> reading "All", the row count and the sum
 *
 * Rules:
 *  1. Groups come out in the order their first row appears in `rows`.
 *  2. A row whose column is empty or missing belongs to a group called
 *     "(none)".
 *  3. The counts and sums cover the rows in that group; the last row covers
 *     all of them.
 *  4. Changing the select regroups the same rows. Nothing is refetched and
 *     nothing is stored twice.
 *
 * Rule 1 and a plain object do not get along. Object keys are strings, and the
 * ones that look like array indices come back out in numeric order regardless
 * of when you put them in — so grouping by a year quietly sorts the report and
 * grouping by a name does not. Pick a container that keeps its word.
 */
export default function PivotTable({ rows, columns, value }) {
  return null
}
