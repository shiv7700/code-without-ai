/**
 * Two pieces of state that must agree, and the render where they do not
 *
 * Topics: derived state · redundant state · one commit per click
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 *
 * @param {{id: string, label: string}[]} options
 * @param {(shown: {id: string|null, label: string|null}) => void} onCommit
 *
 * Render one <button> per option, named with its label, and a heading showing
 * "Selected: <label>" — or "Nothing selected" before anything is clicked.
 *
 * Rules:
 *  1. clicking an option selects it, and the heading shows its label
 *  2. after EVERY render, call `onCommit` with what is on screen: the selected
 *     id and the label the heading is showing, both null when nothing is
 *  3. no call ever pairs an id with another option's label
 *  4. one click produces exactly one more call — one render, not two
 *  5. re-rendering with new labels for the same ids updates the heading at once
 *
 * Keeping the label in state next to the id is the trap, and that second copy
 * is always one render behind: the click sets the id, React paints, and only
 * then does an effect catch the label up. So there is a frame on screen — and a
 * call to `onCommit` — showing the label of whatever was selected before. There
 * is no such frame when the label was never state in the first place.
 */
export default function OptionPicker({ options = [], onCommit }) {
  return null
}
