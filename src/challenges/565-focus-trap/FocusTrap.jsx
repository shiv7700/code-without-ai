/**
 * LEVEL 76 — the dialog nobody can tab out of
 *
 * Topics: focus management · portals · restoring what you took
 * Read:   https://react.dev/reference/react-dom/createPortal
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
 *
 * Props: { open, onClose, children }
 *
 * Render, when open:
 *   a <div data-testid="backdrop"> portalled into document.body, holding a
 *   <div role="dialog" aria-modal="true"> with the children inside.
 *
 * Rules:
 *  1. Closed renders nothing.
 *  2. Opening moves focus to the first focusable element inside.
 *  3. Tab moves to the next focusable element inside the dialog, and from the
 *     last one wraps to the first. Shift+Tab goes the other way. Focus never
 *     lands on anything outside.
 *  4. Escape calls `onClose`. So does a click on the backdrop — but NOT a
 *     click inside the dialog.
 *  5. Closing returns focus to whatever had it before the dialog opened.
 *  6. The key listener is removed when the dialog closes.
 *
 * jsdom does not move focus on Tab by itself — and neither does the browser
 * once you call `preventDefault`. Both mean the same thing: you query the
 * focusable elements, work out the next one, and call `.focus()` yourself.
 *
 * Rule 5 needs the previously-focused element captured on open — read
 * `document.activeElement` BEFORE you steal the focus.
 */
export default function FocusTrap({ open, onClose, children }) {
  return null
}
