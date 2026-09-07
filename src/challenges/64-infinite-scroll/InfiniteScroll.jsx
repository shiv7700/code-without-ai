/**
 * LEVEL 64 — load the next page when the bottom comes into view
 *
 * Topics: IntersectionObserver · effect cleanup · guarding against double loads
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * Read:   https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref
 *
 * Props: { loadPage: (page: number) => Promise<string[]> }  — 1-based
 *
 * Render:
 *   - a <ul> of the loaded items, each in its own <li>
 *   - the text "Loading…" while a page is in flight
 *   - the text "No more" once the end is reached
 *   - <div data-testid="sentinel"> at the bottom, while there is more to load
 *
 * Rules:
 *  1. Page 1 loads on mount.
 *  2. New pages are APPENDED to what is already shown.
 *  3. When the sentinel intersects the viewport, load the next page.
 *  4. Only one page may be in flight at a time — a second intersection while
 *     loading must not fire a second request.
 *  5. A page that comes back empty means the end: show "No more", remove the
 *     sentinel, and stop asking.
 *  6. Unmounting disconnects the observer.
 *
 * Rule 4 is why the observer effect depends on the loading flag: while a page
 * is loading there is nothing to observe, so the effect's cleanup disconnects.
 * The tests replace IntersectionObserver with a fake — your job is to create,
 * observe and disconnect one correctly.
 */
export default function InfiniteScroll({ loadPage }) {
  return null
}
