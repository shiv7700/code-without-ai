/**
 * LEVEL 78 — the marking rule everybody gets wrong
 *
 * Topics: two-pass counting · game state · derived rendering
 * Read:   https://react.dev/learn/choosing-the-state-structure
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 *
 * Props: { answer, maxGuesses = 6 }  — five letters, upper case
 *
 * Render:
 *   - `maxGuesses` <div data-testid="row">, each holding five
 *     <span data-testid="tile"> with data-state="empty" | "correct" |
 *     "present" | "absent" and the letter as its text
 *   - an input labelled "Guess" and a button reading "Submit"
 *   - "You win", or "You lose — it was ERASE"
 *   - a <p role="alert"> reading 'Guesses are 5 letters' for a short guess
 *
 * Rules:
 *  1. Guesses fill the rows top to bottom. Unused rows stay empty.
 *  2. A guess that is not five letters is rejected — no row is used.
 *  3. Right letter, right place → correct. Right letter, wrong place →
 *     present. Not in the word → absent.
 *  4. A letter is only "present" as many times as it actually appears in the
 *     answer, and letters already matched in place are used up FIRST.
 *     Guess SPEED against ERASE: present, absent, present, present, absent.
 *     Guess BOBBY against ABBEY: present, absent, correct, absent, correct.
 *  5. Guessing the answer wins. Using every row without it loses, and the
 *     answer is revealed.
 *  6. Once it is over, no more guesses are accepted.
 *
 * Rule 4 is the whole challenge. One pass marking greens while counting the
 * answer's remaining letters, then a second pass spending those counts left to
 * right. One pass cannot do it — you cannot know a letter is spent until the
 * greens are all found.
 */
export default function Wordle({ answer, maxGuesses = 6 }) {
  return null
}
