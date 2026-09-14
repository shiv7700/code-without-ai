/**
 * Type "av" quickly and you mean Avocado, type it slowly and you mean twice
 *
 * Topics: role=listbox · type-ahead buffer · state is a snapshot
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * Read:   https://react.dev/learn/state-as-a-snapshot
 *
 * Props: { options: string[], value, onChange, now, timeout = 500,
 *          label = 'Fruit' }
 *
 * Rules:
 *  1. A role="listbox" named `label`, one role="option" per entry, with
 *     aria-selected on the chosen one.
 *  2. Roving tabindex: the chosen option is the only tab stop, or the first
 *     option when nothing is chosen.
 *  3. ArrowDown and ArrowUp move the selection by one and stop at the ends —
 *     no wrapping. Home and End go to the ends. Moving also moves the focus.
 *  4. A letter selects the first option starting with what has been typed,
 *     ignoring case. No match leaves the selection alone.
 *  5. Letters typed one after another build up a search: "a" then "v" finds
 *     Avocado, not Apple.
 *  6. `now()` gives the time in milliseconds and `timeout` is how long the
 *     search survives. A letter arriving more than `timeout` after the last
 *     one starts again from nothing.
 *
 * Rule 5 is where it comes apart. The letter that just arrived is not in your
 * state yet — setting it does not change the variable you are holding, and the
 * search you run on the next line is a render behind. Type "av" and you land
 * on Apple, which is exactly what the user did not ask for.
 */
export default function TypeaheadListbox({
  options = [],
  value,
  onChange,
  now,
  timeout = 500,
  label = 'Fruit',
}) {
  return null
}
