/**
 * LEVEL 87 — a parser that returns React elements
 *
 * Topics: recursive parsing · arrays of elements · keys
 * Read:   https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
 *
 * Props: { text: string }
 *
 * Render a <p> holding the parsed text. The four marks:
 *   **bold**            → <strong>
 *   *italic*            → <em>
 *   `code`              → <code>
 *   [label](https://…)  → <a href="https://…">
 *
 * Rules:
 *  1. Text with no marks renders as text. The markers themselves never appear
 *     in the output.
 *  2. Several marks in one string all render.
 *  3. `**` is bold, not two italics. When both could match at the same place,
 *     bold wins.
 *  4. Marks NEST: `**bold and *italic* inside**` puts the <em> inside the
 *     <strong>. A link's label can hold formatting too.
 *  5. Inside `code`, markers are literal characters. Nothing is parsed there.
 *  6. An unmatched marker is an ordinary character: `2 * 3 = 6` is text.
 *
 * Find the EARLIEST match among the rules, emit the text before it, recurse
 * into the match's contents (except for code), then recurse on the rest.
 * Scanning rule by rule instead — all the bolds, then all the italics — cannot
 * nest, and gets rule 5 wrong.
 *
 * Every element in a returned array needs a key. Derive them from the position
 * in the string; the index of a `.map` you do not have will not do.
 */
export default function Markdown({ text }) {
  return null
}
