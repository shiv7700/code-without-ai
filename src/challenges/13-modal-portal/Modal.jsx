/**
 * LEVEL 13 — portals, escape hatches out of the React tree
 *
 * Topics: createPortal · useId · effect cleanup
 * Read:   https://react.dev/reference/react-dom/createPortal
 * Read:   https://react.dev/reference/react/useId
 *
 * Props: { open, onClose, title, children }
 *
 * Rules:
 *  1. `open = false` renders nothing at all
 *  2. the modal renders into `document.body` through a PORTAL — it must NOT be
 *     a descendant of the element that rendered <Modal>. (That is the whole
 *     reason portals exist: a parent with `overflow: hidden` or a z-index stack
 *     must not be able to clip your dialog.)
 *  3. the dialog element has role="dialog" and aria-modal="true"
 *  4. `title` renders in an <h2>, and the dialog is labelled by it (aria-labelledby)
 *  5. pressing Escape calls onClose
 *  6. mousedown on the backdrop calls onClose
 *  7. mousedown on the dialog content does NOT
 *  8. while open, document.body gets style overflow: hidden — and it is
 *     restored on close AND on unmount
 *
 * Rule 8 is the one people forget, and then the page behind the modal scrolls.
 *
 * Give the backdrop data-testid="backdrop".
 */
export default function Modal({ open, onClose, title, children }) {
  return null
}
