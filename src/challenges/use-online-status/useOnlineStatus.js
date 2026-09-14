/**
 * The gap between reading a value and subscribing to it
 *
 * Topics: external stores · subscribe then re-read · effect cleanup
 * Read:   https://react.dev/learn/synchronizing-with-effects#subscribing-to-events
 * Read:   https://react.dev/reference/react/useState#storing-information-from-previous-renders
 *
 * @param {{isOnline: () => boolean, subscribe: (listener) => Function}} net
 *        `subscribe` returns the function that unsubscribes
 * @returns {boolean} whether the connection is up right now
 *
 * Rules:
 *  1. the first render already reports `net.isOnline()` — no false-then-true
 *     flicker one paint later
 *  2. when the connection changes, the component re-renders with the new value
 *  3. it subscribes exactly once for the component's life, however many times
 *     it renders
 *  4. unmounting unsubscribes
 *  5. a change that happened AFTER the first render but BEFORE the subscription
 *     was in place is not missed
 *
 * Rule 5 is the one nobody writes the first time. Reading the value while
 * rendering and subscribing in an effect leaves a window in between, and
 * anything that happens in it was announced to nobody — the listener did not
 * exist yet, and the value you are showing was read before it changed. The fix
 * is a line, in a place that only makes sense once you have seen the hole.
 */
export function useOnlineStatus(net) {
  throw new Error('not implemented')
}
