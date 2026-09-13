/**
 * LEVEL 77 — the table when the data lives on a server
 *
 * Topics: server-side sort and paging · stale responses · selection by id
 * Read:   https://react.dev/reference/react/useEffect#fetching-data-with-effects
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 *
 * Props: {
 *   fetchRows: ({ page, sort, dir }) => Promise<{ rows, total }>,
 *   pageSize
 * }
 *   Rows are `{ id, name, age }`. `sort` is 'name' | 'age' | null,
 *   `dir` is 'asc' | 'desc' | null. `page` is 1-based.
 *
 * Render:
 *   - a table. Header cells for "Name" and "Age", each holding a button, each
 *     carrying aria-sort="ascending" | "descending" | "none".
 *   - one <tr data-testid="row"> per row: a checkbox labelled with the name,
 *     then the name, then the age.
 *   - the text "Loading…" while a request is in flight
 *   - <p data-testid="selected"> reading "2 selected"
 *   - "Previous" / "Next" buttons and <span data-testid="page"> reading "2 of 3"
 *
 * Rules:
 *  1. Page 1 is requested on mount with no sort.
 *  2. Sorting and paging are the SERVER's job. Never sort or slice the rows
 *     you were handed — ask again with different arguments.
 *  3. A header sorts ascending; the same header again flips to descending; a
 *     different header starts at ascending.
 *  4. Changing the sort resets to page 1.
 *  5. "Previous" is disabled on page 1, "Next" on the last page. The last page
 *     comes from `total` and `pageSize`.
 *  6. Selection is by row id, and survives paging away and back. The rows on
 *     screen change; the selection does not.
 *  7. A response for a request you have moved on from is thrown away. Page 2
 *     being slow must never overwrite the page 1 you asked for afterwards.
 *
 * Rule 7 is level 05's race again, and it is why the fetch belongs in an effect
 * keyed on (page, sort) with a cleanup — not in the click handlers.
 */
export default function ServerTable({ fetchRows, pageSize }) {
  return null
}
