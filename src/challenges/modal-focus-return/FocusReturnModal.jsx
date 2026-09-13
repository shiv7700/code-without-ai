/**
 * Give focus back to whoever lent it to you
 *
 * Topics: refs for remembering · effect cleanup · focus management
 * Read:   https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Props: { open, onClose, title, children }
 *
 * Rules:
 *  1. Closed renders nothing.
 *  2. Open renders a role="dialog" with aria-modal="true", labelled by an
 *     <h2> holding `title`.
 *  3. On opening, focus moves to the first focusable element inside the
 *     dialog — or to the dialog itself if it has none.
 *  4. On closing, focus goes back to whatever had it at the moment the dialog
 *     opened.
 *  5. Unmounting while open returns focus too.
 *  6. Escape calls onClose.
 *
 * Rules 3 and 4 are a race if you read `document.activeElement` in the wrong
 * order: move focus first and the element you "remember" is the dialog's own
 * button, so closing sends focus into a node that no longer exists and the
 * browser drops the user back at the top of the document. Where you read it,
 * and where you keep it, are the challenge — a state variable re-renders and
 * gets stale; this wants the other one.
 */
export default function FocusReturnModal({ open, onClose, title, children }) {
  return null
}
