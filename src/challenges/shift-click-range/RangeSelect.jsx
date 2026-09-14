/**
 * Shift-click selects from the anchor, and the anchor is not where you just were
 *
 * Topics: click modifiers · anchor index · deriving a range
 * Read:   https://react.dev/learn/responding-to-events
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey
 *
 * @param {{id: string, label: string}[]} rows
 * @param {(ids: string[]) => void} onChange
 *
 * Render a <ul>, each row a <button> named with its label, carrying
 * aria-pressed.
 *
 * Rules:
 *  1. a plain click selects exactly that row and nothing else, and makes it the
 *     anchor
 *  2. shift-click selects every row between the anchor and the clicked row,
 *     inclusive, and nothing outside it
 *  3. it works upwards too — the anchor may be below the row being clicked
 *  4. shift-click does NOT move the anchor. A second shift-click replaces the
 *     range, measured from the same anchor as the first
 *  5. shift-click before there is an anchor behaves like a plain click
 *  6. every change calls `onChange` with the selected ids in list order
 *
 * Rule 4 is the one every first attempt gets wrong. Move the anchor on every
 * click and the selection crawls: click row 4, shift-click row 2, shift-click
 * row 5, and you get rows 2 to 5 rather than 4 and 5. The anchor belongs to the
 * last plain click, and a shift-click is only ever a question about it.
 */
export default function RangeSelect({ rows = [], onChange }) {
  return null
}
