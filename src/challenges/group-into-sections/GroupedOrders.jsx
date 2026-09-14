/**
 * Grouping is easy; keeping the order you grouped in is the exercise
 *
 * Topics: grouping in render · Map · object key order
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys#description
 * Read:   https://react.dev/learn/rendering-lists
 *
 * @param {{id: string, year: string, label: string}[]} orders
 *
 * Rules:
 *  1. one <section> per distinct year, each starting with an <h2> holding it
 *  2. sections appear in the order their first order appears in the array —
 *     not sorted, not reversed, not numeric
 *  3. inside each, a <ul> with that year's orders, keeping their relative order
 *  4. every order appears exactly once
 *  5. no orders — no sections, just [data-testid="empty"]
 *
 * Rule 2 is the whole thing, and the shortcut fails it in a way you will not
 * believe until you log it. A plain object does remember the order its keys
 * were added in — except for keys that look like array indices, which it walks
 * in ascending numeric order instead. Years look exactly like that. Group
 * newest-first data into an object and it comes back oldest-first, for free.
 */
export default function GroupedOrders() {
  return null
}
