/**
 * Undoing one edit out of three, without touching the other two
 *
 * Topics: optimistic lists · rolling back by id · updater functions
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 *
 * @param {{id: number, name: string}[]} items
 * @param {(id: number, name: string) => Promise<void>} rename
 *
 * Render each item as a list item holding its name, plus a button whose
 * accessible name is `Rename {id}`. Clicking it appends "!" to that name.
 * A failure also shows [role="alert"] reading `Could not rename {old name}`.
 *
 * Rules:
 *  1. the new name shows straight away, and `rename(id, newName)` is called
 *  2. any number of edits may be in flight at the same time
 *  3. an edit that saves keeps its change
 *  4. an edit that fails restores that item's previous name
 *  5. no other item changes — saved, in flight or untouched
 *
 * The tempting rollback is `setItems(before)`, where `before` is the list you
 * copied when the click happened. It works perfectly for one edit and quietly
 * eats the other two: the snapshot is from before all of them, so the failure
 * of the second edit throws away the first and the third as well.
 */
export default function EditableList({ items, rename }) {
  return null
}
