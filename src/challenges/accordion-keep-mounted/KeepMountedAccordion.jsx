/**
 * Closing a panel should not throw away what is inside it
 *
 * Topics: hidden vs unmounted · aria-controls · role=region
 * Read:   https://react.dev/learn/preserving-and-resetting-state
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Props: { items: [{ id, title, body }] }  — `body` is a React node
 *
 * Rules:
 *  1. One <button> header per item, showing its title.
 *  2. Every panel is in the DOM from the first render. A closed one carries
 *     the `hidden` attribute; it is never removed.
 *  3. One panel open at a time. Opening a second closes the first, and
 *     clicking the open header closes it.
 *  4. Each header carries aria-expanded and aria-controls pointing at its
 *     panel's id.
 *  5. Each panel is a role="region" labelled by its header (aria-labelledby).
 *  6. Because the panels stay mounted, a half-typed value in a closed panel is
 *     still there when it reopens.
 *
 * Rule 6 is the reason for rule 2, and `{open && <Panel/>}` breaks both at
 * once. React does not stash the DOM of a subtree you stopped rendering — the
 * inputs are destroyed, and with them everything the user typed. `hidden`
 * takes it off the screen and out of the accessibility tree while leaving it
 * exactly where it was.
 */
export default function KeepMountedAccordion({ items = [] }) {
  return null
}
