/**
 * A window of pages that never runs off either end
 *
 * Topics: clamping · disabled controls · aria-current
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
 *
 * Props: { page, pageCount, onChange, window = 5 }
 *
 * Pages are 1-indexed.
 *
 * Rules:
 *  1. A <nav> labelled "Pagination".
 *  2. Four controls, named "First", "Previous", "Next", "Last".
 *  3. First and Previous are `disabled` on page 1. Next and Last are disabled
 *     on the last page.
 *  4. Between them, a button per page number — at most `window` of them,
 *     centred on `page`.
 *  5. The window never shrinks and never leaves the range. Near either end it
 *     slides rather than clipping: with window 5 and 10 pages, page 2 shows
 *     1–5 and page 9 shows 6–10.
 *  6. Fewer pages than `window` — show them all.
 *  7. The current page carries aria-current="page" and clicking it reports
 *     nothing. Everything else calls onChange with the page it goes to.
 *
 * Rule 5 is where this goes wrong. `page - 2 .. page + 2` runs off both ends,
 * and clamping the two ends separately gives you a three-button window at
 * page 1 that grows to five in the middle — the control changes width as you
 * walk through it.
 */
export default function Pagination({ page, pageCount, onChange, window = 5 }) {
  return null
}
