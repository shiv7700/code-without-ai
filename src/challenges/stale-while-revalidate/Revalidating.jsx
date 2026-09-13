/**
 * Show the old answer now, the new one when it turns up
 *
 * Topics: stale-while-revalidate · initial state from a prop · failing softly
 * Read:   https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#stale-while-revalidate
 *
 * @param {string} [cached]  what is already known, if anything
 * @param {() => Promise<string>} load
 *
 * Render <p data-testid="value"> with the value — nothing at all while there is
 * none — and <p data-testid="state"> reading 'loading', 'stale' or 'fresh'.
 * A failure also shows [role="alert"] with the message.
 *
 * Rules:
 *  1. a `cached` value is on screen from the very first render, marked 'stale'
 *  2. `load` runs either way
 *  3. what comes back replaces the cached value and the state becomes 'fresh'
 *  4. with no cached value the state is 'loading' and no value is rendered
 *  5. a revalidation that FAILS keeps the stale value exactly where it is
 *
 * Rule 5 is the one people get wrong, and it is the point of the pattern.
 * A single `status` that goes loading → error throws away a perfectly good
 * value because the network blipped. The user had something readable a moment
 * ago; a failed refresh is not a reason to take it away.
 */
export default function Revalidating({ cached, load }) {
  return null
}
