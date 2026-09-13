import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import AvatarStack from './AvatarStack'

const USERS = ['Ada', 'Bo', 'Cy', 'Dee', 'Eve'].map((name, i) => ({
  id: i,
  name,
  avatar: `/${name}.png`,
}))

const names = () => screen.getAllByRole('img').map((i) => i.getAttribute('alt'))

test('shows everyone when they fit', () => {
  render(<AvatarStack users={USERS.slice(0, 2)} max={3} />)

  expect(names()).toEqual(['Ada', 'Bo'])
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
})

test('exactly max users still shows no chip', () => {
  render(<AvatarStack users={USERS.slice(0, 3)} max={3} />)

  expect(names()).toEqual(['Ada', 'Bo', 'Cy'])
  expect(screen.queryByText(/^\+/)).toBeNull()
})

test('past max, the stack is never taller than max', () => {
  render(<AvatarStack users={USERS} max={3} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})

test('the chip counts the user it displaced as well as the rest', () => {
  render(<AvatarStack users={USERS} max={3} />)

  expect(names()).toEqual(['Ada', 'Bo'])
  expect(screen.getByText('+3')).toBeInTheDocument()
})

test('the chip is announced as a count, not a plus sign', () => {
  render(<AvatarStack users={USERS} max={3} />)
  expect(screen.getByLabelText('3 more')).toBeInTheDocument()
})

test('a max of one is all chip', () => {
  render(<AvatarStack users={USERS.slice(0, 4)} max={1} />)

  expect(screen.queryAllByRole('img')).toHaveLength(0)
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.getByText('+4')).toBeInTheDocument()
})
