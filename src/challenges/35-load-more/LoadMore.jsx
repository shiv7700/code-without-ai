/**
 * LEVEL 35 — paging through an async source without losing your place
 *
 * Topics: async state · appending to a list · disabled while pending
 * Read:   https://react.dev/reference/react/useState
 *
 * Props: { fetchPage }   fetchPage(pageNumber) -> Promise<{ items, hasMore }>
 *
 * Render the items as list items, plus a "Load more" button.
 *
 * Rules:
 *  1. Page 1 loads on mount. While it is in flight, show "Loading…".
 *  2. "Load more" fetches the NEXT page and APPENDS — earlier items stay put.
 *  3. The button is disabled while a fetch is in flight, so a double click
 *     cannot fetch the same page twice.
 *  4. Once a page comes back with hasMore false, the button is gone and
 *     "No more" is shown instead.
 *  5. A failed page shows "Something went wrong" and leaves the items already
 *     loaded on screen.
 *
 * Page number is state. So is the list, whether a fetch is in flight, and
 * whether there is more. Four small pieces beat one clever object.
 */
export default function LoadMore({ fetchPage }) {
  return null
}
