/**
 * One handler for the component's life, still counting from the right number
 *
 * Topics: useCallback · updater form · React.memo
 * Read:   https://react.dev/reference/react/useCallback
 * Read:   https://react.dev/learn/queueing-a-series-of-state-updates
 *
 * @param {React.ComponentType} Button  renders a button around its children
 *
 * Render the count in [data-testid="count"], starting at 0, and
 * `<Button onClick={...}>+1</Button>`.
 *
 * Rules:
 *  1. clicking adds one
 *  2. five clicks make five
 *  3. the `onClick` handed to Button is the SAME function on every render, so a
 *     memoised Button never re-renders when the count changes
 *  4. it adds to the CURRENT count, not the one from the render it was created
 *     in
 *
 * Rules 3 and 4 pull against each other, and only one of the two ways of
 * calling a setter satisfies both. Put `count` in the dependency array and
 * rule 3 goes; leave it out and the handler keeps adding one to the same stale
 * number, so the count sticks at 1 however many times you click.
 */
export default function ClickCounter({ Button }) {
  return null
}
