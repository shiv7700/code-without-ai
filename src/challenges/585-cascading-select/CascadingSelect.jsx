/**
 * LEVEL 86 — one select that depends on another
 *
 * Topics: dependent fetches · clearing downstream state · races
 * Read:   https://react.dev/learn/synchronizing-with-effects#fetching-data
 * Read:   https://react.dev/reference/react-dom/components/select
 *
 * Props: {
 *   loadCountries: () => Promise<[{ id, name }]>,
 *   loadCities: (countryId) => Promise<[{ id, name }]>,
 *   onChange: ({ country, city }) => void
 * }
 *
 * Render:
 *   - a select labelled "Country", with a placeholder option "Choose a country"
 *   - a select labelled "City", with a placeholder option "Choose a city"
 *   - the text "Loading cities…" while cities are on their way
 *   - the text "No cities" when a country turns out to have none
 *
 * Rules:
 *  1. Countries load on mount.
 *  2. The city select is DISABLED until a country is chosen, and while its
 *     cities are loading.
 *  3. Choosing a country loads that country's cities.
 *  4. Changing the country clears the chosen city AND the old city list. The
 *     previous country's cities must never be selectable under the new one.
 *  5. A country with no cities says so — that is different from still loading.
 *  6. Choosing a city calls `onChange({ country, city })`.
 *  7. A slow response for a country you have moved on from is thrown away.
 *
 * Rule 7 is the reason the city fetch belongs in an effect keyed on the chosen
 * country. The cleanup runs the moment the country changes, which is exactly
 * when the old response stopped mattering.
 */
export default function CascadingSelect({ loadCountries, loadCities, onChange }) {
  return null
}
