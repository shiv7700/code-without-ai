/**
 * How far down the spreading has to go
 *
 * Topics: nested state · structural sharing · immutable update
 * Read:   https://react.dev/learn/updating-objects-in-state#updating-a-nested-object
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-deeply-nested-state
 *
 * @param {{user: {name: string}, prefs: {theme: string, notify: {email: boolean}}}} settings
 * @param {(settings: object) => void} onChange
 *
 * Render, from `settings`:
 *   - an input labelled "Name"                     → user.name
 *   - a <select> labelled "Theme", light or dark   → prefs.theme
 *   - a checkbox labelled "Email"                  → prefs.notify.email
 *
 * Rules:
 *  1. every control shows the current value and is controlled
 *  2. any change calls `onChange` with the whole settings object, rebuilt
 *  3. `settings` is never modified, at any depth
 *  4. every object ON the path to what changed is a new one
 *  5. every object OFF that path is shared, not copied — change the theme and
 *     `next.user` is the very same object that went in
 *
 * A single spread copies the top level and hands the nested objects straight
 * through, so `next.prefs.theme = 'dark'` writes into the prop you were given
 * and every render after that agrees with itself about a value that was never
 * meant to change.
 */
export default function SettingsPanel({ settings, onChange }) {
  return null
}
