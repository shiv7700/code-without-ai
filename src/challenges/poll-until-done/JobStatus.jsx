/**
 * Polling that knows when to stop
 *
 * Topics: stale closures · terminal state · unsubscribing
 * Read:   https://react.dev/learn/separating-events-from-effects
 * Read:   https://react.dev/learn/synchronizing-with-effects#subscribing-to-events
 *
 * @param {() => Promise<{status: string}>} load
 * @param {(fn: () => void) => () => void} tick  subscribe, returns unsubscribe
 *
 * Render the latest status in <p data-testid="status">.
 *
 * Rules:
 *  1. `load` is called once on mount, and again on every tick
 *  2. 'queued' and 'running' mean carry on
 *  3. 'done' and 'failed' are terminal: unsubscribe and never ask again
 *  4. ticks after a terminal status do nothing at all
 *
 * The obvious guard — `if (status !== 'done') load()` inside the subscribed
 * callback — reads the `status` that existed when you subscribed. It is
 * 'queued' forever, and the job that finished ten seconds ago is still being
 * polled. Decide from the answer you just received, not from the render you
 * subscribed in.
 */
export default function JobStatus({ load, tick }) {
  return null
}
