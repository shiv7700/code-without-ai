/**
 * Backspace means two different things, and the box decides which
 *
 * Topics: keydown vs change · controlled list · focus management
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
 * Read:   https://react.dev/learn/responding-to-events
 *
 * Props: { value, onChange, label = 'Tags' }
 *
 * Rules:
 *  1. The chosen tags are a list named "Selected tags", one item each, showing
 *     the tag and a button named `Remove ${tag}`.
 *  2. Below it a text box labelled `label`.
 *  3. Enter adds the trimmed contents as a tag and empties the box. Blank
 *     input and tags already chosen add nothing, and still empty the box.
 *  4. Backspace removes the last tag — but only when the box is empty. With
 *     anything typed in it, Backspace is an ordinary delete and the tags are
 *     untouched.
 *  5. Removing a tag with its button leaves the focus in the text box, ready
 *     for the next one.
 *  6. Controlled: `value` is the list, and a parent that ignores onChange
 *     changes nothing on screen.
 *
 * Rule 4 is a question of when you look. Ask what is in the box after the
 * deletion has happened and the last character the user types is also the one
 * that eats a tag they had no intention of touching.
 */
export default function ChipsInput({ value = [], onChange, label = 'Tags' }) {
  return null
}
