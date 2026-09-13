import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Stack from './Stack'

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const count = () => screen.getByTestId('count').textContent

test('several children, one row each, in order', () => {
  render(
    <Stack>
      <span>one</span>
      <span>two</span>
      <span>three</span>
    </Stack>,
  )
  expect(rows()).toEqual(['one', 'two', 'three'])
  expect(count()).toBe('3')
})

test('a single child is still a list of one', () => {
  render(
    <Stack>
      <span>only</span>
    </Stack>,
  )
  expect(rows()).toEqual(['only'])
  expect(count()).toBe('1')
})

test('a bare string child counts as a child', () => {
  render(<Stack>plain</Stack>)
  expect(rows()).toEqual(['plain'])
  expect(count()).toBe('1')
})

test('no children is an empty list, not a crash', () => {
  render(<Stack />)
  expect(rows()).toEqual([])
  expect(count()).toBe('0')
})

test('null and false children are skipped', () => {
  render(
    <Stack>
      <span>one</span>
      {null}
      {false}
      <span>two</span>
    </Stack>,
  )
  expect(rows()).toEqual(['one', 'two'])
  expect(count()).toBe('2')
})
