import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import TagPicker from './TagPicker'

const TAGS = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
]

const chips = () =>
  screen.queryAllByRole('listitem').map((li) => li.textContent)

const tag = (label) => screen.getByRole('button', { name: label })
const click = (label) => userEvent.click(tag(label))
const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('starts from the ids it was given', () => {
  render(<TagPicker tags={TAGS} initial={['b']} onChange={() => {}} />)

  expect(chips()).toEqual(['Beta'])
  expect(tag('Beta')).toHaveAttribute('aria-pressed', 'true')
  expect(tag('Alpha')).toHaveAttribute('aria-pressed', 'false')
})

test('clicking an unselected tag adds it to the end', async () => {
  const onChange = vi.fn()
  render(<TagPicker tags={TAGS} initial={['b']} onChange={onChange} />)

  await click('Alpha')

  expect(chips()).toEqual(['Beta', 'Alpha'])
  expect(last(onChange)).toEqual(['b', 'a'])
})

test('clicking a selected tag removes it and leaves the order alone', async () => {
  render(<TagPicker tags={TAGS} initial={['a', 'b', 'c']} onChange={() => {}} />)

  await click('Beta')

  expect(chips()).toEqual(['Alpha', 'Gamma'])
  expect(tag('Beta')).toHaveAttribute('aria-pressed', 'false')
})

test('a tag put back goes to the end', async () => {
  render(<TagPicker tags={TAGS} initial={['a', 'b', 'c']} onChange={() => {}} />)

  await click('Alpha')
  await click('Alpha')

  expect(chips()).toEqual(['Beta', 'Gamma', 'Alpha'])
})

test('the selection changes and the array it was handed does not', async () => {
  const initial = ['a', 'b']
  const onChange = vi.fn()
  render(<TagPicker tags={TAGS} initial={initial} onChange={onChange} />)

  await click('Beta')
  await click('Gamma')

  expect(chips()).toEqual(['Alpha', 'Gamma'])
  expect(initial).toEqual(['a', 'b'])
  expect(last(onChange)).not.toBe(initial)
})
