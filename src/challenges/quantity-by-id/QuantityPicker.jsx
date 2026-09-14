/**
 * One object of state keyed by id, not one useState per row
 *
 * Topics: object state · computed keys · derived total
 * Read:   https://react.dev/learn/choosing-the-state-structure
 * Read:   https://react.dev/learn/updating-objects-in-state#using-a-single-event-handler-for-multiple-fields
 *
 * @param {{id: string, name: string, price: number}[]} items
 *
 * Render a row per item showing its name, its quantity in
 * [data-testid="qty-<id>"], and buttons named "Add <name>" and
 * "Remove <name>". Below them a total in [data-testid="total"], two decimals.
 *
 * Rules:
 *  1. one piece of state — an object of quantities keyed by item id, every one
 *     starting at 0
 *  2. "Add" and "Remove" change only that id's quantity
 *  3. a quantity never drops below 0
 *  4. the total is the sum of price × quantity, worked out while rendering
 *
 * The key is a variable, so it needs the brackets — `{ [id]: n }`. The mistake
 * that survives the first click is returning only that one key: the row you
 * pressed counts up perfectly while every other row quietly resets.
 */
export default function QuantityPicker({ items = [] }) {
  return null
}
