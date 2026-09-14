/**
 * The element you want to watch is not there on the first render
 *
 * Topics: ref callbacks · observers · lazy creation
 * Read:   https://react.dev/reference/react-dom/components/common#ref-callback
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @param {(callback) => {observe, unobserve, disconnect}} createObserver
 *        handed in so a test can deliver entries by hand; a real caller passes
 *        `(cb) => new IntersectionObserver(cb)`
 * @returns {[Function, boolean]} the ref to put on the element, and whether it
 *          is currently intersecting
 *
 * Rules:
 *  1. before anything has been reported, the flag is false
 *  2. the element is observed as soon as it attaches
 *  3. an entry from the observer sets the flag to that entry's `isIntersecting`
 *  4. unmounting disconnects the observer
 *  5. an element that is not rendered until later is observed when it arrives —
 *     and one observer is created for the whole life of the component, not one
 *     per render and not one per element
 *
 * Rule 5 is the whole exercise. `useEffect(() => observer.observe(ref.current),
 * [])` runs once, on a render where the element does not exist yet, so
 * `ref.current` is null and nothing is ever watched. It works perfectly in the
 * demo where the element is always there, which is why it survives review.
 */
export function useIntersection(createObserver) {
  throw new Error('not implemented')
}
