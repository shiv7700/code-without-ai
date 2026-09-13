/**
 * Nothing to show and nothing that matched are different screens
 *
 * Topics: filtering in render · empty states · derived data
 * Read:   https://react.dev/learn/rendering-lists#filtering-arrays-of-items
 * Read:   https://react.dev/learn/thinking-in-react
 *
 * @param {{id: string, name: string}[]} items
 *
 * Rules:
 *  1. one <li> per item whose `name` contains `query`, ignoring case
 *  2. an empty `query` matches everything
 *  3. `items` empty → [data-testid="message"] reads "No items yet", no <ul>
 *  4. items exist but none match → the message reads `No results for "<query>"`,
 *     no <ul>
 *  5. when there are matches there is no message
 *
 * The obvious version filters first, checks what came back, and prints one
 * message for both cases. Rule 3 is about the data and rule 4 is about the
 * search box — the reader can only act on one of them, and it is not the same one.
 */
export default function ResultsList() {
  return null
}
