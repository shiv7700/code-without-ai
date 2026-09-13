/**
 * Giving up on a request that is taking too long
 *
 * Topics: racing promises · settling once · late answers
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 *
 * @param {() => Promise<string>} run
 * @param {Promise<void>} timeout  RESOLVES when the patience runs out
 *
 * Render "Loading…" while waiting, the answer once it lands, or
 * [role="alert"] with the error message — "Timed out" when the clock won.
 *
 * Rules:
 *  1. `run` is called once, on mount
 *  2. whichever of the two settles first decides what is shown
 *  3. the timeout resolving means failure, not success
 *  4. once one has won, the other one changes nothing — late answer, late
 *     failure, late timeout, all ignored
 *
 * `Promise.race([run(), timeout])` reads beautifully and is wrong twice over:
 * the timeout RESOLVES, so you render `undefined` as a perfectly good answer.
 * Wire the two up separately and rule 4 is the part that bites — the request
 * you gave up on still calls its `.then`.
 */
export default function TimedRequest({ run, timeout }) {
  return null
}
