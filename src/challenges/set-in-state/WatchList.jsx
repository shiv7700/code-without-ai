/**
 * A Set in state is replaced, never added to
 *
 * Topics: Set in state · reference equality · what the mutating methods return
 * Read:   https://react.dev/learn/updating-objects-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * @param {{id: string, title: string}[]} episodes
 * @param {Set<string>} initial  the ids already watched
 * @param {(watched: Set<string>) => void} onChange
 *
 * Render a checkbox per episode, labelled with its title, plus the tally in
 * [data-testid="count"] as "2 of 5 watched".
 *
 * Rules:
 *  1. a box is ticked when its id is in the Set
 *  2. ticking or unticking flips that id, and the tally follows
 *  3. every change calls `onChange` with a Set — a NEW one each time
 *  4. the Set handed in as `initial` is never added to or deleted from
 *  5. tick, untick, tick again — it keeps working
 *
 * `new Set(prev).add(id)` and `prev.add(id)` both evaluate to a Set, which is
 * exactly what makes the second one so hard to spot: state is "updated" with
 * the object React is already holding, so nothing re-renders and the tick comes
 * straight back off. `delete` is worse — it evaluates to a boolean, and that is
 * what lands in state.
 */
export default function WatchList({ episodes = [], initial, onChange }) {
  return null
}
