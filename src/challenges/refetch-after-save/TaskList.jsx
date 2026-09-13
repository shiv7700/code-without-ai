/**
 * Write, then invalidate — once, not twice, and not on the failure
 *
 * Topics: invalidating after a mutation · effect dependencies · error paths
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 *
 * @param {() => Promise<string[]>} loadTasks
 * @param {(text: string) => Promise<void>} addTask
 *
 * Render the tasks as list items, an input labelled "New task" and an "Add"
 * button. A failure also shows [role="alert"] reading "Could not add".
 *
 * Rules:
 *  1. the list is loaded once on mount
 *  2. submitting calls `addTask` with what was typed
 *  3. once that RESOLVES, the list is loaded again — exactly once
 *  4. the list already on screen stays there until the new one arrives
 *  5. a failed add refetches nothing and leaves the typed text alone
 *  6. the box is cleared only after a successful add
 *
 * Rule 3 is the counting problem. Bump a `version` state to invalidate, put it
 * in the effect's dependencies, and then call the loader from the submit
 * handler too, and you have fired two identical requests — the pair that show
 * up next to each other in the network tab and get explained away as a
 * double-render.
 */
export default function TaskList({ loadTasks, addTask }) {
  return null
}
