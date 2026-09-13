/**
 * LEVEL 27 — select-all, and the third checkbox state
 *
 * Topics: derived state · Set in state · indeterminate is a DOM property
 * Read:   https://react.dev/reference/react-dom/components/input#controlling-a-checkbox
 *
 * Props: { options: [{ id, label }], onChange }
 *
 * Render a "Select all" checkbox plus one checkbox per option, each labelled
 * with its label.
 *
 * Rules:
 *  1. Nothing is checked at first.
 *  2. Ticking an option calls onChange with the array of selected ids, in the
 *     order the options were given.
 *  3. "Select all" ticks everything; when everything is ticked it unticks
 *     everything.
 *  4. "Select all" is checked only when EVERY option is. It is indeterminate
 *     when some — but not all — are ticked.
 *
 * `indeterminate` cannot be set through JSX. It is a DOM property, not an
 * attribute, so it needs a ref. That is the whole point of rule 4.
 */
export default function CheckboxGroup({ options, onChange }) {
  return null
}
