/**
 * LEVEL 82 — editing a tree without mutating it
 *
 * Topics: recursive components · immutable tree updates · one open form
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://react.dev/learn/preserving-and-resetting-state
 *
 * Props: { comments: [{ id, text, replies: [] }] }
 *
 * Render:
 *   - every comment as <li data-testid="comment" data-id={id}> holding a <p>
 *     with its text, a button reading "Reply to <text>", and one reading
 *     "Delete <text>". Replies nest inside their parent's <li>.
 *   - <p data-testid="count"> reading "5 comments" — the whole tree
 *   - when replying: a textarea labelled "Reply" and a "Post" button
 *
 * Rules:
 *  1. Comments nest as deep as the data does.
 *  2. At most ONE reply box is open at a time. Opening another closes the first.
 *  3. Posting appends the new comment to the END of that comment's replies,
 *     closes the box, and bumps the count.
 *  4. An empty or whitespace-only reply posts nothing.
 *  5. Deleting a comment removes its entire subtree.
 *  6. The tree is never mutated. Insert and remove return new arrays and new
 *     nodes along the path — everything off the path stays the same object.
 *
 * Rule 6 is level 54's structural sharing, now over a tree of arrays. Rule 2
 * is why "which comment is being replied to" belongs to the thread, not to
 * each comment.
 */
export default function CommentThread({ comments }) {
  return null
}
