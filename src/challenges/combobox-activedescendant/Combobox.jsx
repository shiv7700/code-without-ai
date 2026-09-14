/**
 * The option you are on and the element with the focus are two different things
 *
 * Topics: role=combobox · aria-activedescendant · keyboard navigation
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant
 *
 * Props: { options: string[], value, onChange, label = 'Fruit' }
 *
 * Rules:
 *  1. A text box holding `value`, labelled `label`, with role="combobox" and
 *     aria-expanded saying whether the list is showing.
 *  2. Closed, there is no listbox in the document.
 *  3. Typing calls onChange with the text and opens the list, showing the
 *     options that start with what has been typed, ignoring case.
 *  4. The list is a role="listbox" of role="option"s.
 *  5. ArrowDown and ArrowUp move the highlight through the matches, wrapping.
 *     Nothing is highlighted until an arrow is pressed.
 *  6. The highlighted option has aria-selected="true", and the text box names
 *     it in aria-activedescendant. Nothing else is highlighted.
 *  7. Enter takes the highlighted option and closes the list. Escape closes it
 *     and takes nothing.
 *  8. Clicking an option takes it.
 *
 * Rule 6 is the one people build backwards. Highlighting by moving the focus
 * onto the option reads correctly for about a second — and then the user types
 * another letter, which now goes to an option instead of the text box, and the
 * widget is dead in their hands. The focus stays put; the highlight is a pair
 * of attributes that point at whatever is current.
 */
export default function Combobox({ options = [], value, onChange, label = 'Fruit' }) {
  return null
}
