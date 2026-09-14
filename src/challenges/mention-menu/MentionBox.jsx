/**
 * The menu belongs to the word you are typing, not to the box
 *
 * Topics: deriving UI from text · regular expressions · word boundaries
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Assertions
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 *
 * Props: { people: [{ id, name }] }
 *
 * Render:
 *   a textarea labelled "Comment", and — only while a mention is being typed —
 *   a <ul role="listbox"> of <li role="option"> holding matching names.
 *
 * Rules:
 *  1. A mention is an "@" at the start of a word, followed by letters, at the
 *     very end of what has been typed so far.
 *  2. The menu lists people whose name starts with those letters, ignoring
 *     case, in the order they were given.
 *  3. No matches means no menu. A space after the letters means no menu.
 *  4. An "@" with a letter in front of it is part of an address and opens
 *     nothing.
 *  5. Choosing someone replaces the mention with "@Alan " — name and a space —
 *     and the menu closes.
 *
 * There is nothing to open and close here. Whether the menu is up is a fact
 * about the current text, and the last test is the one that catches you
 * storing it instead: an "@ada" typed a sentence ago still matches a search
 * for "is there an @ in this string".
 */
export default function MentionBox({ people }) {
  return null
}
