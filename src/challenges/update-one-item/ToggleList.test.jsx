import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ToggleList from './ToggleList'

const build = () => [
  { id: 'a', label: 'Apple', done: false },
  { id: 'b', label: 'Banana', done: true },
  { id: 'c', label: 'Cherry', done: false },
]

const box = (name) => screen.getByRole('checkbox', { name })

test('every item gets a checkbox, checked from its done', () => {
  render(<ToggleList items={build()} onChange={() => {}} />)

  expect(box('Apple')).not.toBeChecked()
  expect(box('Banana')).toBeChecked()
})

test('ticking a box flips that item and nobody else', async () => {
  render(<ToggleList items={build()} onChange={() => {}} />)

  await userEvent.click(box('Apple'))

  expect(box('Apple')).toBeChecked()
  expect(box('Banana')).toBeChecked()
  expect(box('Cherry')).not.toBeChecked()
})

test('onChange gets the whole list with the flip applied', async () => {
  const onChange = vi.fn()
  render(<ToggleList items={build()} onChange={onChange} />)

  await userEvent.click(box('Banana'))

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange.mock.calls[0][0].map((i) => i.done)).toEqual([
    false,
    false,
    false,
  ])
})

test('the array it was handed is left exactly as it was', async () => {
  const items = build()
  render(<ToggleList items={items} onChange={() => {}} />)

  await userEvent.click(box('Apple'))

  expect(items).toEqual(build())
})

test('only the changed item is a new object', async () => {
  const items = build()
  const onChange = vi.fn()
  render(<ToggleList items={items} onChange={onChange} />)

  await userEvent.click(box('Apple'))
  const next = onChange.mock.calls[0][0]

  expect(next).not.toBe(items)
  expect(next[0]).not.toBe(items[0])
  expect(next[1]).toBe(items[1])
  expect(next[2]).toBe(items[2])
})
