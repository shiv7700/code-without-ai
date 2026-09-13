/**
 * LEVEL 17 — multi-step state that survives going backwards
 *
 * Topics: lifting state up · conditional rendering
 * Read:   https://react.dev/learn/sharing-state-between-components
 * Read:   https://react.dev/learn/conditional-rendering
 *
 * Props: { onComplete }
 *
 * Three steps:
 *   1. an input labelled "Name"   — valid when not empty
 *   2. an input labelled "Email"  — valid when it contains "@"
 *   3. a review step showing both values
 *
 * Always render:
 *   - "Step X of 3" inside data-testid="progress"
 *   - a "Back" button (disabled on step 1)
 *   - on steps 1 and 2: a "Next" button, disabled while the step is invalid
 *   - on step 3: a "Submit" button instead of "Next"
 *
 * Rules:
 *  1. Next moves forward, Back moves back
 *  2. going Back PRESERVES what was typed — the input still holds it
 *  3. editing an earlier step updates what step 3 shows
 *  4. Submit calls onComplete({ name, email }) exactly once
 *  5. only the current step's fields are in the DOM
 *
 * Rule 2 is the design decision. If each step owns its own state, that state
 * dies when the step unmounts and the user loses their typing. The data has
 * to live above the steps.
 */
export default function Wizard({ onComplete }) {
  return null
}
