/**
 * Six boxes that behave like one field
 *
 * Topics: refs to many nodes · keyboard events · the paste event
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
 *
 * @param {number} length     how many boxes
 * @param {(code: string) => void} onComplete
 *
 * Render:
 *   `length` text inputs, each aria-labelled "Digit 1", "Digit 2" and so on,
 *   each holding at most one character.
 *
 * Rules:
 *  1. A digit fills its box and focus moves to the next. On the last box focus
 *     stays where it is.
 *  2. Anything that is not a digit is refused — the box keeps what it had.
 *  3. Backspace on a filled box empties it and leaves focus alone. Backspace on
 *     an EMPTY box moves focus back one and empties that box instead.
 *  4. Pasting fills from the FIRST box onward, wherever the paste landed, drops
 *     any non-digits, and leaves focus on the box after the last one filled
 *     (or on the last box).
 *  5. `onComplete` is called with the whole code the moment the last empty box
 *     is filled, and not on the keystrokes before it.
 *
 * Rules 1 to 3 fall out of the two obvious handlers. Rule 4 does not: six
 * characters arriving at once is not six of anything you have already handled,
 * and the box they land in has room for one of them.
 */
export default function OtpInput({ length, onComplete }) {
  return null
}
