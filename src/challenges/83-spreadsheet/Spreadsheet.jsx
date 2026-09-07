/**
 * LEVEL 83 — formulas, and the cycle that hangs your tab
 *
 * Topics: recursive evaluation · dependency chains · cycle detection
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * Render:
 *   a 3×3 grid, columns A–C and rows 1–3. Every cell holds an input labelled
 *   with its reference ("B2") and a <span data-testid="value-B2"> showing what
 *   the cell EVALUATES to.
 *
 * Rules:
 *  1. The input holds the raw text. The span holds the result. Typing
 *     "=A1+1" leaves "=A1+1" in the input.
 *  2. Text that does not start with "=" displays as itself.
 *  3. A formula is "=" followed by cell references and numbers joined by
 *     + and -. `=A1-4+1` works.
 *  4. A reference to a formula cell resolves that cell first, however long the
 *     chain. Changing the value at the bottom updates everything above it.
 *  5. Empty cells and text count as 0 inside a sum.
 *  6. A cell that depends on itself, directly or through others, shows
 *     "#CYCLE" instead of recursing forever. Cells that do not depend on the
 *     cycle keep working.
 *
 * The cells are ONE piece of state: a map of reference to raw text. Every
 * displayed value is derived. Storing computed values alongside the raw ones
 * is how a spreadsheet ends up showing stale numbers.
 *
 * Rule 6 wants the set of references already being evaluated, passed down the
 * recursion. Seeing a reference twice on one path is the cycle.
 */
export default function Spreadsheet() {
  return null
}
