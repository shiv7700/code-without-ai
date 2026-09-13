/**
 * LEVEL 60 — move things between two lists
 *
 * Topics: selection as a Set · derived enabled/disabled · array updates
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * Props: { left: string[], right: string[] }  — the starting contents
 *
 * Render:
 *   - <ul data-testid="left"> and <ul data-testid="right">
 *   - every item is a checkbox LABELLED with its own text
 *   - a button labelled "Move right" and one labelled "Move left"
 *
 * Rules:
 *  1. "Move right" is disabled unless something on the LEFT is checked, and
 *     vice versa. A selection on one side does not enable the other button.
 *  2. Moving takes every checked item from that side, in its current order,
 *     and appends them to the end of the other side.
 *  3. Items arrive on the other side UNCHECKED — so both buttons go back to
 *     disabled straight after a move.
 *  4. Unchecking the last checked item disables the button again.
 *  5. It works in both directions, and a side may be emptied completely.
 *
 * Three pieces of state (left, right, checked) or two (the lists carry their
 * own checked flag)? Both work. Pick one and notice which rules get easier.
 */
export default function TransferList({ left, right }) {
  return null
}
