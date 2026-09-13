/**
 * A switch is a control, not a coloured div
 *
 * Topics: role=switch · keyboard support · controlled components
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/switch_role
 *
 * Props: { checked = false, onChange, label }
 *
 * Rules:
 *  1. One element with role="switch", whose accessible name is `label`.
 *  2. aria-checked is "true" or "false".
 *  3. Clicking calls onChange(!checked) exactly once.
 *  4. Space does the same. Someone using a keyboard never clicks.
 *  5. It is in the tab order — a single Tab lands on it.
 *  6. Controlled: `checked` decides what is shown. Nothing else does.
 *
 * Rules 4 and 5 are free if you pick the right element and cost you a
 * tabIndex, a keydown handler and a preventDefault if you do not. Reach for a
 * <div> here and the bug is invisible in every test you run with a mouse.
 */
export default function Switch({ checked = false, onChange, label }) {
  return null
}
