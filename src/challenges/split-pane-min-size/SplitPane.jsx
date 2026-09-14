/**
 * The pointer leaves the handle in the first millimetre of the drag
 *
 * Topics: role=separator · window listeners · effect cleanup
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * Read:   https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 *
 * Props: { width = 400, min = 80, initial = 200, left, right,
 *          label = 'Resize panels' }
 *
 * `width` is how wide the whole thing is, in pixels, so none of this needs
 * measuring anything.
 *
 * Rules:
 *  1. Two panes with the `left` and `right` content, and between them an
 *     element with role="separator", named `label`, aria-orientation
 *     "vertical", and a tab stop of its own.
 *  2. The separator reports the left pane's width: aria-valuenow, with
 *     aria-valuemin of `min` and aria-valuemax of `width - min`.
 *  3. ArrowLeft and ArrowRight move it ten pixels, clamped to that range.
 *     Home and End go to the two extremes.
 *  4. Pressing the pointer on the separator starts a drag. Moving the pointer
 *     — anywhere on the page, not just over the separator — sets the left
 *     pane's width to the pointer's x position, clamped the same way.
 *  5. Releasing the pointer ends the drag. A move after that changes nothing.
 *  6. Neither pane ever goes below `min`.
 *  7. Nothing is left listening once the drag ends, and nothing is left
 *     behind if the component goes away mid-drag.
 *
 * Rule 4 is what makes this awkward. A four-pixel handle cannot keep up with a
 * pointer being thrown across the screen, so the events you need arrive at the
 * document, not at the thing you pressed — and they have to stop arriving the
 * moment the drag ends, which is a different moment from the one that started
 * it.
 */
export default function SplitPane({
  width = 400,
  min = 80,
  initial = 200,
  left,
  right,
  label = 'Resize panels',
}) {
  return null
}
