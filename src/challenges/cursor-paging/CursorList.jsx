/**
 * Paging by cursor, where the server decides what comes next
 *
 * Topics: cursor pagination · appending · knowing when to stop
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 *
 * @param {(cursor: string | null) => Promise<{items: string[], nextCursor: string | null}>} loadPage
 *
 * Render the items as list items, a "Load more" button while there is more, and
 * the text "No more" once there is not.
 *
 * Rules:
 *  1. the first page is loaded on mount, with `null` as the cursor
 *  2. "Load more" passes the `nextCursor` from the page that came back last
 *  3. pages are appended — everything already on screen stays
 *  4. the button is disabled while a page is in flight
 *  5. `nextCursor === null` is the only thing that means the end
 *
 * A page can come back empty and still hand you a cursor — filtered-out rows,
 * a sparse index, a shard with nothing in it. Treat "no items" as the end and
 * the list stops three pages early, on a server that was about to give you the
 * rest.
 */
export default function CursorList({ loadPage }) {
  return null
}
