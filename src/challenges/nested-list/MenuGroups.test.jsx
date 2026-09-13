import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import MenuGroups from './MenuGroups'

const GROUPS = [
  {
    id: 'food',
    title: 'Food',
    items: [
      { id: 'f1', label: 'Dosa' },
      { id: 'f2', label: 'Special' },
    ],
  },
  {
    id: 'drink',
    title: 'Drink',
    items: [{ id: 'd1', label: 'Special' }],
  },
]

const groupFor = (title) => screen.getByRole('heading', { name: title }).closest('section')
const labels = (title) =>
  within(groupFor(title))
    .queryAllByRole('listitem')
    .map((li) => li.textContent)

test('a heading per group', () => {
  render(<MenuGroups groups={GROUPS} />)
  expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual([
    'Food',
    'Drink',
  ])
})

test('each group holds its own items', () => {
  render(<MenuGroups groups={GROUPS} />)
  expect(labels('Food')).toEqual(['Dosa', 'Special'])
  expect(labels('Drink')).toEqual(['Special'])
})

test('a label repeated across groups renders in both', () => {
  render(<MenuGroups groups={GROUPS} />)
  expect(screen.getAllByText('Special')).toHaveLength(2)
})

test('an empty group is a heading and nothing else', () => {
  render(<MenuGroups groups={[{ id: 'x', title: 'Empty', items: [] }]} />)
  expect(screen.getByRole('heading', { name: 'Empty' })).toBeInTheDocument()
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

test('no groups renders no headings', () => {
  render(<MenuGroups groups={[]} />)
  expect(screen.queryAllByRole('heading')).toHaveLength(0)
})
