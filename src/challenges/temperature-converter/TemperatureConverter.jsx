/**
 * Two boxes, one value
 *
 * Topics: single source of truth · derived state · raw text
 * Read:   https://react.dev/learn/sharing-state-between-components
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state
 *
 * @param {(reading: {value: string, scale: 'c'|'f'}) => void} onChange
 *
 * Render inputs labelled "Celsius" and "Fahrenheit", both empty to start with.
 *
 * Rules:
 *  1. typing in one box fills the other with the converted temperature,
 *     rounded to the nearest whole number
 *  2. the box being typed in keeps EXACTLY what was typed — "36.6" stays
 *     "36.6", "3." stays "3."
 *  3. text that is not a number leaves the other box empty
 *  4. emptying one box empties the other
 *  5. `onChange` reports the raw text and which scale it was typed in
 *
 * F = C × 9/5 + 32. Two states kept in step is the trap: "36.6" in Celsius
 * writes 98 into Fahrenheit, 98 converts back to 37, and the box under the
 * cursor rewrites itself as you type. Only one of the two boxes can be the
 * truth at a time — and which one it is changes as you click between them.
 */
export default function TemperatureConverter({ onChange }) {
  return null
}
