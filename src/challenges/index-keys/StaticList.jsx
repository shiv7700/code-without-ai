/**
 * The index is a fine key when nothing ever moves
 *
 * Topics: keys · index as key · static lists
 * Read:   https://react.dev/learn/rendering-lists#where-to-get-your-key
 * Read:   https://react.dev/learn/preserving-and-resetting-state
 *
 * @param {string[]} lines
 *
 * Rules:
 *  1. an <ol> with one <li> per entry, in the order given
 *  2. repeats are all rendered — ["a", "b", "a"] is three lines, not two
 *  3. an empty array still renders the <ol>, with nothing in it
 *  4. the rows carry no state and the list is never reordered, so the index is
 *     the key here — this is the case list-keys was warning you off
 *
 * Rule 2 is the trap, and it arrives dressed up as good practice. Keying on the
 * string reads tidier than keying on the index right until the array repeats
 * itself, and the fix that suggests itself next — dedupe so the keys are
 * unique — quietly drops a line the caller asked for.
 */
export default function StaticList() {
  return null
}
