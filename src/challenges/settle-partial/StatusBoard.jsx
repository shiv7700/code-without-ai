/**
 * One service being down should not blank the whole board
 *
 * Topics: Promise.allSettled · partial failure · rendering both outcomes
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
 * Read:   https://react.dev/learn/rendering-lists
 *
 * @param {{name: string, check: () => Promise<string>}[]} services
 *
 * Rules:
 *  1. one <li> per service, in the order given
 *  2. a service that resolves shows "{name}: {value}"
 *  3. one that rejects shows "{name}: down" — and the rest still render
 *  4. nothing is shown until every check has settled
 *  5. all the checks start together, not one after another
 *
 * `Promise.all` rejects the moment anything does, and you lose the four
 * services that were fine. `allSettled` waits for all of them and hands you
 * the outcomes.
 */
export default function StatusBoard() {
  return null
}
