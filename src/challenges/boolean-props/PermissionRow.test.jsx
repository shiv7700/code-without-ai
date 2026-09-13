import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import PermissionRow from './PermissionRow'

const state = () => screen.getByTestId('state').textContent

test('shows the name', () => {
  render(<PermissionRow name="Deploy" allowed />)
  expect(screen.getByTestId('name')).toHaveTextContent('Deploy')
})

test('the shorthand prop means true', () => {
  render(<PermissionRow name="Deploy" allowed />)
  expect(state()).toBe('yes')
})

test('an explicit false is a no', () => {
  render(<PermissionRow name="Deploy" allowed={false} />)
  expect(state()).toBe('no')
})

test('leaving the prop off is neither yes nor no', () => {
  render(<PermissionRow name="Deploy" />)
  expect(state()).toBe('inherited')
})

test('zero was decided, so it is a no', () => {
  render(<PermissionRow name="Deploy" allowed={0} />)
  expect(state()).toBe('no')
})

test('an empty string was decided too', () => {
  render(<PermissionRow name="Deploy" allowed="" />)
  expect(state()).toBe('no')
})
