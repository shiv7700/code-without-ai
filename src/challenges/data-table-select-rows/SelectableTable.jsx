/**
 * Select-all means all of these, not all of them
 *
 * Topics: indeterminate is a DOM property · Set in state · derived from the filter
 * Read:   https://react.dev/reference/react-dom/components/input#controlling-a-checkbox
 * Read:   https://react.dev/learn/referencing-values-with-refs
 *
 * Props: { rows: [{ id, name }], onChange }
 *
 * Render an input labelled "Search" and a <table>. Each body row gets a
 * checkbox labelled "Select {name}"; the header cell gets one labelled
 * "Select all".
 *
 * Rules:
 *  1. Search filters rows by name, case-insensitive substring. Only matching
 *     rows are rendered.
 *  2. Ticking rows calls onChange with the selected ids, in the order `rows`
 *     gave them.
 *  3. "Select all" is checked when every VISIBLE row is selected, and
 *     indeterminate when only some are.
 *  4. Clicking it selects every visible row. Clicking it while it is checked
 *     clears the visible rows — and only those.
 *  5. A row selected before a filter hid it stays selected. It is still in
 *     what onChange reports.
 *
 * Selection outlives the filter; the header checkbox does not. Compare the
 * selected count against `rows.length` and a filtered table shows a
 * half-ticked box over three rows that are all ticked. `indeterminate` is a
 * DOM property with no JSX attribute, so whatever you compute has to reach the
 * element some other way.
 */
export default function SelectableTable({ rows = [], onChange }) {
  return null
}
