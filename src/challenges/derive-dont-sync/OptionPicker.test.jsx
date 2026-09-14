import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import OptionPicker from './OptionPicker'

const OPTIONS = [
  { id: 'r', label: 'Red' },
  { id: 'g', label: 'Green' },
  { id: 'b', label: 'Blue' },
]

const heading = () => screen.getByRole('heading').textContent
const click = (name) => userEvent.click(screen.getByRole('button', { name }))
const last = (onCommit) => onCommit.mock.calls.at(-1)[0]

test('nothing is selected to begin with', () => {
  const onCommit = vi.fn()
  render(<OptionPicker options={OPTIONS} onCommit={onCommit} />)

  expect(heading()).toBe('Nothing selected')
  expect(last(onCommit)).toEqual({ id: null, label: null })
})

test('clicking an option shows its label', async () => {
  const onCommit = vi.fn()
  render(<OptionPicker options={OPTIONS} onCommit={onCommit} />)

  await click('Green')

  expect(heading()).toBe('Selected: Green')
  expect(last(onCommit)).toEqual({ id: 'g', label: 'Green' })
})

test('every commit pairs the id with its own label', async () => {
  const onCommit = vi.fn()
  render(<OptionPicker options={OPTIONS} onCommit={onCommit} />)

  await click('Green')
  await click('Blue')
  await click('Red')

  for (const [shown] of onCommit.mock.calls) {
    const expected = OPTIONS.find((o) => o.id === shown.id)?.label ?? null
    expect(shown.label).toBe(expected)
  }
})

test('a click is one commit, not two', async () => {
  const onCommit = vi.fn()
  render(<OptionPicker options={OPTIONS} onCommit={onCommit} />)

  const before = onCommit.mock.calls.length
  await click('Blue')

  expect(onCommit.mock.calls.length).toBe(before + 1)
})

test('relabelling the options updates the heading straight away', async () => {
  const onCommit = vi.fn()
  const { rerender } = render(
    <OptionPicker options={OPTIONS} onCommit={onCommit} />,
  )

  await click('Green')
  rerender(
    <OptionPicker
      options={[
        { id: 'r', label: 'Crimson' },
        { id: 'g', label: 'Emerald' },
        { id: 'b', label: 'Cobalt' },
      ]}
      onCommit={onCommit}
    />,
  )

  expect(heading()).toBe('Selected: Emerald')
  expect(last(onCommit)).toEqual({ id: 'g', label: 'Emerald' })
})
