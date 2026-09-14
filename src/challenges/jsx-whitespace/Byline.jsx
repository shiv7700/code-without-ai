/**
 * The spaces you typed are not the spaces you get
 *
 * Topics: JSX text · whitespace · string literals in braces
 * Read:   https://react.dev/learn/javascript-in-jsx-with-curly-braces
 * Read:   https://react.dev/learn/writing-markup-with-jsx
 *
 * @param {string} author
 * @param {number} minutes
 * @param {string} [tag]
 *
 * Rules:
 *  1. one <p>, reading exactly: By {author} · {minutes} min read
 *  2. the author is inside a <strong>, and nothing else is
 *  3. with a `tag`, an <em> follows reading "#react" for tag "react", with
 *     exactly one space before the hash
 *  4. no tag — the text ends after "read", with no trailing space
 *  5. every space is an ordinary space. No non-breaking spaces anywhere
 *
 * JSX is not HTML here. Whitespace between two elements is kept when it sits on
 * one line and thrown away entirely when it contains a newline — so the space
 * you can see in your editor disappears the moment the formatter breaks the
 * line, and the words run together. The fix is not to fight the formatter, and
 * it is not to reach for the entity either: rule 5 is there because that one
 * looks right on screen and reads wrong out loud.
 */
export default function Byline() {
  return null
}
