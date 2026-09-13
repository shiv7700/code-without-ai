/**
 * Hover is not the only way in
 *
 * Topics: focus events · aria-describedby · useId
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 * Read:   https://react.dev/reference/react/useId
 *
 * Props: { text, children }
 *
 * Render a <button> containing `children`, and the tooltip beside it.
 *
 * Rules:
 *  1. The tooltip is not in the DOM until it is needed.
 *  2. Hovering the button shows it, as role="tooltip".
 *  3. Focusing the button shows it too.
 *  4. Leaving — unhover or blur — hides it again.
 *  5. While it is open, the button is described by it: aria-describedby points
 *     at the tooltip's id.
 *  6. While it is closed, the button has no aria-describedby at all.
 *  7. Escape hides it, even though focus stays on the button.
 *
 * Rule 3 is the whole point: a tooltip wired to mouseenter alone does not
 * exist for anyone tabbing through the page. Rule 6 is its sibling — an
 * aria-describedby pointing at an element you unmounted describes nothing,
 * and nothing is what gets announced.
 */
export default function Tooltip({ text, children }) {
  return null
}
