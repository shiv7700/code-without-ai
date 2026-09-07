/**
 * LEVEL 89 — a splitter you can drag
 *
 * Topics: document-level listeners · drag origin · effect cleanup
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
 * Read:   https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
 *
 * @param {{initial: number, min?: number, max?: number}} options
 * @returns {{size, dragging, onMouseDown}}
 *
 * Rules:
 *  1. `size` starts at `initial`.
 *  2. Nothing happens until `onMouseDown` fires. Mouse movement before that is
 *     none of your business.
 *  3. While dragging, `size` is the size AT GRAB TIME plus how far the pointer
 *     has moved from where it was grabbed. It follows the pointer — it does
 *     not add a delta per mousemove event.
 *  4. `size` is clamped to `min`…`max`.
 *  5. Mouseup ends the drag. Movement afterwards changes nothing.
 *  6. A second drag starts from wherever the first one left off.
 *  7. `dragging` says whether a drag is in progress.
 *  8. The document listeners are added when the drag starts and removed when
 *     it ends — and on unmount.
 *
 * The listeners go on `document`, not on the handle: the pointer leaves a
 * 4px-wide handle immediately, and a mouseup outside the window still ends
 * the drag.
 *
 * Rule 3 is what the origin ref is for: the pointer position and the size,
 * both captured on mousedown. Rule 6 is why that ref reads the LATEST size.
 */
export function useResizable({ initial, min, max }) {
  throw new Error('not implemented')
}
