import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import SortedPeople from './SortedPeople'

const build = () => [
  { id: '1', name: 'Zoe', age: 31 },
  { id: '2', name: 'Ada', age: 44 },
  { id: '3', name: 'Mel', age: 31 },
]

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('renders the order it was given', () => {
  render(<SortedPeople people={build()} />)
  expect(rows()).toEqual(['Zoe (31)', 'Ada (44)', 'Mel (31)'])
})

test('sorts by name', async () => {
  render(<SortedPeople people={build()} />)

  await click('By name')
  expect(rows()).toEqual(['Ada (44)', 'Mel (31)', 'Zoe (31)'])
})

test('sorts by age, and ties keep the order they came in', async () => {
  render(<SortedPeople people={build()} />)

  await click('By age')
  expect(rows()).toEqual(['Zoe (31)', 'Mel (31)', 'Ada (44)'])
})

test('Original restores the order after sorting both ways', async () => {
  render(<SortedPeople people={build()} />)

  await click('By name')
  await click('By age')
  await click('Original')

  expect(rows()).toEqual(['Zoe (31)', 'Ada (44)', 'Mel (31)'])
})

test('the list reorders and the array it was handed does not', async () => {
  const people = build()
  render(<SortedPeople people={people} />)

  await click('By name')

  expect(rows()).toEqual(['Ada (44)', 'Mel (31)', 'Zoe (31)'])
  expect(people).toEqual(build())
})
