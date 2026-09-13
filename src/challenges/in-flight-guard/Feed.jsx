/**
 * The in-flight flag that a state variable is too slow to be
 *
 * Topics: useRef · guarding a double load · state is not read back immediately
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/state-as-a-snapshot
 *
 * @param {(page: number) => Promise<string[]>} loadPage  1-based
 * @param {(fn: () => void) => () => void} watch  the sentinel came into view
 *
 * Render the items as list items, and the text "No more" once the end is
 * reached.
 *
 * Rules:
 *  1. page 1 loads on mount
 *  2. each sighting loads the next page and appends it
 *  3. only one page may be in flight — sightings while loading are ignored
 *  4. two sightings in the same tick load ONE page
 *  5. an empty page means the end: show "No more" and stop watching
 *  6. unmounting stops watching
 *
 * A sentinel scrolling past fires twice in a row long before your first page
 * comes back. `if (!loading) { setLoading(true); … }` cannot stop it — both
 * calls read the same `loading` from the same render, and both see `false`.
 * The flag has to be readable the instant after it is written.
 */
export default function Feed({ loadPage, watch }) {
  return null
}
