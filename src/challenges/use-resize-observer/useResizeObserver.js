/**
 * Watching an element, and remembering to stop watching the last one
 *
 * Topics: ref callbacks · observer cleanup · swapping the observed node
 * Read:   https://react.dev/reference/react-dom/components/common#ref-callback
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @param {(callback) => {observe, unobserve, disconnect}} createObserver
 *        handed in so a test can deliver entries by hand
 * @returns {[Function, {width, height}|null]} the ref, and the last reported size
 *
 * Rules:
 *  1. the size is null until something has been reported
 *  2. the element is observed as soon as it attaches
 *  3. an entry sets the size from its `contentRect`
 *  4. exactly one observer is created, however many times the component renders
 *  5. when a DIFFERENT element takes its place, the old one is unobserved and
 *     the new one is observed
 *  6. unmounting disconnects the observer
 *
 * Rule 5 is the leak. An observer is not a subscription you can forget about —
 * it holds the node, so a component that swaps its child every render quietly
 * accumulates dead elements and keeps being told about their sizes. Nothing
 * fails; the numbers on screen just start belonging to an element nobody can
 * see any more.
 */
export function useResizeObserver(createObserver) {
  throw new Error('not implemented')
}
