/**
 * Pass the rest through, and only the rest
 *
 * Topics: rest props · spread syntax · data and aria attributes
 * Read:   https://react.dev/learn/passing-props-to-a-component#forwarding-props-with-the-jsx-spread-syntax
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
 *
 * Rules:
 *  1. renders a <button> with className "icon-btn"
 *  2. `icon` is its text; `label` becomes its aria-label
 *  3. every other prop lands on the <button> untouched — data-*, aria-*, title,
 *     type, disabled
 *  4. `icon` and `label` themselves never appear as attributes
 *  5. an aria-label passed by the caller wins over the one built from `label`
 *
 * Spreading the whole props object satisfies rule 3 and breaks rule 4: React
 * hands props it does not recognise straight to the DOM, so `icon="+"` becomes
 * a stray attribute. Rule 5 is not about which props you spread but about which
 * side of the spread the attribute you wrote sits on.
 */
export default function PassThroughButton() {
  return null
}
