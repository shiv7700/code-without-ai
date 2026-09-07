/**
 * LEVEL 66 — bars that queue up behind each other
 *
 * Topics: one interval for a list · concurrency limits · functional updates
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role
 *
 * Render:
 *   - a button labelled "Add bar"
 *   - one element per bar with role="progressbar" and aria-valuenow 0…100,
 *     in the order they were added
 *
 * Rules:
 *  1. No bars until the button is pressed. A new bar starts at 0.
 *  2. A filling bar gains 5 every 100ms — 2000ms from empty to full.
 *  3. It stops at exactly 100. It never goes past it.
 *  4. At most THREE bars fill at a time. The rest sit at their current value
 *     until a slot opens.
 *  5. A slot opens when a bar completes, and goes to the earliest waiting bar.
 *  6. Unmounting stops the ticking.
 *
 * One interval driving the whole list is far easier than one per bar — the
 * "at most three" rule is a decision about the list, and only the list knows.
 */
export default function ProgressBars() {
  return null
}
