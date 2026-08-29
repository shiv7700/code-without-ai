/**
 * LEVEL 3 — lists, keys, derived state
 *
 * Topics: rendering lists · keys · derived state
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 *
 * Props: { items: string[] }
 *
 * Render:
 *   - an input labelled "Search"
 *   - a <ul> with one <li> per matching item
 *   - when nothing matches: the text "No results" (and no <li>s)
 *
 * Rules:
 *  1. matching is case-insensitive substring — "AP" matches "Apple"
 *  2. the filtered list is DERIVED during render. Do NOT keep it in useState,
 *     and do NOT sync it with useEffect. One state variable is enough: the query.
 *  3. show the match count in an element with data-testid="count", e.g. "2 of 5"
 */
export default function FilterList({ items }) {
  return null
}
