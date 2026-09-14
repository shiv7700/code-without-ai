/**
 * The clock starts when you do, and stops when you are done
 *
 * Topics: injected clock · derived measurements · start and end instants
 * Read:   https://react.dev/learn/choosing-the-state-structure
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *
 * @param {string} text            what has to be typed
 * @param {() => number} now       the clock, in milliseconds
 *
 * Render:
 *   - a textarea labelled "Type here"
 *   - one <span data-testid="char"> per character of `text`, with
 *     data-state="pending" | "right" | "wrong"
 *   - <p data-testid="elapsed"> in whole seconds, <p data-testid="wpm">,
 *     <p data-testid="accuracy"> as "67%", and <p data-testid="status">
 *     which reads "Finished" once the whole text is typed
 *
 * Rules:
 *  1. Nothing is running before the first keystroke: 0 seconds, 0 wpm, 100%.
 *  2. The clock starts at the first keystroke and stops at the last one. Typing
 *     more than `text` is not possible.
 *  3. A word is five characters. wpm is characters typed ÷ 5, over the minutes
 *     elapsed, rounded.
 *  4. Accuracy is the characters in the right place over the characters typed,
 *     rounded, and 100% before anything is typed.
 *  5. Once finished, none of the numbers move again however late it gets.
 *
 * `now` is the only clock — never reach for the real one. Two instants matter
 * and neither is the render you are in: read one too early and the seconds
 * spent reading the text count against you; forget the other and the score
 * keeps falling after the race is over.
 */
export default function TypingTest({ text, now }) {
  return null
}
