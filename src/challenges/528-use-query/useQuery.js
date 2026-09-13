/**
 * LEVEL 65 — React Query, the fifteen-line version
 *
 * Topics: a cache outside React · races · resetting state when a prop changes
 * Read:   https://react.dev/reference/react/useState#storing-information-from-previous-renders
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 *
 * @param {string} key      identifies the query, and is passed to the fetcher
 * @param {(key: string) => Promise<*>} fetcher
 * @returns {{status: 'loading'|'success'|'error', data, error}}
 *
 * Also export `clearQueryCache()`, which empties the cache. The tests call it
 * between runs; a real app would expose it for logout.
 *
 * Rules:
 *  1. Starts at `status: 'loading'`, then settles on 'success' with `data`, or
 *     'error' with `error`.
 *  2. The cache is shared across every component using the hook, and lives
 *     OUTSIDE React — a module-level Map. A key already in it never refetches.
 *  3. A cached key renders its data on the FIRST render. No loading flash.
 *  4. Changing the key re-runs the query for the new key, and immediately shows
 *     loading (or the new key's cached data) — never the old key's data.
 *  5. A response for a key you have moved on from is ignored.
 *  6. Unmounting mid-flight sets no state.
 *
 * Rule 3 rules out "start at loading, then fix it in an effect" — an effect
 * runs after the first paint. The initialiser has to consult the cache.
 * Rule 4 is the state-reset-on-prop-change pattern, not another effect.
 */
export function useQuery(key, fetcher) {
  throw new Error('not implemented')
}

export const clearQueryCache = () => {
  throw new Error('not implemented')
}
