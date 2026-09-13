/**
 * Polling, when something else owns the clock
 *
 * Topics: subscriptions · effect cleanup · effect dependencies
 * Read:   https://react.dev/learn/synchronizing-with-effects#subscribing-to-events
 * Read:   https://react.dev/learn/removing-effect-dependencies
 *
 * @param {() => Promise<string>} load
 * @param {(fn: () => void) => () => void} tick  subscribe, returns unsubscribe
 *
 * Render the newest value in <p data-testid="value">.
 *
 * Rules:
 *  1. `load` is called once on mount
 *  2. every tick calls `load` again
 *  3. the newest value replaces whatever was there
 *  4. unmounting unsubscribes — a tick afterwards loads nothing
 *
 * Rule 2 says every tick, once. Put the value in the subscribing effect's
 * dependencies and you resubscribe after every answer; forget the cleanup while
 * you are at it and by the fourth tick four listeners all call `load`.
 */
export default function Poller({ load, tick }) {
  return null
}
