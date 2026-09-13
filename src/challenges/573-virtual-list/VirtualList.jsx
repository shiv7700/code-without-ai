/**
 * LEVEL 80 — render a hundred rows out of a hundred thousand
 *
 * Topics: windowing · scroll offsets · absolute positioning
 * Read:   https://react.dev/reference/react-dom/components/common#the-style-attribute
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop
 *
 * Props: { items, itemHeight, height }  — every row is the same height
 *
 * Render:
 *   - <div data-testid="viewport"> exactly `height` tall, scrollable
 *   - inside it <div data-testid="spacer">, `items.length * itemHeight` tall,
 *     so the scrollbar is the size it would be with everything rendered
 *   - only the rows near the viewport, each a
 *     <div data-testid="item" data-index={i}> positioned absolutely at
 *     `top: i * itemHeight`
 *
 * Rules:
 *  1. The first visible row is `Math.floor(scrollTop / itemHeight)`, and
 *     `Math.ceil(height / itemHeight)` rows fit on screen.
 *  2. Render one extra row above and below, so scrolling does not flash a gap.
 *  3. Clamp both ends — never a negative index, never past the last item.
 *  4. Rows that scrolled away are REMOVED from the DOM. That is the point.
 *  5. Each row's `top` comes from its real index, not from its position in the
 *     rendered slice. Get this wrong and every row stacks at the top.
 *  6. The number of rendered rows does not grow with the list length.
 *
 * The spacer is what makes the scrollbar honest. Without it the browser has
 * nothing to scroll, and `scrollTop` never leaves zero.
 */
export default function VirtualList({ items, itemHeight, height }) {
  return null
}
