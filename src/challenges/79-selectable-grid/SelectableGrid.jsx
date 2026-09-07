/**
 * LEVEL 79 — click, shift-click, ctrl-click
 *
 * Topics: an anchor plus a selection · modifier keys · rectangles
 * Read:   https://react.dev/learn/responding-to-events
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey
 *
 * Props: { rows, cols }
 *
 * Render:
 *   a <div role="grid"> of <div role="row">, each holding
 *   <div role="gridcell" data-testid="cell"> with aria-label="Cell 1,2"
 *   (row first, both zero-based), data-cell="1:2" and data-selected.
 *   Plus <p data-testid="count"> reading "4 selected".
 *
 * Rules:
 *  1. A plain click selects exactly that cell and clears everything else.
 *  2. Shift+click selects the RECTANGLE between the anchor and the clicked
 *     cell — every row and column between them, in either direction.
 *  3. The anchor is the last cell selected by a plain or ctrl click. A second
 *     shift+click measures from that same anchor, NOT from the previous
 *     shift+click. This is what makes a drag-select feel right.
 *  4. Shift+click with no anchor behaves like a plain click.
 *  5. Ctrl/Cmd+click toggles one cell without disturbing the others, and moves
 *     the anchor to it.
 *
 * Two pieces of state: the selected cells, and the anchor. Rule 3 is the whole
 * reason the anchor is separate — "the last thing I clicked" and "the corner I
 * am measuring from" are different questions.
 */
export default function SelectableGrid({ rows, cols }) {
  return null
}
