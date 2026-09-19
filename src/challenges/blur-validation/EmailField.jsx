/**
 * Do not tell someone they are wrong while they are still typing
 *
 * Topics: onBlur · touched state · derived visibility
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * Rules:
 *  1. a text box labelled "Email", no message to begin with
 *  2. nothing is said while typing, however wrong the value is
 *  3. once the box has been left, a value without "@" shows "Enter a valid email"
 *  4. fixing it afterwards clears the message as you type
 *
 * Two facts decide whether the message is on screen, and only one of them is
 * about the text. Whether to show it is not a third thing to store — storing
 * it is how the message ends up disagreeing with the box.
 */
export default function EmailField() {
  return null
}
