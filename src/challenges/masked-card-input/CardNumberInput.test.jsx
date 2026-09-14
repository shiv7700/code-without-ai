import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CardNumberInput from './CardNumberInput'

const box = () => screen.getByLabelText('Card number')

test('starts empty, with a label', () => {
  render(<CardNumberInput onChange={() => {}} />)

  expect(box()).toHaveValue('')
})

test('digits fall into groups of four', async () => {
  render(<CardNumberInput onChange={() => {}} />)

  await userEvent.type(box(), '411111111111')
  expect(box()).toHaveValue('4111 1111 1111')
})

test('anything that is not a digit is dropped, and sixteen is the limit', async () => {
  render(<CardNumberInput onChange={() => {}} />)

  await userEvent.type(box(), '4111x1111 1111-1111abc9999')
  expect(box()).toHaveValue('4111 1111 1111 1111')
})

test('the parent hears digits, not the mask', async () => {
  const onChange = vi.fn()
  render(<CardNumberInput onChange={onChange} />)

  await userEvent.type(box(), '41111')
  expect(onChange).toHaveBeenLastCalledWith('41111')
})

test('typing in the middle leaves the caret in the middle', async () => {
  render(<CardNumberInput onChange={() => {}} />)

  await userEvent.type(box(), '41111111')
  expect(box()).toHaveValue('4111 1111')

  await userEvent.type(box(), '9', {
    initialSelectionStart: 2,
    initialSelectionEnd: 2,
  })

  expect(box()).toHaveValue('4191 1111 1')
  expect(box().selectionStart).toBe(3)
})

test('deleting in the middle leaves the caret in the middle', async () => {
  render(<CardNumberInput onChange={() => {}} />)

  await userEvent.type(box(), '41111111')

  await userEvent.type(box(), '{Backspace}', {
    initialSelectionStart: 3,
    initialSelectionEnd: 3,
  })

  expect(box()).toHaveValue('4111 111')
  expect(box().selectionStart).toBe(2)
})
