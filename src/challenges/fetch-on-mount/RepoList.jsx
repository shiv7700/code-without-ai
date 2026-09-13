/**
 * One request on mount, not one per render
 *
 * Topics: useEffect · dependency array · async in effects
 * Read:   https://react.dev/reference/react/useEffect
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * @param {() => Promise<string[]>} load
 *
 * Rules:
 *  1. calls `load()` once, after the first render
 *  2. renders one <li> per name it resolves with
 *  3. re-rendering the parent does NOT fire another request
 *  4. nothing is rendered in the list before the promise settles
 *
 * An effect with no dependency array runs after every render — and setting
 * state in it causes a render. That is the loop. The array is the whole fix.
 */
export default function RepoList() {
  return null
}
