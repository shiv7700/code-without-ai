/**
 * An effect whose dependency is a brand new object every render
 *
 * Topics: useEffect · dependency arrays · Object.is
 * Read:   https://react.dev/reference/react/useEffect#removing-unnecessary-object-dependencies
 * Read:   https://react.dev/learn/removing-effect-dependencies
 *
 * @param {() => (void | Function)} effect
 * @param {Array} deps  entries are numbers, strings, arrays or plain objects
 *
 * Rules:
 *  1. it runs on mount
 *  2. a re-render whose deps have the same CONTENTS does not run it again,
 *     however many fresh objects the caller builds
 *  3. a change anywhere inside the deps — nested a level or two down — runs it
 *  4. cleanup behaves normally: before the next run, and on unmount
 *  5. once new deps have been accepted, a further re-render with equal
 *     contents still does not run it
 *  6. the effect body itself is called with no arguments and may return cleanup
 *
 * React compares deps with `Object.is`, so `{ filters: { tag: 'new' } }` built
 * inline is a different dependency every single render and the effect fires
 * every single render. Rule 5 is the interesting half: something has to hold on
 * to what was last accepted, and keeping the deps you first saw means you are
 * comparing against history the moment anything changes.
 */
export function useDeepCompareEffect(effect, deps) {
  throw new Error('not implemented')
}
