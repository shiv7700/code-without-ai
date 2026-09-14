import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { memo } from 'react'
import { expect, test } from 'vitest'
import ClickCounter from './ClickCounter'

function spyButton() {
  const seen = { renders: 0 }
  const Button = memo(function Button({ onClick, children }) {
    seen.renders += 1
    return <button onClick={onClick}>{children}</button>
  })
  return { Button, seen }
}

const count = () => screen.getByTestId('count').textContent
const press = () => userEvent.click(screen.getByRole('button', { name: '+1' }))

test('starts at zero', () => {
  const { Button } = spyButton()
  render(<ClickCounter Button={Button} />)
  expect(count()).toBe('0')
})

test('a click adds one', async () => {
  const { Button } = spyButton()
  render(<ClickCounter Button={Button} />)

  await press()
  expect(count()).toBe('1')
})

test('five clicks make five', async () => {
  const { Button } = spyButton()
  render(<ClickCounter Button={Button} />)

  for (let i = 0; i < 5; i++) await press()
  expect(count()).toBe('5')
})

test('a memoised button never re-renders while the count climbs', async () => {
  const { Button, seen } = spyButton()
  render(<ClickCounter Button={Button} />)

  await press()
  await press()
  await press()

  expect(count()).toBe('3')
  expect(seen.renders).toBe(1)
})
