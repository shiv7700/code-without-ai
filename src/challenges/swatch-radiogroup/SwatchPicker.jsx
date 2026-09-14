/**
 * A radiogroup nobody has chosen from yet still needs a way in
 *
 * Topics: role=radiogroup · roving tabindex · arrow-key selection
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radiogroup_role
 *
 * Props: { colours: [{ value, name }], value, onChange, label = 'Colour' }
 *
 * Rules:
 *  1. A role="radiogroup" named `label`, holding one role="radio" per colour,
 *     each named by its `name`.
 *  2. aria-checked is "true" on the chosen one and "false" on the rest. The
 *     swatches are colour alone, so the name is all a screen reader gets.
 *  3. The group is one tab stop. Tab enters it, the next Tab leaves it.
 *  4. ArrowRight and ArrowDown move to the next swatch, ArrowLeft and ArrowUp
 *     to the previous, wrapping at both ends. Moving also chooses.
 *  5. Space chooses whatever has focus.
 *  6. Clicking a swatch chooses it.
 *  7. Controlled: a parent that ignores onChange leaves the group as it was.
 *
 * Rule 3 has a case that is easy to miss. Point the single tab stop at the
 * chosen swatch and it works beautifully — right up to a form that opens with
 * nothing chosen, where every swatch is now skipped and the group cannot be
 * reached from the keyboard at all.
 */
export default function SwatchPicker({
  colours = [],
  value,
  onChange,
  label = 'Colour',
}) {
  return null
}
