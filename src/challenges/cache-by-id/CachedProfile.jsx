/**
 * A cache that outlives the component, and is read during render
 *
 * Topics: a store outside React · adjusting state when a prop changes · no loading flash
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * Read:   https://react.dev/learn/keeping-components-pure
 *
 * @param {string} id
 * @param {(id: string) => Promise<string>} load
 *
 * Also export `clearProfileCache()`, which empties it.
 *
 * Render "Loading…" until the name is known, then the name.
 *
 * Rules:
 *  1. the cache is a module-level Map keyed by id — it survives unmounting
 *  2. an id already in it renders its name immediately, and does not load
 *  3. an id not in it shows "Loading…", loads, and stores what comes back
 *  4. every instance shares the one cache
 *  5. changing `id` follows the same two rules — never show the old name
 *
 * "Immediately" is the whole exercise. Read the cache in an effect and there is
 * always one render showing "Loading…" first — a flash on every navigation back
 * to a page you have already seen. `useState(cache.get(id))` only fixes it for
 * the first id, because an initialiser runs once and never again.
 */
const cache = new Map()

export function clearProfileCache() {
  cache.clear()
}

export default function CachedProfile({ id, load }) {
  return null
}
