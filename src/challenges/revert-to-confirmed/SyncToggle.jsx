/**
 * Rolling back to the server's answer, not to whatever was there a second ago
 *
 * Topics: optimistic UI · overlapping saves · last write wins
 * Read:   https://react.dev/reference/react/useOptimistic
 * Read:   https://react.dev/reference/react/useRef
 *
 * @param {boolean} initial  the server's value at mount
 * @param {(next: boolean) => Promise<void>} save
 *
 * Render a button named "Notifications" whose aria-pressed is the value shown.
 * A failure also shows [role="alert"] reading "Could not save".
 *
 * Rules:
 *  1. clicking flips what is shown immediately and calls `save` with it
 *  2. the button stays clickable — a second click while the first save is in
 *     flight is allowed, and saves again
 *  3. a save that resolves confirms its value
 *  4. a save that fails reverts to the last CONFIRMED value and shows the alert
 *  5. unless it has been overtaken: a failure for anything but the newest save
 *     changes nothing on screen
 *  6. any success clears the alert
 *
 * Rolling back to "the value before this click" is right only while one save
 * is in flight. Click twice quickly, let the first fail, and that rollback
 * undoes the second click too — the user watches the switch move on its own,
 * to a value they never asked for and the server never had.
 */
export default function SyncToggle({ initial, save }) {
  return null
}
