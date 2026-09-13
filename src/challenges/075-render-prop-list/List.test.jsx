import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import List from './List'

const rows = () => screen.getAllByRole('listitem').map((li) => li.textContent)

test('renders whatever renderItem returns', () => {
  render(<List items={['a', 'b']} renderItem={(x) => <b>{x}!</b>} />)
  expect(rows()).toEqual(['a!', 'b!'])
  expect(screen.getAllByText(/!/)[0].tagName).toBe('B')
})

test('renderItem gets the index too', () => {
  render(<List items={['a', 'b']} renderItem={(x, i) => `${i}:${x}`} />)
  expect(rows()).toEqual(['0:a', '1:b'])
})

test('renderItem is called once per item', () => {
  const renderItem = vi.fn((x) => x)
  render(<List items={['a', 'b', 'c']} renderItem={renderItem} />)
  expect(renderItem).toHaveBeenCalledTimes(3)
})

test('without renderItem it falls back to the item itself', () => {
  render(<List items={[1, 2]} />)
  expect(rows()).toEqual(['1', '2'])
})

test('an empty list renders an empty ul and calls nothing', () => {
  const renderItem = vi.fn()
  render(<List items={[]} renderItem={renderItem} />)
  expect(screen.getByRole('list')).toBeEmptyDOMElement()
  expect(renderItem).not.toHaveBeenCalled()
})
