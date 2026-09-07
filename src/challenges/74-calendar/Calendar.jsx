/**
 * LEVEL 74 — a month, laid out in weeks
 *
 * Topics: Date arithmetic · building a grid · month rollover
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
 *
 * Props: { month: '2026-02', onSelect: (isoDate) => void }
 *
 * Render:
 *   - buttons labelled "Previous month" and "Next month"
 *   - a heading reading "February 2026"
 *   - seven <span data-testid="weekday">: Mon Tue Wed Thu Fri Sat Sun
 *   - a <span data-testid="cell"> per grid square. A day cell holds a button
 *     with the day number; a padding cell is empty.
 *
 * Rules:
 *  1. Weeks start on MONDAY. `getDay()` returns 0 for Sunday, so it needs
 *     shifting.
 *  2. Blank cells pad the start so the 1st sits under its weekday, and pad the
 *     end so the total is a multiple of seven.
 *  3. The month length is real: 28, 29, 30 or 31. Work it out rather than
 *     hard-coding a table — `new Date(year, month + 1, 0).getDate()` gives the
 *     last day of a month, leap years included.
 *  4. Next and Previous move by one month, rolling the year over at both ends.
 *  5. Clicking a day calls `onSelect('2026-02-09')` — zero-padded ISO.
 *
 * The `month` prop is the STARTING month, not a controlled value. Navigation
 * lives in this component.
 */
export default function Calendar({ month, onSelect }) {
  return null
}
