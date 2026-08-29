/**
 * LEVEL 15 — derived state that has to stay in range
 *
 * Topics: derived state · adjusting state when props change
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {{ items: any[], pageSize?: number, initialPage?: number }} config
 * @returns {{
 *   page, pageItems, totalPages,
 *   setPage, next, prev,
 *   canNext, canPrev,
 * }}
 *
 * Pages are 1-indexed. pageSize defaults to 10, initialPage to 1.
 *
 * Rules:
 *  1. `pageItems` is the slice for the current page
 *  2. `totalPages` = ceil(items.length / pageSize), minimum 1 (empty list is
 *     still "page 1 of 1", not "page 1 of 0")
 *  3. `next` / `prev` never leave the range — no page 0, no page 11 of 10
 *  4. `setPage` clamps too: setPage(999) lands on the last page, setPage(-5) on 1
 *  5. `canPrev` is false on page 1, `canNext` false on the last page
 *  6. THE BUG EVERYONE SHIPS: you are on page 5, then the list shrinks to 12
 *     items (someone typed in a search box). Page 5 no longer exists. `page`
 *     must clamp back into range and `pageItems` must not be empty.
 *  7. all returned functions have stable identities
 *
 * Rule 6 is why this is not just Math. Think about where that correction
 * happens — during render from derived values, or in an effect after the fact?
 * One of those flashes an empty list at the user for a frame.
 */
export function usePagination({ items, pageSize = 10, initialPage = 1 }) {
  throw new Error('not implemented')
}
