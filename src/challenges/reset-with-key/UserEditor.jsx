/**
 * Resetting a form by throwing it away
 *
 * Topics: key as identity · preserving and resetting state · uncontrolled inputs
 * Read:   https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key
 * Read:   https://react.dev/reference/react-dom/components/input#providing-an-initial-value-for-an-input
 *
 * @param {{id: string, name: string, email: string}} user
 *
 * Render inputs labelled "Name" and "Email", seeded from `user` with
 * `defaultValue` — the DOM holds the text, React does not.
 *
 * Rules:
 *  1. the inputs start out showing this user's name and email
 *  2. typing into them works
 *  3. rendering a DIFFERENT user throws the typed text away and shows the new
 *     user's values
 *  4. rendering the SAME user again — a new object with the same id, which is
 *     what a parent re-render hands you — keeps whatever was typed
 *  5. on a switch the form is rebuilt rather than patched: the input element
 *     that was there is gone from the document
 *
 * An effect that copies the new props into the fields cannot do rule 5, and
 * with `defaultValue` it cannot do rule 3 either — that prop is read once, when
 * the element is created, and ignored ever after. React already has a way of
 * saying "this is a different form now", and it is one attribute long.
 */
export default function UserEditor({ user }) {
  return null
}
