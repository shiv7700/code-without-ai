import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import HoldStepper from './HoldStepper'

function bookings() {
  let booked = null
  return {
    schedule: (fn) => {
      booked = fn
      return () => {
        if (booked === fn) booked = null
      }
    },
    booked: () => booked !== null,
    run: () =>
      act(async () => {
        const fn = booked
        booked = null
        fn()
      }),
  }
}

function Host({ schedule, initial = 4, ...rest }) {
  const [value, setValue] = useState(initial)
  return (
    <HoldStepper value={value} onChange={setValue} schedule={schedule} {...rest} />
  )
}

const spin = () => screen.getByRole('spinbutton')
const up = () => screen.getByRole('button', { name: 'Increase' })
const down = () => screen.getByRole('button', { name: 'Decrease' })
const at = () => Number(spin().getAttribute('aria-valuenow'))

test('shows a named spinbutton with its range, and two buttons', () => {
  render(<Host schedule={bookings().schedule} />)

  expect(spin()).toHaveAccessibleName('Quantity')
  expect(spin()).toHaveAttribute('aria-valuemin', '0')
  expect(spin()).toHaveAttribute('aria-valuemax', '10')
  expect(at()).toBe(4)
  expect(up()).toBeEnabled()
})

test('a press and release moves one step and books nothing further', async () => {
  const repeat = bookings()
  render(<Host schedule={repeat.schedule} />)

  await userEvent.click(up())
  expect(at()).toBe(5)
  expect(repeat.booked()).toBe(false)
})

test('holding keeps counting from wherever it has got to', async () => {
  const repeat = bookings()
  render(<Host schedule={repeat.schedule} />)

  fireEvent.pointerDown(up())
  expect(at()).toBe(5)

  await repeat.run()
  expect(at()).toBe(6)

  await repeat.run()
  await repeat.run()
  expect(at()).toBe(8)
})

test('letting go, leaving, or losing focus all stop it', async () => {
  const repeat = bookings()
  render(<Host schedule={repeat.schedule} />)

  fireEvent.pointerDown(up())
  await repeat.run()
  fireEvent.pointerUp(up())
  expect(repeat.booked()).toBe(false)

  fireEvent.pointerDown(up())
  fireEvent.pointerLeave(up())
  expect(repeat.booked()).toBe(false)

  fireEvent.pointerDown(up())
  fireEvent.blur(up())
  expect(repeat.booked()).toBe(false)
  expect(at()).toBe(8)
})

test('it stops at the limit and gives up the button', async () => {
  const repeat = bookings()
  render(<Host schedule={repeat.schedule} initial={8} />)

  fireEvent.pointerDown(up())
  await repeat.run()
  expect(at()).toBe(10)
  expect(repeat.booked()).toBe(false)
  expect(up()).toBeDisabled()

  fireEvent.pointerDown(down())
  expect(at()).toBe(9)
})

test('unmounting while a repeat is booked cancels it', async () => {
  const repeat = bookings()
  const { unmount } = render(<Host schedule={repeat.schedule} />)

  fireEvent.pointerDown(up())
  expect(repeat.booked()).toBe(true)

  unmount()
  expect(repeat.booked()).toBe(false)
})

test('a parent that ignores onChange leaves the display alone', () => {
  const repeat = bookings()
  render(<HoldStepper value={4} onChange={() => {}} schedule={repeat.schedule} />)

  fireEvent.pointerDown(up())
  expect(at()).toBe(4)
})
