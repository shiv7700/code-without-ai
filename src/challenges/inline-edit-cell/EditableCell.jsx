/**
 * The draft that outlives the edit it belongs to
 *
 * Topics: edit in place · state initialised from a prop · focus management
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * Read:   https://react.dev/reference/react/useState#storing-information-from-previous-renders
 *
 * Props: { value, onCommit, label }
 *
 * Rules:
 *  1. Idle, it is a button named `Edit ${label}` whose visible text is `value`.
 *  2. Pressing it swaps in a text box labelled `label`, holding `value`, with
 *     the focus.
 *  3. Enter commits: onCommit is called with the typed text.
 *  4. Escape reverts: onCommit is not called.
 *  5. Either way it goes back to the button, and the button gets the focus.
 *     Mind that the keypress which closed the editor does not land on the
 *     button that replaced it and open the thing straight back up.
 *  6. Moving focus out of the box commits, exactly as Enter does.
 *  7. Committing text that matches the current value calls nothing.
 *  8. Every edit opens on the value as it stands now. An abandoned draft, or a
 *     value the parent changed while the cell sat idle, must not come back.
 *
 * Rule 8 is where this falls over. The draft has to start as a copy of the
 * prop, and the obvious place to make that copy runs once and never again — so
 * the second edit is still holding whatever the first one left behind.
 */
export default function EditableCell({ value, onCommit, label }) {
  return null
}
