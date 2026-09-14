/**
 * The header checkbox answers for the page, not for the table
 *
 * Topics: indeterminate checkbox · DOM properties vs attributes · derived state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate
 * Read:   https://react.dev/reference/react-dom/components/input
 *
 * Props: { rows: [{ id, name }], pageSize = 2 }
 *
 * Rules:
 *  1. One page of rows at a time, each with a checkbox named after the row.
 *     "Previous page" and "Next page" move between them, and are disabled at
 *     the ends.
 *  2. A checkbox named "Select all on this page" sits above them. It is
 *     checked when every visible row is chosen, unchecked when none is, and
 *     partly checked — the third state — when some are.
 *  3. Ticking it chooses every row on this page. Unticking it unchooses every
 *     row on this page, and touches nothing anywhere else.
 *  4. Choices survive paging. Come back to a page and it looks as you left it.
 *  5. A count reads "N selected", counting everything chosen across all pages,
 *     not what happens to be on screen.
 *
 * The third state in rule 2 is not an attribute and there is no JSX prop for
 * it. It only exists on the DOM node, which means the one bit of this
 * component that cannot be expressed as markup has to be pushed onto the
 * element after React has rendered it — and pushed again every time the answer
 * changes.
 */
export default function PagedSelection({ rows = [], pageSize = 2 }) {
  return null
}
