/**
 * A button inside a clickable row, and the click that escapes
 *
 * Topics: event bubbling · stopPropagation · nested handlers
 * Read:   https://react.dev/learn/responding-to-events#stopping-propagation
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
 *
 * @param {{id: string, label: string}[]} rows  the starting rows
 *
 * Render a <ul> with one <li> per row. Each row shows its label and holds a
 * button named "Remove <label>".
 *
 * Rules:
 *  1. clicking a row selects it — that <li> carries data-selected="true"
 *  2. only one row is selected at a time, and the others carry no
 *     data-selected attribute at all
 *  3. the button removes its own row from the list
 *  4. removing never changes the selection — not the row's own, not anyone's
 *  5. `rows` is never modified
 *
 * The button sits inside the row, so its click travels straight up through the
 * row's own handler on the way out. Remove a row while nothing is selected and
 * you will find something selected afterwards.
 */
export default function SelectableRows({ rows = [] }) {
  return null
}
