import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import DiffViewer from './DiffViewer'

const show = (before, after) => {
  render(<DiffViewer before={before} after={after} />)
  return screen
    .queryAllByTestId('row')
    .map((li) => `${li.dataset.kind}:${li.textContent.trim()}`)
}

test('two identical files have nothing but shared lines', () => {
  expect(show(['a', 'b', 'c'], ['a', 'b', 'c'])).toEqual([
    'same:a',
    'same:b',
    'same:c',
  ])
})

test('an empty left-hand side is all additions', () => {
  expect(show([], ['a', 'b'])).toEqual(['added:a', 'added:b'])
})

test('an empty right-hand side is all removals', () => {
  expect(show(['a', 'b'], [])).toEqual(['removed:a', 'removed:b'])
})

test('a deleted line is marked where it used to be', () => {
  expect(show(['a', 'b', 'c'], ['a', 'c'])).toEqual([
    'same:a',
    'removed:b',
    'same:c',
  ])
})

test('a changed line reads as a removal and then an addition', () => {
  expect(show(['a', 'b', 'c'], ['a', 'B', 'c'])).toEqual([
    'same:a',
    'removed:b',
    'added:B',
    'same:c',
  ])
})

test('a line inserted at the top does not shift everything below it', () => {
  expect(show(['a', 'b', 'c', 'd'], ['x', 'a', 'b', 'c', 'd'])).toEqual([
    'added:x',
    'same:a',
    'same:b',
    'same:c',
    'same:d',
  ])
})

test('lines moved apart still pair with the right partners', () => {
  expect(show(['a', 'b', 'c', 'd'], ['a', 'x', 'y', 'd'])).toEqual([
    'same:a',
    'removed:b',
    'removed:c',
    'added:x',
    'added:y',
    'same:d',
  ])
})
