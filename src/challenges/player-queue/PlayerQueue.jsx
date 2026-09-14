/**
 * A queue you can walk both ways, and a shuffle that deals rather than picks
 *
 * Topics: a queue and a history · injected shuffle · modes that change the rules
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * @param {{id: number, title: string}[]} tracks
 * @param {(list: T[]) => T[]} shuffle  the only source of randomness there is
 *
 * Render:
 *   <p data-testid="now"> holding the title, and buttons "Next", "Previous",
 *   "Shuffle" and "Repeat one". The two modes carry aria-pressed.
 *
 * Rules:
 *  1. It starts on the first track with the rest queued in order. At the end
 *     it comes round to the beginning again.
 *  2. "Previous" steps back through the tracks actually played, and stops on
 *     the first of them.
 *  3. Turning Shuffle on re-deals everything still to come — that is
 *     `shuffle(...)` and nothing else, no picking at random as you go.
 *  4. The track playing now is never in the deal, so nothing repeats until
 *     every other track has had its turn. When the deal runs out, deal again.
 *  5. "Repeat one" makes Next play the same track, without disturbing the
 *     queue or the history.
 *
 * Rule 4 is what separates a shuffle from a dice roll. Choosing at random on
 * each Next can give you the same track twice running and can leave one
 * unplayed all evening; dealing the pack means it cannot. The awkward part is
 * the moment the pack runs out, when the track in your hand has to stay out
 * of the new one.
 */
export default function PlayerQueue({ tracks, shuffle }) {
  return null
}
