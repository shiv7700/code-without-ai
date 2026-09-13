/**
 * Debounce, then fetch, then still throw the old answer away
 *
 * Topics: debouncing · race conditions · one cleanup for both
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 *
 * @param {(q: string) => Promise<string[]>} search
 * @param {(ms: number) => Promise<void>} wait  resolves when the pause is over
 * @param {number} delay  default 300
 *
 * Render an input labelled "Search" and the results as list items.
 *
 * Rules:
 *  1. typing never searches straight away — `wait(delay)` comes first
 *  2. a wait that finishes for text the user has already changed is dropped
 *  3. an empty box searches nothing and shows no results
 *  4. the results on screen belong to the newest query, whatever order the
 *     answers come back in
 *
 * Three ways to show the wrong thing, one after the other. Cancel the pause but
 * not the request in flight and rule 4 fails on its own: "a" is searched, "ab"
 * is searched, "a" answers second, and the user is reading results for text
 * they deleted.
 */
export default function SearchBox({ search, wait, delay = 300 }) {
  return null
}
