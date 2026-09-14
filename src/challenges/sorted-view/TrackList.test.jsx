import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import TrackList from './TrackList'

const tracks = () => [
  { title: 'Ache', plays: 9 },
  { title: 'Bloom', plays: 10 },
  { title: 'Cinder', plays: 9 },
]

const rows = () =>
  screen.getAllByRole('listitem').map((li) => li.textContent.trim())

test('sorts by plays, most played first', () => {
  render(<TrackList tracks={tracks()} />)
  expect(rows()).toEqual(['2. Bloom — 10', '1. Ache — 9', '3. Cinder — 9'])
})

test('equal plays keep the order they arrived in', () => {
  render(<TrackList tracks={tracks()} />)
  expect(rows().slice(1)).toEqual(['1. Ache — 9', '3. Cinder — 9'])
})

test('sorts by title when asked', () => {
  render(<TrackList tracks={[{ title: 'Cinder', plays: 1 }, { title: 'Ache', plays: 2 }]} by="title" />)
  expect(rows()).toEqual(['2. Ache — 2', '1. Cinder — 1'])
})

test('the numbers are positions in the list as it was handed over', () => {
  const list = [
    { title: 'Zephyr', plays: 1 },
    { title: 'Amber', plays: 99 },
  ]
  render(<TrackList tracks={list} by="title" />)

  expect(rows()).toEqual(['2. Amber — 99', '1. Zephyr — 1'])
})

test('the array it was given is not reordered', () => {
  const list = tracks()
  render(<TrackList tracks={list} />)

  expect(list.map((t) => t.title)).toEqual(['Ache', 'Bloom', 'Cinder'])
})

test('a new sort starts from the original order every time', () => {
  const list = tracks()
  const { rerender } = render(<TrackList tracks={list} by="title" />)
  rerender(<TrackList tracks={list} by="plays" />)

  expect(rows()).toEqual(['2. Bloom — 10', '1. Ache — 9', '3. Cinder — 9'])
})
