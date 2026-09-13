/**
 * If you can calculate it from props, do not store it
 *
 * Topics: derived values · rendering from props · no state
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 *
 * @param {{name: string, price: number, qty: number}[]} lines
 * @param {number} rate  tax rate, default 0.18
 *
 * Rules:
 *  1. subtotal, tax and total each in their own [data-testid], two decimals
 *  2. all three are worked out while rendering — no useState, no useEffect
 *  3. new props in, new numbers out, on the very next render
 *  4. no lines — every number is "0.00"
 *
 * Rule 3 is what the test is really checking. Copy the props into state on
 * first render and the numbers are right exactly once, then quietly stale.
 */
export default function CartTotal() {
  return null
}
