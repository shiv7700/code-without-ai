import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import OtpInput from './OtpInput'

const setup = (props = {}) => {
  const onComplete = vi.fn()
  return {
    onComplete,
    user: userEvent.setup(),
    ...render(<OtpInput length={6} onComplete={onComplete} {...props} />),
  }
}

const box = (n) => screen.getByLabelText(`Digit ${n}`)
const values = () =>
  screen.getAllByRole('textbox').map((input) => input.value)

test('renders one empty box per digit', () => {
  setup()
  expect(values()).toEqual(['', '', '', '', '', ''])
})

test('a digit fills its box and hands focus on', async () => {
  const { user } = setup()
  await user.click(box(1))
  await user.keyboard('4')

  expect(box(1)).toHaveValue('4')
  expect(box(2)).toHaveFocus()
})

test('anything that is not a digit is refused', async () => {
  const { user } = setup()
  await user.click(box(1))
  await user.keyboard('a')

  expect(box(1)).toHaveValue('')
  expect(box(1)).toHaveFocus()
})

test('backspace on a filled box empties it and stays put', async () => {
  const { user } = setup()
  await user.click(box(1))
  await user.keyboard('12')
  await user.keyboard('{Backspace}')

  expect(values()).toEqual(['1', '', '', '', '', ''])
  expect(box(2)).toHaveFocus()
})

test('backspace on an empty box steps back and clears that one', async () => {
  const { user } = setup()
  await user.click(box(1))
  await user.keyboard('12')
  await user.keyboard('{Backspace}{Backspace}')

  expect(values()).toEqual(['', '', '', '', '', ''])
  expect(box(1)).toHaveFocus()
})

test('the code is reported the moment the last box is filled', async () => {
  const { user, onComplete } = setup()
  await user.click(box(1))
  await user.keyboard('12345')
  expect(onComplete).not.toHaveBeenCalled()

  await user.keyboard('6')
  expect(onComplete).toHaveBeenCalledTimes(1)
  expect(onComplete).toHaveBeenCalledWith('123456')
})

test('pasting the whole code fills every box at once', async () => {
  const { onComplete } = setup()
  fireEvent.paste(box(3), {
    clipboardData: { getData: () => '123456' },
  })

  expect(values()).toEqual(['1', '2', '3', '4', '5', '6'])
  expect(box(6)).toHaveFocus()
  expect(onComplete).toHaveBeenCalledWith('123456')
})

test('a pasted code is stripped of everything but digits', () => {
  setup()
  fireEvent.paste(box(1), {
    clipboardData: { getData: () => '12-34' },
  })

  expect(values()).toEqual(['1', '2', '3', '4', '', ''])
  expect(box(5)).toHaveFocus()
})
