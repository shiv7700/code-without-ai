/**
 * The answer to question one decides what question three is
 *
 * Topics: multi-step state · conditional fields · invalidating stale answers
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-contradictions-in-state
 * Read:   https://react.dev/learn/conditional-rendering
 *
 * Render, one step at a time, with <p data-testid="step"> reading
 * "Step 2 of 4" and buttons "Back" and "Next":
 *   1. radios "Work" and "Pleasure"
 *   2. a number input labelled "Nights"
 *   3. for Work, a text input "Company name"; for Pleasure, a select
 *      "Who is coming" offering "Alone", "Family" and "Friends"
 *   4. the review: one <li data-testid="answer"> per question asked, reading
 *      "Purpose: Work", "Nights: 3" and then "Company: Acme" or
 *      "Companions: Family"
 *
 * Rules:
 *  1. "Next" is disabled until the step showing has been answered.
 *  2. "Back" is disabled on step one, and returns with every answer intact.
 *  3. Step three asks whichever question step one earned.
 *  4. Changing the answer to step one throws away anything the other branch
 *     had collected — a company name cannot survive onto a holiday.
 *  5. The review lists only the questions that were actually asked.
 *
 * Rule 4 is the one that gets skipped. Nothing on screen gives it away: the
 * old branch's field is not rendered any more, so its answer sits in state
 * untouched, and the review is the first place anyone notices. Decide where
 * the clearing happens — it is one place, and it is not step three.
 */
export default function BranchingForm() {
  return null
}
