/**
 * The second dropdown depends on the first, and the network is not in order
 *
 * Topics: dependent fetch · clearing downstream state · stale responses
 * Read:   https://react.dev/reference/react/useEffect
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * Rules:
 *  1. takes `loadCities(country)` — returns a promise of an array of names
 *  2. a "Country" dropdown of IN, DE and BR, starting at IN
 *  3. a "City" dropdown holding whatever loaded for the chosen country
 *  4. while its list is loading the city dropdown is disabled and empty
 *  5. changing country clears the chosen city at once, not when the list lands
 *  6. a slow earlier answer must never replace a newer one
 *
 * Rule 6 is the whole exercise. Switch country twice quickly and both requests
 * are out; if the first one comes back last, an honest-looking implementation
 * shows the wrong country's cities and nothing ever tells you.
 */
export default function RegionPicker() {
  return null
}
