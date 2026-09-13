/**
 * Only truncate what does not fit
 *
 * Topics: boundary conditions · aria-expanded · derived rendering
 * Read:   https://react.dev/learn/conditional-rendering
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded
 *
 * Props: { text, limit = 100 }
 *
 * Put the visible text in <span data-testid="text">.
 *
 * Rules:
 *  1. Text no longer than `limit` renders whole, and there is no button at all.
 *  2. Longer text renders its first `limit` characters followed by "…".
 *  3. The button reads "more" while collapsed and "less" while expanded, and
 *     carries aria-expanded.
 *  4. Expanded shows the whole text — no ellipsis.
 *  5. The "…" is decoration. It is not one of the `limit` characters.
 *
 * "No longer than" means <=. Text of exactly `limit` characters fits, so
 * cutting it produces the same string plus a "…" that promises more and
 * a "more" button that expands to nothing.
 */
export default function TruncateText({ text = '', limit = 100 }) {
  return null
}
