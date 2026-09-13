/**
 * The browser wants to reload the page — talk it out of that
 *
 * Topics: form submit · preventDefault · controlled input
 * Read:   https://react.dev/learn/responding-to-events#preventing-default-behavior
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
 *
 * @param {(query: string) => void} onSearch
 *
 * Render a <form> holding an input labelled "Query" and a submit button
 * labelled "Search".
 *
 * Rules:
 *  1. the input is controlled
 *  2. submitting calls `onSearch` with the trimmed query, then empties the field
 *  3. a blank or whitespace-only query calls nothing
 *  4. the submit event's default is always prevented, blank query or not
 *  5. Enter inside the field submits, exactly like the button does
 *
 * Rule 5 is the one that catches the shortcut. Hang the work off the button's
 * onClick and the mouse path works perfectly while Enter reloads the page —
 * which in a test looks like a passing suite and a field that mysteriously
 * refuses to clear.
 */
export default function SearchForm({ onSearch }) {
  return null
}
