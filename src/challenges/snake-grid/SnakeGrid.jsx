/**
 * The tail has already left by the time the head arrives
 *
 * Topics: reacting to a prop change · array as a queue · off-by-one collision
 * Read:   https://react.dev/learn/synchronizing-with-effects
 * Read:   https://react.dev/learn/referencing-values-with-refs
 *
 * @param {number} size     the board is size × size
 * @param {[number, number][]} snake  starting cells, head first
 * @param {[number, number][]} food
 * @param {number} tick     goes up by one every time the snake should move
 *
 * Render:
 *   - a focusable element aria-labelled "Board"
 *   - size × size cells, each <div data-testid="2,3"> with
 *     data-kind="head" | "snake" | "food" | "empty"
 *   - <p data-testid="status">, empty until the game ends, then "Game over"
 *
 * Rules:
 *  1. It starts heading right.
 *  2. Every increase in `tick` moves the head one cell and the tail lets go of
 *     its last one. The first render is not a move.
 *  3. Arrow keys change direction. The exact opposite of the way it is going
 *     is ignored.
 *  4. Landing on food grows the snake by one — the tail stays put that tick —
 *     and that food is eaten.
 *  5. Leaving the board, or landing on the snake, is "Game over", and further
 *     ticks change nothing.
 *
 * Rule 5 has an exception hidden in rule 2. A snake chasing its own tail is
 * legal: by the moment the head lands there, the tail has already moved on.
 * Test the head against where the snake is about to be, not where it is — and
 * notice that if it just ate, those are the same thing.
 */
export default function SnakeGrid({ size, snake, food, tick }) {
  return null
}
