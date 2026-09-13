import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import StaticList from './StaticList'

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('one row per line, in order', () => {
  render(<StaticList lines={['first', 'second', 'third']} />)
  expect(rows()).toEqual(['first', 'second', 'third'])
})

test('the list is ordered markup', () => {
  const { container } = render(<StaticList lines={['a']} />)
  expect(container.firstChild.tagName).toBe('OL')
})

test('a repeated line is rendered twice', () => {
  render(<StaticList lines={['a', 'b', 'a']} />)
  expect(rows()).toEqual(['a', 'b', 'a'])
})

test('every line is a repeat and all four still show', () => {
  render(<StaticList lines={['-', '-', '-', '-']} />)
  expect(rows()).toHaveLength(4)
})

test('an empty array leaves an empty list', () => {
  const { container } = render(<StaticList lines={[]} />)
  expect(container.firstChild.tagName).toBe('OL')
  expect(rows()).toEqual([])
})
