import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { expect, test, vi } from 'vitest'
import NoteList from './NoteList'

function setup() {
  let n = 0
  const makeId = vi.fn(() => `n${++n}`)
  const onChange = vi.fn()
  render(
    <StrictMode>
      <NoteList makeId={makeId} onChange={onChange} />
    </StrictMode>,
  )
  return { makeId, onChange }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const click = (name) => userEvent.click(screen.getByRole('button', { name }))
const last = (onChange) => onChange.mock.calls.at(-1)[0]

const write = async (text) => {
  await userEvent.type(screen.getByLabelText('Note'), text)
  await click('Add')
}

test('Add appends the note and empties the box', async () => {
  setup()

  await write('buy milk')

  expect(rows()).toEqual(['buy milk'])
  expect(screen.getByLabelText('Note')).toHaveValue('')
})

test('a blank note is not added, and costs no id', async () => {
  const { makeId } = setup()

  await click('Add')

  expect(rows()).toEqual([])
  expect(makeId).not.toHaveBeenCalled()
})

test('Clear empties the list', async () => {
  setup()

  await write('one')
  await write('two')
  await click('Clear')

  expect(rows()).toEqual([])
})

test('one id is handed out per note, and the notes carry them', async () => {
  const { makeId, onChange } = setup()

  await write('one')
  await write('two')
  await write('three')

  expect(makeId).toHaveBeenCalledTimes(3)
  expect(last(onChange)).toEqual([
    { id: 'n1', text: 'one' },
    { id: 'n2', text: 'two' },
    { id: 'n3', text: 'three' },
  ])
})

test('adding again after a clear carries on where the ids left off', async () => {
  const { makeId, onChange } = setup()

  await write('one')
  await click('Clear')
  await write('two')

  expect(makeId).toHaveBeenCalledTimes(2)
  expect(last(onChange)).toEqual([{ id: 'n2', text: 'two' }])
})
