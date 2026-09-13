/**
 * Three components ask for the same thing at once; the server hears once
 *
 * Topics: sharing a promise · in-flight map · finally
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 *
 * @param {string} id
 * @param {(id: string) => Promise<string>} load
 *
 * Also export `resetSharedLoads()`, which forgets everything.
 *
 * Render "Loading…", then <p data-testid="value"> with the value, or
 * [role="alert"] with the error message.
 *
 * Rules:
 *  1. while a request for an id is still running, another instance asking for
 *     the same id gets the SAME promise — `load` runs once
 *  2. different ids are different requests
 *  3. once it settles the entry is forgotten. A later mount asks again — this
 *     is sharing, not caching
 *  4. the answer reaches every waiting instance, and so does a rejection
 *  5. an instance that unmounts before the answer sets no state, and does not
 *     spoil it for the others
 *
 * Keep the RESULT and rule 1 fails — nothing is stored until the answer lands,
 * so simultaneous mounts all miss and all fetch. Keep the promise but clean up
 * in `.then` and rule 3 fails on the sad path: the rejected promise stays in
 * the map forever, and every mount from now on re-fails instantly.
 */
const inFlight = new Map()

export function resetSharedLoads() {
  inFlight.clear()
}

export default function SharedLoader({ id, load }) {
  return null
}
