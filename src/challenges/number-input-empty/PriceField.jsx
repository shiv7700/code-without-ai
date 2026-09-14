/**
 * The box you cannot empty
 *
 * Topics: controlled inputs · raw text vs parsed value · NaN
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 *
 * @param {(value: number|null) => void} onChange
 *
 * Render an input labelled "Price" and the parsed value in
 * [data-testid="parsed"] — the number, or "none".
 *
 * Rules:
 *  1. the box shows exactly what was typed, character for character
 *  2. "3." stays "3." while it is still being typed, and a lone "0" does not
 *     disappear
 *  3. an empty box parses to null
 *  4. text that is not a number parses to null as well — never NaN
 *  5. `onChange` gets the parsed value on every keystroke
 *
 * Keeping the number in state is what breaks it. `Number(e.target.value)` turns
 * "" into 0, so the box refills itself the instant it is emptied, and it turns
 * "3." into 3, so the decimal point is swallowed as it is typed. The text and
 * the number are two different things, and only one of them is state.
 */
export default function PriceField({ onChange }) {
  return null
}
