/**
 * LEVEL 30 — the key is an identity, not a position
 *
 * Topics: lists · keys · component identity
 * Read:   https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
 * Read:   https://react.dev/learn/preserving-and-resetting-state
 *
 * @param {{id: string, label: string}[]} items
 *
 * Rules:
 *  1. one <li> per item, in the order given
 *  2. each row has a <label> holding `item.label`, tied to an <input> beside it
 *  3. the input's id is the item's id, so the label actually points at it
 *  4. re-render with the same items reordered — whatever was typed in a row
 *     stays in THAT row
 *
 * Rule 4 is the only one you cannot fake. React keeps DOM around by key; with
 * the array index as the key, position 0 keeps its input and the typed text is
 * left behind on whichever item happens to land there.
 */
export default function ReorderableList() {
  return null
}
