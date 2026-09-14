/**
 * A bye is an empty seat, not an opponent
 *
 * Topics: derived rounds · recursion over a tree · missing versus undecided
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
 *
 * @param {string[]} players  any number of them, not just a power of two
 *
 * Render:
 *   - one <li data-testid="match" data-round="0"> per match, rounds in order
 *   - each seat is a <button> with the entrant's name, or a <span> reading
 *     "TBD" if the match feeding it has not been decided
 *   - a match with only one seat shows that seat and a <span> reading "bye"
 *   - <p data-testid="champion"> once, and only once, there is one
 *
 * Rules:
 *  1. The first round pairs players up in the order given: first against
 *     second, third against fourth, and so on.
 *  2. An entrant with nobody to play has a bye and goes through untouched —
 *     there is no button to press.
 *  3. Later rounds pair the winners of the matches below them, in the same
 *     first-against-second way. A round has half as many matches as the one
 *     before it, rounded up, until there is one.
 *  4. Clicking a name makes them the winner and fills their seat above.
 *  5. The winner of the last match is the champion.
 *
 * A seat with nobody in it yet and a seat that does not exist look identical
 * on screen and behave nothing alike. Pad the draw out with invented opponents
 * and the byes become matches somebody has to click through; drop the odd
 * player and they never play at all. Keep the winners you were told about and
 * work everything else out from the count.
 */
export default function Bracket({ players }) {
  return null
}
