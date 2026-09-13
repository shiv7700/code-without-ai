/**
 * LEVEL 5 — useEffect, async state, and the race condition
 *
 * Topics: useEffect · cleanup · race conditions
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#fetching-data
 *
 * Props: { userId: number, fetchUser: (id) => Promise<{ name: string }> }
 *
 * Render exactly one of:
 *   - "Loading..."                      while a request is in flight
 *   - the user's name                   on success
 *   - "Something went wrong"            on failure
 *
 * Rules:
 *  1. fetch on mount, and again whenever `userId` changes
 *  2. going back to loading when `userId` changes — the old name must not linger
 *  3. THE RACE: request for user 1 is slow, user 2 is fast. If `userId` flips
 *     1 → 2 and the responses land out of order, the screen must end up showing
 *     user 2. A late response for a userId you no longer care about is garbage
 *     — drop it.
 *
 * Rule 3 is the whole point. Almost every fetch-in-useEffect in the wild is
 * broken this way. The fix lives in the effect's cleanup function.
 */
export default function UserCard({ userId, fetchUser }) {
  return null
}
