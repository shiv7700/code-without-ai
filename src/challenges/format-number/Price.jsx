/**
 * Intl.NumberFormat will not pad your decimals unless you ask it to
 *
 * Topics: Intl.NumberFormat · toFixed · formatting in render
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * Read:   https://react.dev/learn/javascript-in-jsx-with-curly-braces
 *
 * Rules:
 *  1. [data-testid="amount"] shows `amount` in the "en-US" locale, with
 *     thousands separators and exactly two decimals: 1234.5 → "1,234.50"
 *  2. `currency` goes in front with no space, and defaults to "$"
 *  3. a whole number still shows its decimals: 5 → "$5.00"
 *  4. 0 is an amount — "$0.00", not a dash
 *  5. `amount` missing or null → "—", no symbol
 *
 * `toFixed(2)` gets the decimals and loses the separators. A bare
 * `Intl.NumberFormat('en-US')` gets the separators and prints "1,234.5",
 * because its default is *up to* three decimals, not exactly two.
 */
export default function Price() {
  return null
}
