/**
 * Dismissed is a decision, not a prop
 *
 * Topics: state that outlives props · role=alert · accessible names
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role
 *
 * Props: { message, onDismiss }
 *
 * Rules:
 *  1. Renders a role="alert" holding `message`.
 *  2. Inside it, a button whose accessible name is "Dismiss". A bare "×" is
 *     not a name — a screen reader reads it as "times".
 *  3. Clicking it removes the alert from the DOM and calls onDismiss once.
 *  4. While it is alive, a new `message` replaces the old text.
 *  5. Once dismissed it is gone for good. A new `message` does not resurrect it.
 *
 * Rule 5 is rule 4 with the state read the other way round. Seed the dismissed
 * flag from a prop, or hang a `key` off the message, and every re-render with
 * fresh text quietly undoes the one thing the user asked for.
 */
export default function DismissibleAlert({ message, onDismiss }) {
  return null
}
