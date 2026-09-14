import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SeededList from './SeededList'

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const add = () => userEvent.click(screen.getByRole('button', { name: 'Add' }))

test('starts from whatever the factory returned', () => {
  render(<SeededList makeItems={() => ['milk', 'eggs']} />)
  expect(rows()).toEqual(['milk', 'eggs'])
})

test('Add appends what was typed and empties the box', async () => {
  render(<SeededList makeItems={() => ['milk']} />)

  await userEvent.type(screen.getByLabelText('New item'), 'bread')
  await add()

  expect(rows()).toEqual(['milk', 'bread'])
  expect(screen.getByLabelText('New item')).toHaveValue('')
})

test('adding nothing adds nothing', async () => {
  render(<SeededList makeItems={() => ['milk']} />)

  await add()
  expect(rows()).toEqual(['milk'])
})

test('the factory runs once, however many renders there are', async () => {
  const makeItems = vi.fn(() => ['milk'])
  render(<SeededList makeItems={makeItems} />)

  await userEvent.type(screen.getByLabelText('New item'), 'bread')
  await add()

  expect(makeItems).toHaveBeenCalledTimes(1)
})

test('a different factory on a later render is never called', async () => {
  const first = vi.fn(() => ['milk'])
  const second = vi.fn(() => ['nothing at all'])
  const { rerender } = render(<SeededList makeItems={first} />)

  rerender(<SeededList makeItems={second} />)

  expect(second).not.toHaveBeenCalled()
  expect(rows()).toEqual(['milk'])
})
