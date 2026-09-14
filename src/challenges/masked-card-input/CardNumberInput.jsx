/**
 * Reformat as they type, and the caret jumps to the end
 *
 * Topics: controlled input · selection range · useLayoutEffect
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
 * Read:   https://react.dev/reference/react/useLayoutEffect
 *
 * Props: { onChange, label = 'Card number' }
 *
 * Rules:
 *  1. A text box labelled `label`, empty to begin with.
 *  2. It shows the digits in groups of four, separated by a single space:
 *     "4111 1111 1111 1111".
 *  3. Anything that is not a digit is dropped, and nothing past sixteen digits
 *     is kept.
 *  4. onChange is called with the digits alone, no spaces.
 *  5. Editing in the middle leaves the caret in the middle. Type a digit at
 *     the third character and the caret ends up directly after it, not at the
 *     end of the box.
 *  6. Deleting in the middle behaves the same way.
 *
 * Rules 5 and 6 are what make masks miserable. Handing the box a string it did
 * not have a moment ago resets the caret to the end, every time, and the user
 * correcting the second digit of their card finds the rest of it typed after
 * the last one. Counting in characters will not save you either — you inserted
 * a space, and the position you want is measured in something else.
 */
export default function CardNumberInput({ onChange, label = 'Card number' }) {
  return null
}
