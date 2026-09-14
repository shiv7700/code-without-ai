/**
 * A discount is a rule, not an amount
 *
 * Topics: derived state · array updates · money formatting
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
 *
 * Props: { items: [{ id, name, price, qty }] }  — the starting contents
 *
 * Render:
 *   - one <li> per item, holding a <span data-testid="line"> that reads
 *     "Mug ×2 £17.00", then the buttons
 *   - per line, buttons "Increase Mug", "Decrease Mug", "Remove Mug"
 *   - a text input labelled "Discount code" and a button "Apply"
 *   - <p data-testid="subtotal"> "£20.00", <p data-testid="discount">
 *     "−£2.00" and <p data-testid="total"> "£18.00"
 *   - with nothing left, the text "Your cart is empty"
 *
 * Rules:
 *  1. Every amount is £ and two decimal places. The minus in front of the
 *     discount is U+2212, and it is there even when the discount is nothing.
 *  2. A line total is price × qty; the subtotal is every line added up.
 *  3. Decreasing the last one of something removes the line, same as Remove.
 *  4. "SAVE10" is a tenth off. Any other code shows "Invalid code" in a
 *     role="alert" and takes nothing off.
 *  5. Total is subtotal minus discount, and never goes below zero.
 *
 * The code is applied once; the cart keeps moving afterwards. Work out what
 * you actually have to remember at the moment Apply is pressed — the sum you
 * saw then is the one thing that will be wrong a click later.
 */
export default function Cart({ items }) {
  return null
}
