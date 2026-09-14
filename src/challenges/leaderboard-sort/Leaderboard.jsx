/**
 * Rank is a property of the score, not of the row
 *
 * Topics: sorting without mutating · competition ranking · tie-breaks
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
 * Read:   https://react.dev/learn/updating-arrays-in-state#sorting-an-array
 *
 * Props: { players: [{ id, name, score }] }
 *
 * Render:
 *   - buttons "By score" and "By name", the active one aria-pressed
 *   - one <li data-testid="row"> per player, reading "2 Bob 30" — rank, name,
 *     score
 *
 * Rules:
 *  1. "By score" is the order you start in: highest first.
 *  2. Two players on the same score are ordered by name, A to Z, every time.
 *  3. Players on the same score share a rank, and the rank after a tie skips
 *     the places they took: 1, 2, 2, 4.
 *  4. "By name" reorders the rows A to Z. Ranks do not change — Cid is fourth
 *     wherever his row happens to sit.
 *  5. The `players` array you were handed is never touched.
 *
 * Rule 3 is what rules the obvious answer out. Where a row sits and what a row
 * is worth are two different numbers that happen to agree for the first two
 * rows of most test data — and rule 4 pulls them apart completely.
 */
export default function Leaderboard({ players }) {
  return null
}
