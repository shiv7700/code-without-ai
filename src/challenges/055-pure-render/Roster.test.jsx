import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Roster from './Roster'

const NAMES = ['Ada', 'Linus', 'Grace']

const rows = () =>
  screen.getAllByRole('listitem').map((li) => li.textContent.replace(/\s+/g, ' '))

test('numbers the names from 1', () => {
  render(<Roster names={NAMES} />)
  expect(rows()).toEqual(['1. Ada', '2. Linus', '3. Grace'])
})

test('start moves where the numbering begins', () => {
  render(<Roster names={NAMES} start={10} />)
  expect(rows()).toEqual(['10. Ada', '11. Linus', '12. Grace'])
})

test('an empty roster renders no rows', () => {
  render(<Roster names={[]} />)
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('the array it is given is not mutated', () => {
  const names = ['Ada', 'Linus', 'Grace']
  render(<Roster names={names} />)
  expect(names).toEqual(['Ada', 'Linus', 'Grace'])
})

test('rendering it twice gives the same output both times', () => {
  const first = render(<Roster names={NAMES} />).container.textContent
  const second = render(<Roster names={NAMES} />).container.textContent
  expect(second).toBe(first)
})
