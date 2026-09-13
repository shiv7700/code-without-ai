/**
 * LEVEL 70 — errors that wait their turn
 *
 * Topics: touched state · validation as a pure function · submit handling
 * Read:   https://react.dev/reference/react-dom/components/input
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role
 *
 * Props: { onSubmit: ({ email, password }) => void }
 *
 * Render:
 *   labelled inputs "Email", "Password" and "Confirm password", a button
 *   reading "Sign up", and each visible error in its own <p role="alert">.
 *
 * The messages, exactly:
 *   'Enter a valid email'
 *   'Password must be at least 8 characters'
 *   'Passwords do not match'
 *
 * Rules:
 *  1. Nothing is wrong until the user has had a go. No errors on first render,
 *     and none while a field is still being typed into for the first time.
 *  2. Blurring a field is what makes its error visible.
 *  3. Once visible, an error disappears as soon as the value becomes valid.
 *  4. An email needs an @ and a dot in the domain. A password needs 8
 *     characters. The confirmation must equal the password.
 *  5. Submitting marks every field as touched, so every error shows at once.
 *  6. An invalid submit never calls `onSubmit`. A valid one calls it with
 *     `{ email, password }` — no confirmation field.
 *
 * Errors are derived from the values, every render. What is stored is which
 * fields have been touched. Storing the errors as state is how you end up with
 * a form that shows yesterday's complaint.
 */
export default function SignupForm({ onSubmit }) {
  return null
}
