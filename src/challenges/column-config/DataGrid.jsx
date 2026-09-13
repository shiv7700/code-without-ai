/**
 * The columns decide the cells, not the row object
 *
 * Topics: config-driven rendering · nested map · table markup
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
 *
 * @param {{key: string, header: string, render?: (row) => any}[]} columns
 * @param {object[]} rows  each with an `id`
 *
 * Rules:
 *  1. a <table> with a <thead> row of <th>, one per column, in the given order
 *  2. a <tbody> row per entry, with one <td> per column — every body row has
 *     exactly as many cells as there are columns
 *  3. a cell shows `row[column.key]`, or `column.render(row)` when the column
 *     has one
 *  4. a key the row does not have renders an empty cell, in its own column
 *
 * Rule 4 is the one that bites in production. Walking the row's own keys builds
 * the right table for tidy data and then silently shifts every cell one column
 * along the day a row comes back missing a field — or with its keys in a
 * different order, which JSON makes no promises about.
 */
export default function DataGrid() {
  return null
}
