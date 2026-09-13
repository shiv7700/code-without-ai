/**
 * A draft you can throw away
 *
 * Topics: array state · editing a copy · cancel
 * Read:   https://react.dev/learn/updating-arrays-in-state#updating-objects-inside-arrays
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * @param {{id: string, name: string}[]} rows  the starting rows
 * @param {(row: object) => void} onSave
 *
 * Render a <ul> with one <li> per row. A row normally shows its name and a
 * button named "Edit <name>". The row being edited shows instead an input
 * labelled "Name", seeded with the current name, plus "Save" and "Cancel".
 *
 * Rules:
 *  1. only one row is in edit mode at a time
 *  2. typing changes nothing outside that input — the list is untouched until
 *     Save
 *  3. "Save" writes the typed name into the list, calls `onSave` with the
 *     updated row, and closes the editor
 *  4. "Cancel" closes the editor and leaves the row exactly as it was
 *  5. `rows` is never modified, and neither is any row object inside it
 *
 * Seeding the draft with the row itself is the whole trap. The input then edits
 * the object that is still sitting in the list, so Save appears to work, and
 * Cancel — which changes nothing, because there is nothing left to undo —
 * quietly keeps every character you typed.
 */
export default function EditableRows({ rows = [], onSave }) {
  return null
}
