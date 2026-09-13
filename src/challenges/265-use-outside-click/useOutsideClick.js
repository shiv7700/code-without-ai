/**
 * LEVEL 12 — refs + real DOM listeners + cleanup
 *
 * Topics: refs to DOM nodes · event listeners · cleanup
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * Every dropdown, popover and menu you will ever build needs this.
 *
 * @param {React.RefObject} ref      the element that counts as "inside"
 * @param {Function} handler         called on a click outside it
 * @param {boolean} enabled          default true; false = listener is off
 *
 * Rules:
 *  1. a `mousedown` outside `ref.current` calls `handler(event)`
 *  2. a `mousedown` inside it does NOT
 *  3. `enabled = false` means no listener at all — not a listener that returns early
 *  4. the listener is removed on unmount (no leak, no calls after unmount)
 *  5. always calls the LATEST `handler`, without re-attaching the listener
 *     on every render
 *  6. `ref.current` being null is not a crash
 *
 * Use `mousedown`, not `click` — by the time `click` fires the element you
 * wanted to check may already have been removed from the DOM.
 */
export function useOutsideClick(ref, handler, enabled = true) {
  throw new Error('not implemented')
}
