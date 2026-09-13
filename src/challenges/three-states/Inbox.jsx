/**
 * Loading, error, empty and data are four screens, not four flags
 *
 * Topics: state machine · mutually exclusive states · empty state
 * Read:   https://react.dev/learn/choosing-the-state-structure
 * Read:   https://react.dev/learn/conditional-rendering
 *
 * @param {() => Promise<string[]>} load
 *
 * Rules:
 *  1. exactly one of [data-testid] "loading", "error", "empty" or "list" is
 *     on screen at any moment — never two
 *  2. resolving with [] is "empty", not an empty list
 *  3. a failure is "error", whatever came before it
 *  4. keep ONE state value holding which screen you are on, not three booleans
 *
 * Three booleans have eight combinations and only four of them mean anything.
 * The other four are the bugs you cannot reproduce.
 */
export default function Inbox() {
  return null
}
