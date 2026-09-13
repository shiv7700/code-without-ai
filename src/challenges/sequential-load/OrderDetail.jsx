/**
 * When the second request genuinely needs the first one's answer
 *
 * Topics: dependent requests · async/await · loading through two steps
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * @param {(id: number) => Promise<{customerId: number}>} loadOrder
 * @param {(id: number) => Promise<{name: string}>} loadCustomer
 *
 * Rules:
 *  1. loads the order first
 *  2. only then loads the customer, with the id the order came back with
 *  3. `loadCustomer` is not called at all before the order has answered
 *  4. it stays on "Loading…" through both, and shows the name at the end
 *  5. a failure at either step is one error message
 *
 * The opposite of the previous challenge, and worth doing back to back: here
 * the waterfall is not a mistake, because step two does not exist without step
 * one.
 */
export default function OrderDetail() {
  return null
}
