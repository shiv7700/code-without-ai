/**
 * Five rows in the DOM, a thousand in the list, and one of them is chosen
 *
 * Topics: virtualised rendering · aria-setsize · scroll position as state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-posinset
 * Read:   https://react.dev/learn/render-and-commit
 *
 * Props: { options: string[], value, onChange, itemHeight = 20, height = 100,
 *          label = 'Fruit' }
 *
 * Rules:
 *  1. A role="listbox" named `label`, `height` pixels tall and scrolling, with
 *     something inside it as tall as `options.length * itemHeight` so the
 *     scrollbar tells the truth.
 *  2. Only the rows on screen are rendered. The first is
 *     `floor(scrollTop / itemHeight)`, and there are
 *     `ceil(height / itemHeight) + 1` of them — the extra one covers the row
 *     half off the bottom edge. The list ends where it ends.
 *  3. Each rendered row is a role="option" sitting `index * itemHeight` from
 *     the top, with aria-selected, and with aria-posinset and aria-setsize:
 *     the DOM holds six rows and the user is on number 901 of 1000, and only
 *     those two attributes can say so.
 *  4. Scrolling the box moves the window.
 *  5. Clicking a row chooses it.
 *  6. The chosen row is rendered wherever it is, even a thousand pixels
 *     outside the window — and it is rendered once, not twice when it happens
 *     to be on screen anyway.
 *
 * Rule 6 is the bit that virtualised selects forget. Anything pointing at the
 * chosen row — a screen reader's idea of where it is, an aria-activedescendant
 * from a combobox above it — is pointing at an element that no longer exists
 * the moment the user scrolls away from it.
 */
export default function VirtualListbox({
  options = [],
  value,
  onChange,
  itemHeight = 20,
  height = 100,
  label = 'Fruit',
}) {
  return null
}
