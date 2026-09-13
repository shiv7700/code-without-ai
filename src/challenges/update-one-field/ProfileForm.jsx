/**
 * One object of state, one field at a time
 *
 * Topics: object state · spread syntax · controlled inputs
 * Read:   https://react.dev/learn/updating-objects-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 *
 * @param {{name: string, email: string, city: string}} profile  the starting values
 * @param {(profile: object) => void} onSave
 *
 * Render three controlled inputs labelled "Name", "Email" and "City", plus a
 * button labelled "Save".
 *
 * Rules:
 *  1. one piece of state holding all three fields, seeded from `profile`
 *  2. the inputs start out showing the profile's values
 *  3. typing in one field leaves the other two exactly as they were
 *  4. "Save" calls `onSave` with the current three fields
 *  5. `profile` is never modified, and the object handed to `onSave` is a new
 *     one — not the prop back again
 *
 * The setter replaces, it does not merge. Hand it the one field you changed
 * and the other two do not survive the render.
 */
export default function ProfileForm({ profile, onSave }) {
  return null
}
