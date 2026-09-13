import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import ResultsList from './ResultsList'

const ITEMS = [
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
  { id: 'c', name: 'Apricot' },
]

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const message = () => screen.queryByTestId('message')?.textContent

test('an empty query shows everything', () => {
  render(<ResultsList items={ITEMS} query="" />)
  expect(rows()).toEqual(['Apple', 'Banana', 'Apricot'])
  expect(message()).toBeUndefined()
})

test('matching ignores case', () => {
  render(<ResultsList items={ITEMS} query="ap" />)
  expect(rows()).toEqual(['Apple', 'Apricot'])
})

test('no items at all is about the data', () => {
  render(<ResultsList items={[]} query="" />)
  expect(message()).toBe('No items yet')
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

test('no items and a query is still about the data', () => {
  render(<ResultsList items={[]} query="ap" />)
  expect(message()).toBe('No items yet')
})

test('items that do not match is about the query', () => {
  render(<ResultsList items={ITEMS} query="zz" />)
  expect(message()).toBe('No results for "zz"')
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})
