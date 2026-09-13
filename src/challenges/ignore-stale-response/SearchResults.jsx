/**
 * Whoever answers last is not necessarily whoever you asked last
 *
 * Topics: race conditions · effect cleanup · ignore flag
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 * Read:   https://react.dev/learn/lifecycle-of-reactive-effects
 *
 * @param {(q: string) => Promise<string[]>} search
 *
 * Rules:
 *  1. searches whenever `query` changes
 *  2. the results on screen always belong to the LATEST query
 *  3. an earlier request answering late is thrown away, not rendered
 *  4. a late FAILURE for an abandoned query is ignored too
 *
 * Requests do not queue. Type "a" then "ab" and the server may answer "ab"
 * first. Without the cleanup, "a"'s slow reply overwrites it a second later.
 */
export default function SearchResults() {
  return null
}
