/**
 * LEVEL 72 — vote once, then see where you stand
 *
 * Topics: two views of one state · derived percentages · one-way doors
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 *
 * Props: { question, options: [{ id, label, votes }] }
 *
 * Render:
 *   - the question as a heading
 *   - BEFORE voting: one button per option, labelled with the option
 *   - AFTER voting: one <li data-testid="result"> per option, reading
 *     "Label 60%", with data-chosen={true} on the one you picked
 *   - always <p data-testid="total"> reading "4 votes"
 *
 * Rules:
 *  1. No results are shown before voting, and no buttons after.
 *  2. Your vote counts — the total goes up by one and your option gains one.
 *  3. Percentages are `Math.round(votes / total * 100)`.
 *  4. Exactly one option is marked as your choice.
 *  5. Voting is a one-way door. There is no way to vote a second time.
 *
 * The counts are state (they change). The percentages and the total are not —
 * they are arithmetic on the counts, done during render.
 */
export default function Poll({ question, options }) {
  return null
}
