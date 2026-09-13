import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import UserLabel from './UserLabel'

const label = () => screen.getByTestId('label').textContent

test('all four parts in order', () => {
  render(<UserLabel title="Dr" first="Ada" nickname="Countess" last="Lovelace" />)
  expect(label()).toBe('Dr Ada "Countess" Lovelace')
})

test('no title, and no leading space either', () => {
  render(<UserLabel first="Ada" last="Lovelace" />)
  expect(label()).toBe('Ada Lovelace')
})

test('no last name, and no trailing undefined', () => {
  render(<UserLabel title="Dr" first="Ada" />)
  expect(label()).toBe('Dr Ada')
})

test('the nickname sits between the names', () => {
  render(<UserLabel first="Ada" nickname="Countess" last="Lovelace" />)
  expect(label()).toBe('Ada "Countess" Lovelace')
})

test('one part on its own', () => {
  render(<UserLabel last="Lovelace" />)
  expect(label()).toBe('Lovelace')
})

test('nothing at all has a name of its own', () => {
  render(<UserLabel />)
  expect(label()).toBe('Anonymous')
})
