/**
 * Arrow keys walk the headers, and stop at the headers
 *
 * Topics: keyboard navigation · refs to a list of DOM nodes · event targets
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#keyboardinteraction
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
 *
 * Props: { items: [{ id, title, body }] }  — `body` is a React node
 *
 * Rules:
 *  1. One <button> header per item, with aria-expanded. Clicking toggles that
 *     item's panel; several may be open at once.
 *  2. Only the open panels are in the DOM.
 *  3. With a header focused, ArrowDown moves focus to the next header and
 *     ArrowUp to the previous one.
 *  4. It wraps: down from the last lands on the first, up from the first lands
 *     on the last.
 *  5. Home focuses the first header, End the last.
 *  6. Arrows move focus and nothing else. They never open or close a panel.
 *  7. The same keys pressed inside an open panel do nothing at all.
 *
 * Rule 7 is the one that bites. One keydown handler on the wrapping <div> is
 * less code and catches every key that bubbles up out of the panel — so a user
 * pressing ArrowUp to move the caret in a textarea is thrown back onto a
 * header instead. Where the listener sits is the whole answer.
 */
export default function KeyboardAccordion({ items = [] }) {
  return null
}
