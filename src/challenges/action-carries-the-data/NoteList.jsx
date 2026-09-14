/**
 * An action that makes the reducer invent something
 *
 * Topics: useReducer · pure reducers · the reducer runs twice
 * Read:   https://react.dev/reference/react/useReducer#my-reducer-or-initializer-function-runs-twice
 * Read:   https://react.dev/learn/keeping-components-pure
 *
 * @param {() => string} makeId  gives out the next id, once per note
 * @param {(notes: {id: string, text: string}[]) => void} onChange
 *
 * Render an input labelled "Note", a button "Add", a <ul> showing each note's
 * text, and a button "Clear".
 *
 * Rules:
 *  1. "Add" appends `{ id, text }` and empties the input
 *  2. "Clear" empties the list
 *  3. `makeId` is called exactly once per note added — three notes, three calls
 *  4. the ids on the notes are the ids `makeId` handed out, in order
 *  5. adding a blank note does nothing, and does not burn an id
 *  6. every change calls `onChange` with the notes
 *
 * React calls your reducer twice in development to check it is pure, and throws
 * one of the two answers away. So anything a reducer makes up for itself — an
 * id, a timestamp, a random number — gets made up twice, and the copy you can
 * see is the second one. Whatever a case needs, the action has to carry in.
 * Which is also why `{ type: 'cleared' }` is perfectly happy carrying nothing.
 */
export default function NoteList({ makeId, onChange }) {
  return null
}
