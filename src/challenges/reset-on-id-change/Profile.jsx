/**
 * The old answer must not sit under the new question
 *
 * Topics: resetting state · effect dependencies · loading between records
 * Read:   https://react.dev/learn/preserving-and-resetting-state
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 *
 * @param {(id: number) => Promise<{name: string}>} load
 *
 * Rules:
 *  1. shows the name once it arrives
 *  2. a new `userId` goes back to "Loading…" straight away
 *  3. the PREVIOUS user's name is never on screen while the new one loads
 *  4. it reloads for the new id
 *
 * Rule 3 is the bug worth feeling. Leaving the old name up while the next
 * request runs is how a profile page shows someone else's details.
 */
export default function Profile() {
  return null
}
