import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Attendees from './Attendees'

const NAMES = ['Ann', 'Bo', 'Cy', 'Dee', 'Eve']

const rows = () =>
  screen.getAllByRole('listitem').map((li) => li.textContent.trim())

test('a short list shows everyone and no more row', () => {
  render(<Attendees names={['Ann', 'Bo']} />)

  expect(rows()).toEqual(['Ann', 'Bo'])
  expect(screen.queryByTestId('more')).not.toBeInTheDocument()
})

test('a long list shows the limit and counts the rest', () => {
  render(<Attendees names={NAMES} />)
  expect(rows()).toEqual(['Ann', 'Bo', 'Cy', 'and 2 others'])
})

test('exactly the limit gets no more row', () => {
  render(<Attendees names={['Ann', 'Bo', 'Cy']} />)

  expect(rows()).toEqual(['Ann', 'Bo', 'Cy'])
  expect(screen.queryByTestId('more')).not.toBeInTheDocument()
})

test('one over the limit is singular', () => {
  render(<Attendees names={['Ann', 'Bo', 'Cy', 'Dee']} />)

  expect(rows()).toEqual(['Ann', 'Bo', 'Cy', 'and 1 other'])
  expect(screen.getByTestId('more').textContent.trim()).toBe('and 1 other')
})

test('the limit can be anything, including zero', () => {
  const { rerender } = render(<Attendees names={NAMES} limit={1} />)
  expect(rows()).toEqual(['Ann', 'and 4 others'])

  rerender(<Attendees names={NAMES} limit={0} />)
  expect(rows()).toEqual(['and 5 others'])
})

test('an empty list is an empty list', () => {
  render(<Attendees names={[]} />)

  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  expect(screen.getByRole('list')).toBeInTheDocument()
})
