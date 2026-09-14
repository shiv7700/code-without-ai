/**
 * The tab stop has to remember where the user was
 *
 * Topics: role=toolbar · roving tabindex · disabled items
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 * Read:   https://react.dev/learn/referencing-values-with-refs
 *
 * Props: { items: [{ id, label, disabled }], onAction, label = 'Formatting' }
 *
 * Rules:
 *  1. A role="toolbar" named `label`, holding one <button> per item. Items
 *     marked disabled are really disabled.
 *  2. The toolbar is one tab stop. It starts on the first item that can take
 *     focus.
 *  3. ArrowRight and ArrowLeft move focus, wrapping at both ends, and step
 *     straight over anything disabled.
 *  4. Home and End go to the first and last item that can take focus.
 *  5. Pressing an item calls onAction with its id.
 *  6. The tab stop follows the user. Arrow across to the third button, Tab out
 *     to the rest of the page, come back, and focus returns to the third — not
 *     to the start.
 *
 * Rule 6 is what separates a roving tabindex from a decorative one. Derive the
 * tab stop from anything that resets — the first item, the first enabled item,
 * a value recomputed on every render — and the toolbar quietly forgets the
 * user's place the moment they look at something else.
 */
export default function Toolbar({ items = [], onAction, label = 'Formatting' }) {
  return null
}
