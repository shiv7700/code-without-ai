/**
 * A counter that cannot be pushed past its ends
 *
 * Topics: useState · derived disabled · clamping
 * Read:   https://react.dev/reference/react/useState
 * Read:   https://react.dev/learn/updating-objects-in-state
 *
 * Rules:
 *  1. takes `min` and `max`, defaulting to 0 and 5, and starts at `min`
 *  2. "+" and "−" buttons move it by one
 *  3. it never goes outside the two bounds
 *  4. the button that would break a bound is disabled
 *
 * Whether a button is disabled is not a third piece of state — it is a
 * question about the count you already have. Keep the guard and the disabling
 * agreeing with each other: a disabled button is a courtesy, not a lock.
 */
export default function BoundedCounter() {
  return null
}
