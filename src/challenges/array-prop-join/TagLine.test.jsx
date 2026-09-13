import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import TagLine from './TagLine'

const TAGS = ['red', 'blue', 'green']

const summary = () => screen.getByTestId('summary').textContent
const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('the summary separates the tags', () => {
  render(<TagLine tags={TAGS} />)
  expect(summary()).toBe('red, blue, green')
})

test('one list item per tag, in order', () => {
  render(<TagLine tags={TAGS} />)
  expect(rows()).toEqual(TAGS)
})

test('a single tag gets no separator', () => {
  render(<TagLine tags={['red']} />)
  expect(summary()).toBe('red')
  expect(rows()).toEqual(['red'])
})

test('no tags reads none and renders no list', () => {
  render(<TagLine tags={[]} />)
  expect(summary()).toBe('none')
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})
