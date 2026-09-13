/**
 * LEVEL 63 — type-ahead with a keyboard
 *
 * Topics: filtered lists · keyboard handling · the combobox pattern
 * Read:   https://react.dev/learn/responding-to-events
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role
 *
 * Props: { options: string[] }
 *
 * Render:
 *   - an input with role="combobox" and aria-label="Search"
 *   - while open, a <ul role="listbox"> of <li role="option">, one per match
 *   - when nothing matches, the text "No results" and no options at all
 *
 * Rules:
 *  1. Closed until the user types. Closed means absent from the DOM.
 *  2. Matching is a case-insensitive substring, anywhere in the option.
 *  3. Exactly one option is active, carrying aria-selected={true}. It starts on
 *     the first match, and resets to the first match whenever the query changes.
 *  4. ArrowDown / ArrowUp move the active option, wrapping at both ends.
 *  5. Enter picks the active option: its text goes into the input, list closes.
 *  6. Clicking an option does the same.
 *  7. Escape closes the list and leaves the typed text alone.
 *
 * The matches are derived from the query — do not keep them in state. What IS
 * state: the query, whether the list is open, and which index is active.
 */
export default function Autocomplete({ options }) {
  return null
}
