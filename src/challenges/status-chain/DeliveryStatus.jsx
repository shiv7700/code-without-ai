/**
 * Four outcomes, one answer, and the order decides which
 *
 * Topics: conditional rendering · early return · precedence
 * Read:   https://react.dev/learn/conditional-rendering
 * Read:   https://react.dev/learn/conditional-rendering#conditionally-assigning-jsx-to-a-variable
 *
 * Rules:
 *  1. exactly one line of text renders, in [data-testid="status"]
 *  2. `cancelled` → "Cancelled", whatever else is set
 *  3. otherwise `deliveredAt` → "Delivered on <deliveredAt>"
 *  4. otherwise `shippedAt` → "Shipped on <shippedAt>"
 *  5. otherwise → "Not shipped yet"
 *
 * A parcel that shipped, arrived, and was then cancelled has all three props
 * set at once, so the props do not tell you the state — your order of asking
 * does. Written as three separate `{shippedAt && ...}` blocks you get three
 * lines on screen; written in the wrong order you get one confident wrong one.
 */
export default function DeliveryStatus() {
  return null
}
