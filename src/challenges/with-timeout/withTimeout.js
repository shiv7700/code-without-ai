/**
 * A deadline that lets go of the work, and of its own timer
 *
 * Topics: promises · AbortSignal · clearing what you started
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
 *
 * @param {(signal: AbortSignal) => Promise<*>} start  called once, immediately
 * @param {number} ms
 * @param {string} [message='timed out']
 * @returns {Promise<*>}
 *
 * Rules:
 *  1. The work finishes first — resolves with its value.
 *  2. The clock wins — rejects with an Error whose `name` is "TimeoutError"
 *     and whose message is `message`.
 *  3. The work fails on its own — that rejection comes through untouched. It
 *     is not turned into a timeout.
 *  4. Whoever loses cannot change the answer. A value arriving after the
 *     timeout is dropped in silence.
 *  5. `start` is handed a signal, and it is aborted when, and only when, the
 *     timeout fires.
 *  6. Once the work has settled the timer is gone. Wait ten times `ms` after a
 *     success and the signal is still not aborted.
 *
 * Rule 6 is the one nobody writes a test for, and the spec here does. A race
 * between a promise and a timer settles correctly and leaves the timer running
 * — it fires later into a promise that has already settled, so nothing visible
 * happens, the callback keeps its whole closure alive, and in Node the process
 * refuses to exit. The signal is the only reason you can see it at all.
 */
export function withTimeout(start, ms, message = 'timed out') {
  throw new Error('not implemented')
}
