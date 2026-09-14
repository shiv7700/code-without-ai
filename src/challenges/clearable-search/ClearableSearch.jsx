/**
 * The clear button that must not take the focus with it
 *
 * Topics: controlled input · focus management · button type
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type
 * Read:   https://react.dev/reference/react-dom/components/common#react-event-object
 *
 * Props: { value, onChange, label = 'Search' }
 *
 * Rules:
 *  1. An <input type="search"> labelled with `label`, showing `value`.
 *  2. Typing calls onChange with the new text.
 *  3. While the value is empty there is no clear button in the document at all.
 *  4. With text there is a button named "Clear search". Pressing it calls
 *     onChange with an empty string.
 *  5. After clearing, focus is still in the input — the next character typed
 *     goes where the user expects.
 *  6. Escape in the input clears it the same way.
 *  7. The component is often dropped inside a form. Clearing must never submit
 *     that form.
 *
 * Two defaults conspire here. A <button> with no type is a submit button, and
 * pressing any button moves focus to it. Both are invisible in a test that only
 * checks the value went empty, and both are obvious the moment someone uses the
 * thing for real.
 */
export default function ClearableSearch({ value, onChange, label = 'Search' }) {
  return null
}
