/**
 * LEVEL 18 — optimistic updates, and rolling them back
 *
 * Topics: async state · rollback · useOptimistic (for later)
 * Read:   https://react.dev/reference/react/useOptimistic
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * Props: {
 *   liked: boolean,        initial server value
 *   count: number,         initial server value
 *   onToggle: (next) => Promise   // resolves = saved, rejects = failed
 * }
 *
 * Render a button whose text is the count, with aria-pressed reflecting `liked`.
 *
 * Rules:
 *  1. clicking flips liked and adjusts count IMMEDIATELY — before the promise
 *     settles. That is the whole point: the UI does not wait for the network.
 *  2. onToggle is called with the value being moved to (true when liking)
 *  3. while a save is in flight the button is disabled — no double submits
 *  4. on resolve, the optimistic value stays
 *  5. on reject, roll BACK to what it was before the click, and show the text
 *     "Could not save"
 *  6. a later successful click clears that error message
 *
 * The trap in rule 5: rolling back to `props.liked` is wrong once the user has
 * clicked more than once. Roll back to the value you had immediately before
 * this click, not to the value the server first gave you.
 */
export default function LikeButton({ liked, count, onToggle }) {
  return null
}
