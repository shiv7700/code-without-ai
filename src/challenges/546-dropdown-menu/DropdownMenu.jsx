/**
 * LEVEL 71 — a menu you can drive from the keyboard
 *
 * Topics: focus management · document listeners · the menu pattern
 * Read:   https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role
 *
 * Props: { items: string[], onSelect: (item) => void }
 *
 * Render:
 *   - a button reading "Options" with aria-haspopup="menu" and aria-expanded
 *   - while open, a <ul role="menu"> of <li role="menuitem">, one per item
 *
 * Rules:
 *  1. Closed to start. Closed means the menu is not in the DOM.
 *  2. Clicking the trigger opens it and moves FOCUS to the first item.
 *  3. ArrowDown / ArrowUp move focus between items, wrapping at both ends.
 *  4. Enter or a click selects: `onSelect(item)`, then close.
 *  5. Escape closes without selecting.
 *  6. Closing — by Escape or by selecting — returns focus to the trigger.
 *  7. A click anywhere outside closes it.
 *  8. Reopening starts at the first item again.
 *
 * Focus is a DOM thing, not a React thing: keep an array of refs, and move
 * focus in an effect when the active index changes. Rule 7 is level 12's
 * outside-click all over again — and its cleanup matters just as much here.
 */
export default function DropdownMenu({ items, onSelect }) {
  return null
}
