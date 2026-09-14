/**
 * Three boxes that hand the focus along as you fill them
 *
 * Topics: controlled inputs · refs to DOM nodes · state is not immediate
 * Read:   https://react.dev/learn/state-as-a-snapshot
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs
 *
 * Props: { onChange }
 *
 * Rules:
 *  1. Three text boxes, labelled "Day", "Month" and "Year", in that order.
 *     Day and Month hold two digits, Year holds four.
 *  2. Only digits go in. Anything else is dropped, and nothing longer than the
 *     box allows is kept.
 *  3. The moment a box is full, focus moves to the next one. The year has
 *     nowhere to go and keeps the focus.
 *  4. Backspace in a box that is already empty moves focus back to the
 *     previous box without deleting anything there.
 *  5. onChange is called on every edit: with "YYYY-MM-DD" once all three are
 *     full, and with an empty string any time they are not.
 *
 * Rule 3 is the one that misbehaves. The handler that decides to move on is
 * looking at a value it has just asked React to replace, and the replacement
 * does not arrive until the next render — so the jump happens one keystroke
 * late, and typing a full date leaves you a box behind all the way along.
 */
export default function DateParts({ onChange }) {
  return null
}
