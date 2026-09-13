/**
 * Two siblings per item, and no wrapper around them
 *
 * Topics: fragments · keyed fragments · rendering lists
 * Read:   https://react.dev/reference/react/Fragment
 * Read:   https://react.dev/learn/rendering-lists
 *
 * @param {{term: string, definition: string}[]} pairs
 *
 * Rules:
 *  1. one <dl>, and for each pair a <dt> then a <dd>
 *  2. those two are direct children of the <dl> — nothing wrapped around them
 *  3. so the dl's children read dt, dd, dt, dd, …
 *  4. no pairs — an empty <dl>, still rendered
 *
 * A <div> around each pair would be invalid markup here, and `<>…</>` cannot
 * take a key. There is a third spelling of a fragment for exactly this.
 */
export default function DefinitionList() {
  return null
}
