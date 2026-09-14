/**
 * Sort what you show, not what you were given
 *
 * Topics: purity · sorting a copy · derived rendering
 * Read:   https://react.dev/learn/keeping-components-pure
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @param {{title: string, plays: number}[]} tracks
 * @param {'plays'|'title'} [by='plays']
 *
 * Rules:
 *  1. an <ol> with one <li> per track
 *  2. sorted by `by` — plays highest first, title A to Z
 *  3. equal plays keep the order they arrived in
 *  4. each row reads "{n}. {title} — {plays}", where n is the track's position
 *     on the album AS GIVEN, counting from 1
 *  5. `tracks` comes back untouched: same order, same objects
 *  6. re-rendering with a different `by` sorts the original order again, not
 *     the order left over from last time
 *
 * Rule 4 is what makes rule 5 visible. Sorting in place is not a style
 * complaint — the array you reordered is the caller's array, so the track
 * numbers you print are positions in a running order nobody has seen, and the
 * parent that handed it to you now holds something it never set.
 */
export default function TrackList() {
  return null
}
