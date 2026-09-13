/**
 * LEVEL 10 — destructuring in the signature, and what a default really covers
 *
 * Topics: destructuring · default values · conditional rendering
 * Read:   https://react.dev/learn/passing-props-to-a-component
 * Read:   https://react.dev/learn/conditional-rendering
 *
 * Rules:
 *  1. destructure in the signature — no `props.` anywhere in the body
 *  2. `name` in an <h2>, `role` in [data-testid="role"]
 *  3. no `role` given — "Member"
 *  4. `location` is optional: leave the element out entirely when it is missing
 *
 * Rule 3 has a sharp edge. A default parameter fills in for `undefined` only.
 * `role={null}` is a value, so it is kept — and renders as nothing.
 */
export default function ProfileCard() {
  return null
}
