/**
 * Line four is still line four, even with a line above it
 *
 * Topics: longest common subsequence · dynamic programming · alignment
 * Read:   https://en.wikipedia.org/wiki/Longest_common_subsequence
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 *
 * Props: { before: string[], after: string[] }
 *
 * Render:
 *   one <li data-testid="row" data-kind="same|removed|added"> per aligned line,
 *   holding the text of that line.
 *
 * Rules:
 *  1. A line in both files appears once, as "same".
 *  2. A line only on the left is "removed"; only on the right, "added".
 *  3. As few removals and additions as possible — keep the longest run of
 *     lines the two files agree on.
 *  4. Where a block changed, every removal comes before every addition.
 *  5. An empty side makes the other side entirely added, or entirely removed.
 *
 * Walking both arrays with one index and comparing line i to line i passes the
 * first five of these. Insert a single line at the top and it decides the two
 * files have nothing in common — which is why the alignment is a search, not a
 * walk, and why the search needs an answer computed for every pair of
 * positions before you can start emitting rows.
 */
export default function DiffViewer({ before, after }) {
  return null
}
