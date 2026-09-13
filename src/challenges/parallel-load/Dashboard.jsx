/**
 * Two awaits in a row is two round trips you did not need
 *
 * Topics: Promise.all · concurrency · await
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * @param {() => Promise<string>} loadUser
 * @param {() => Promise<number>} loadCount
 *
 * Rules:
 *  1. BOTH requests are started before either has answered
 *  2. the screen stays on "Loading…" until both are in
 *  3. then the name and the count are shown together
 *  4. if either one fails, the whole thing is an error
 *
 * Rule 1 is the one the test pins down: it checks both were called while
 * nothing had resolved yet. `await a` then `await b` fails it.
 */
export default function Dashboard() {
  return null
}
