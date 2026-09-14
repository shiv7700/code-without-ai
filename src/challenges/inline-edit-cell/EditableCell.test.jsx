import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import EditableCell from './EditableCell'

function Host({ initial = 'Ada' }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <EditableCell value={value} onCommit={setValue} label="Name" />
      <button type="button">Elsewhere</button>
    </>
  )
}

const cell = () => screen.getByRole('button', { name: 'Edit Name' })
const box = () => screen.getByLabelText('Name')

test('idle, it is a button showing the value', () => {
  render(<Host />)

  expect(cell()).toHaveTextContent('Ada')
  expect(screen.queryByRole('textbox')).toBeNull()
})

test('pressing it opens a focused box holding the value', async () => {
  render(<Host />)

  await userEvent.click(cell())
  expect(box()).toHaveValue('Ada')
  expect(box()).toHaveFocus()
})

test('Enter commits the typed text', async () => {
  render(<Host />)

  await userEvent.click(cell())
  await userEvent.clear(box())
  await userEvent.type(box(), 'Grace{Enter}')

  expect(screen.queryByRole('textbox')).toBeNull()
  expect(cell()).toHaveTextContent('Grace')
  expect(cell()).toHaveFocus()
})

test('leaving the box commits too', async () => {
  render(<Host />)

  await userEvent.click(cell())
  await userEvent.type(box(), 'x')
  await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))

  expect(cell()).toHaveTextContent('Adax')
})

test('Escape reverts and hands focus back', async () => {
  const onCommit = vi.fn()
  render(<EditableCell value="Ada" onCommit={onCommit} label="Name" />)

  await userEvent.click(cell())
  await userEvent.type(box(), 'x{Escape}')

  expect(onCommit).not.toHaveBeenCalled()
  expect(cell()).toHaveTextContent('Ada')
  expect(cell()).toHaveFocus()
})

test('committing an unchanged value reports nothing', async () => {
  const onCommit = vi.fn()
  render(<EditableCell value="Ada" onCommit={onCommit} label="Name" />)

  await userEvent.click(cell())
  await userEvent.keyboard('{Enter}')

  expect(onCommit).not.toHaveBeenCalled()
})

test('every edit opens on the value as it is now', async () => {
  const { rerender } = render(
    <EditableCell value="Ada" onCommit={() => {}} label="Name" />,
  )

  await userEvent.click(cell())
  await userEvent.type(box(), ' Lovelace{Escape}')
  await userEvent.click(cell())
  expect(box()).toHaveValue('Ada')

  await userEvent.keyboard('{Escape}')
  rerender(<EditableCell value="Grace" onCommit={() => {}} label="Name" />)
  await userEvent.click(cell())
  expect(box()).toHaveValue('Grace')
})
