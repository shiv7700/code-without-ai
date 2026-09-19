/**
 * Three panels, three requests, and one failure that stays in its own box
 *
 * Topics: parallel loads · per-panel state · a hook in its own file
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://react.dev/reference/react/useEffect
 *
 * Rules:
 *  1. takes `load` — { users, sales, errors }, each a function returning a promise
 *  2. three regions labelled "Users", "Sales" and "Errors"
 *  3. each shows "Loading…" until its own request answers, then the value
 *  4. a request that rejects shows "Could not load" in that panel alone
 *  5. every loader is called exactly once, whatever the others do
 *
 * Two files. The waiting is the same every time, so it lives in the hook; the
 * layout is the component's. Rule 5 is the one to design for — three panels
 * that each start their own request must not restart it when a sibling
 * finishes, and what decides that is the effect, not the markup.
 */
export default function Overview() {
  return null
}
