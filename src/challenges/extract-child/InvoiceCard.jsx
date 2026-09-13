/**
 * Where the props boundary goes when one component grows two jobs
 *
 * Topics: component boundaries · named exports · props design
 * Read:   https://react.dev/learn/your-first-component#nesting-and-organizing-components
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
 *
 * @param {{id: string, description: string, qty: number, unitPrice: number}[]} items
 *
 * Rules:
 *  1. one file, two exports: default `InvoiceCard` and named `LineItem`
 *  2. `LineItem` takes `item` and `currency` and renders one <li> reading
 *     `<description> — <qty> x <currency><unit> = <currency><line total>`,
 *     both amounts to two decimals
 *  3. `InvoiceCard` renders a <ul> of LineItems and [data-testid="total"] with
 *     the sum of the lines, same format
 *  4. `currency` defaults to "$" in both, and `LineItem` renders correctly on
 *     its own, with no InvoiceCard above it
 *
 * Rule 4 is the boundary, and it is the only reason to split at all. It is
 * tempting to hand the child the whole invoice and let it pick, or to keep the
 * currency in a constant both of them read — either works right up until the
 * row is rendered somewhere else, which was the point.
 */
export function LineItem() {
  return null
}

export default function InvoiceCard() {
  return null
}
