/**
 * Changing the filter puts you back on page one — in one go
 *
 * Topics: state that changes together · stale responses · not resetting in an effect
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 *
 * @param {({filter, page}) => Promise<{rows: string[], pages: number}>} fetchPage
 *
 * Render the rows as list items, an input labelled "Filter", "Previous" and
 * "Next" buttons, <span data-testid="page"> reading "2 of 3", and the text
 * "Loading…" while a request is in flight.
 *
 * Rules:
 *  1. `{ filter: '', page: 1 }` is asked for on mount
 *  2. Previous and Next move the page and ask again
 *  3. changing the filter goes back to page 1
 *  4. that change asks exactly once — never for the page you happened to be on
 *  5. the request already in flight is abandoned. Its rows never render, and
 *     neither does its page count
 *
 * Reset the page in an effect on `filter` and both halves go wrong at once:
 * there is a render where the new filter is paired with the old page number, so
 * the fetch for `{ filter: 'x', page: 4 }` goes out before the one you wanted —
 * and if it answers second, that is what the user reads.
 */
export default function FilteredTable({ fetchPage }) {
  return null
}
