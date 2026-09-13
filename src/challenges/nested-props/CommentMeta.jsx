/**
 * Destructuring something that may not be there
 *
 * Topics: nested destructuring · optional chaining · plurals
 * Read:   https://react.dev/learn/passing-props-to-a-component
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
 *
 * @param {{body: string, author?: {name: string, avatar?: string}, replies?: []}} comment
 *
 * Rules:
 *  1. body, author name and reply count each in their own [data-testid]
 *  2. no author — "Anonymous"
 *  3. an avatar renders an <img> with an empty alt; no avatar, no <img>
 *  4. replies: 0 — "No replies", 1 — "1 reply", more — "{n} replies"
 *
 * The author is optional, so pulling `name` straight out of it in the
 * signature throws on the first comment that has none.
 */
export default function CommentMeta() {
  return null
}
