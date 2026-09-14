/**
 * Dirty is a comparison, not a flag
 *
 * Topics: derived state · redundant state · moving the baseline
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 *
 * @param {{title: string, body: string}} initial
 * @param {(values: object) => void} onSave
 *
 * Render inputs labelled "Title" and "Body", and a button "Save".
 *
 * Rules:
 *  1. Save is disabled while the fields match the last saved values
 *  2. any edit enables it
 *  3. editing back to the saved value disables it again — type a character and
 *     delete it and there is nothing left to save
 *  4. Save calls `onSave` with the current values, and goes clean
 *  5. after a save the baseline is what was SAVED, not `initial` — edit, save,
 *     edit again, undo that edit, and Save is disabled
 *  6. `initial` is never modified
 *
 * A boolean set to true by the change handler passes rules 1, 2 and 4 and is
 * wrong in both directions at once: it never comes back down when the edit is
 * undone, and if it is measured against `initial` for ever, the form is
 * permanently dirty from the first save onwards.
 */
export default function ArticleForm({ initial, onSave }) {
  return null
}
