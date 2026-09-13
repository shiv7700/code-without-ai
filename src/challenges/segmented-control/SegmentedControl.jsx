/**
 * Exactly one pressed, and the parent owns which
 *
 * Topics: aria-pressed · controlled components · role=group
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed
 * Read:   https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
 *
 * Props: { options: [{ value, label }], value, onChange, label }
 *
 * Rules:
 *  1. A role="group" whose accessible name is `label`.
 *  2. One <button> per option, named by its label.
 *  3. Every button carries aria-pressed — "true" on the selected one and
 *     "false" on the rest. Not missing on the rest.
 *  4. Clicking an unselected option calls onChange(value) once.
 *  5. Clicking the already-selected option calls nothing.
 *  6. A `value` matching no option leaves everything unpressed.
 *
 * This is controlled: `value` is the only thing that decides what is pressed.
 * Keep a copy of it in state "so it feels instant" and the button lights up
 * for a parent that rejected the change — the screen and the data now disagree,
 * and only one of them is right.
 */
export default function SegmentedControl({ options = [], value, onChange, label }) {
  return null
}
