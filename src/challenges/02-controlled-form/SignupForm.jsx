/**
 * LEVEL 2 — controlled inputs + derived state
 *
 * Topics: controlled inputs · derived state
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 *
 * Render a form:
 *   - an input labelled "Email"     (use <label htmlFor> + id, or aria-label)
 *   - an input labelled "Password"  (type="password")
 *   - a button labelled "Sign up"
 *
 * Rules:
 *  1. both inputs are CONTROLLED — their value comes from state
 *  2. the button is disabled until BOTH are valid:
 *       email    → contains "@"
 *       password → at least 8 characters
 *  3. on submit, call `onSubmit({ email, password })` — exactly once
 *  4. no `isValid` state. Validity is DERIVED from email/password on each render.
 *     If you find yourself writing useEffect to sync validity, stop — you don't need it.
 */
export default function SignupForm({ onSubmit }) {
  return null
}
