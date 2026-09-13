/**
 * LEVEL 22 — derived state, again, with a cap
 *
 * Topics: derived state · controlled textarea · no redundant state
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 *
 * Props: { max = 100 }
 *
 * Render a <textarea> labelled "Message" and a counter with
 * data-testid="count" reading "12 / 100".
 *
 * Rules:
 *  1. The textarea is controlled.
 *  2. The counter shows "<length> / <max>".
 *  3. Typing cannot push the value past `max` — extra characters are dropped.
 *  4. When 10 or fewer characters remain, the counter gets data-warn="true".
 *     Above that it must not have the attribute at all.
 *
 * There is exactly ONE piece of state here: the text. Length, remaining and
 * the warning are all read off it during render. If you find yourself calling
 * setCount, stop.
 */
export default function CharCounter({ max = 100 }) {
  return null
}
