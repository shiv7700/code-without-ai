/**
 * LEVEL 25 — rendering an array of nodes, and one classic footgun
 *
 * Topics: rendering lists · keys · escaping user input
 * Read:   https://react.dev/learn/rendering-lists
 *
 * Props: { text, query }
 *
 * Render `text`, with every case-insensitive occurrence of `query` wrapped in
 * a <mark>. Everything else stays plain text.
 *
 * Rules:
 *  1. An empty or missing query renders the text as-is, with no <mark>.
 *  2. EVERY match is wrapped, not just the first.
 *  3. Matching ignores case, but the original casing is what gets rendered.
 *  4. The query is a literal string, not a pattern. A query of "." matches a
 *     full stop — it must not match every character.
 *
 * Rule 4 is where this one bites. If you build a RegExp out of the raw query,
 * any regex metacharacter the user types changes the meaning. Escape it first.
 */
export default function Highlight({ text, query }) {
  return null
}
