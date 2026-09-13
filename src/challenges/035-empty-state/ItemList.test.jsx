import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import ItemList from './ItemList'

test('renders a row per item', () => {
  render(<ItemList items={['Apple', 'Banana']} />)
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
    'Apple',
    'Banana',
  ])
})

test('an empty array shows the message and no list', () => {
  render(<ItemList items={[]} />)
  expect(screen.getByTestId('empty')).toHaveTextContent('Nothing here yet')
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

test('no items prop at all behaves the same, and does not throw', () => {
  render(<ItemList />)
  expect(screen.getByTestId('empty')).toBeInTheDocument()
})

test('the message can be overridden', () => {
  render(<ItemList items={[]} empty="No fruit today" />)
  expect(screen.getByTestId('empty')).toHaveTextContent('No fruit today')
})

test('a non-empty list shows no empty message', () => {
  render(<ItemList items={['Apple']} />)
  expect(screen.queryByTestId('empty')).not.toBeInTheDocument()
})
