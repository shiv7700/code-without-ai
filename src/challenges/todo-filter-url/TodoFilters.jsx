/**
 * The URL owns the filter, and the component only asks to change it
 *
 * Topics: derived state from props · lifting the source of truth · routing
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state
 * Read:   https://react.dev/learn/sharing-state-between-components
 *
 * Props: { todos: [{ id, title, done }], path, onNavigate }
 *
 * Render:
 *   - buttons "All", "Active" and "Done"; the one matching `path` carries
 *     aria-current="page" and the others carry nothing
 *   - one <li> per visible todo, holding a checkbox labelled with its title
 *
 * Rules:
 *  1. `path` decides what is shown: "/" everything, "/active" the unfinished,
 *     "/done" the finished. Anything else shows everything.
 *  2. Clicking a filter calls `onNavigate` with the new path and does nothing
 *     else — the list moves when a new `path` arrives, not before.
 *  3. Ticking a checkbox marks that todo done, and it leaves the active list
 *     straight away.
 *  4. Those ticks survive navigating to another filter.
 *
 * Rule 2 sounds like extra work and is actually less of it. Read `path` into
 * state on the way in and you have taken a copy of something that keeps
 * changing without you: the back button moves the URL, the prop arrives, and
 * the copy made on the first render is still sat there deciding what to show.
 */
export default function TodoFilters({ todos, path, onNavigate }) {
  return null
}
