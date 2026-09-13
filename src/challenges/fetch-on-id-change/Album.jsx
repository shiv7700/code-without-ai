/**
 * The dependency array decides when you ask again
 *
 * Topics: effect dependencies · refetching · useEffect
 * Read:   https://react.dev/learn/lifecycle-of-reactive-effects
 * Read:   https://react.dev/learn/removing-effect-dependencies
 *
 * @param {(id: number) => Promise<{title: string}>} load
 * @param {number} id
 *
 * Rules:
 *  1. loads on mount with the `id` it was given
 *  2. a NEW id loads again, with the new id
 *  3. re-rendering with the SAME id does not load again
 *  4. `load` is called with the id and nothing else
 *
 * Rule 3 is what the array buys you. Rule 2 is what it costs if you leave the
 * array empty to "only run once" — the component then shows album 1 forever.
 */
export default function Album() {
  return null
}
