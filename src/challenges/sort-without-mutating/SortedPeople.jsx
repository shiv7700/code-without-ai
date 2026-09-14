/**
 * Sorting a list you still have to be able to put back
 *
 * Topics: derived state · sort mutates · restoring the original order
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @param {{id: string, name: string, age: number}[]} people
 *
 * Render three buttons — "By name", "By age", "Original" — and a <ul> with one
 * <li> per person, as "<name> (<age>)".
 *
 * Rules:
 *  1. "By name" sorts A–Z by name, "By age" sorts youngest first
 *  2. "Original" puts the list back in the order `people` gave it
 *  3. two people of the same age keep the order they arrived in
 *  4. sorting by one key, then the other, then "Original", still restores it
 *  5. `people` is never reordered
 *
 * `people.sort(...)` is not a reading operation. It reorders the array in place
 * and hands you back the same array, so the original order you were relying on
 * for rule 2 is gone the first time anyone clicks — and because state is now
 * pointing at the array it was already pointing at, that first click often does
 * not even re-render.
 */
export default function SortedPeople({ people = [] }) {
  return null
}
