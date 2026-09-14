/**
 * The square you started on is a corner, not a beginning
 *
 * Topics: pointer gestures · anchor and cursor · a set of selected cells
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
 * Read:   https://react.dev/learn/responding-to-events
 *
 * Props: { days: string[], slots: string[] }
 *
 * Render:
 *   one button per day and slot, aria-labelled "Tue 10:00", carrying
 *   data-selected. Slots run down, days run across.
 *
 * Rules:
 *  1. Pressing the pointer down on a cell starts a selection anchored there.
 *  2. While it is held, the block between the anchor and the cell under the
 *     pointer shows as selected, and it follows the pointer as it moves.
 *  3. Letting go keeps that block. Moving the pointer afterwards changes
 *     nothing.
 *  4. A cell entered with nothing held down is just a cell.
 *  5. Each drag adds to what was already chosen.
 *
 * Nearly everyone writes the loop as "from where it started to where it is
 * now". Drag right to left and that loop runs zero times and selects a single
 * cell. The two ends of a block are the smaller and the larger of the two
 * positions, and you have to sort them out before you can compare anything.
 */
export default function ScheduleGrid({ days, slots }) {
  return null
}
