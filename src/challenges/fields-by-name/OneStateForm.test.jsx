import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import OneStateForm from './OneStateForm'

const field = (label) => screen.getByLabelText(label)
const create = () => screen.getByRole('button', { name: 'Create' })

test('the controls start at their defaults', () => {
  render(<OneStateForm onSubmit={() => {}} />)

  expect(field('Name')).toHaveValue('')
  expect(field('Role')).toHaveValue('viewer')
  expect(field('Subscribe')).not.toBeChecked()
})

test('typing in one field leaves the others alone', async () => {
  render(<OneStateForm onSubmit={() => {}} />)

  await userEvent.type(field('Name'), 'Ada')
  await userEvent.selectOptions(field('Role'), 'admin')

  expect(field('Name')).toHaveValue('Ada')
  expect(field('Email')).toHaveValue('')
  expect(field('Role')).toHaveValue('admin')
})

test('Create reports every key in one object', async () => {
  const onSubmit = vi.fn()
  render(<OneStateForm onSubmit={onSubmit} />)

  await userEvent.type(field('Name'), 'Ada')
  await userEvent.type(field('Email'), 'ada@lovelace.dev')
  await userEvent.click(create())

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'Ada',
    email: 'ada@lovelace.dev',
    role: 'viewer',
    subscribe: false,
  })
})

test('the keys are the names of the inputs, and there are only four', async () => {
  const onSubmit = vi.fn()
  render(<OneStateForm onSubmit={onSubmit} />)

  await userEvent.click(create())

  expect(Object.keys(onSubmit.mock.calls[0][0]).sort()).toEqual([
    'email',
    'name',
    'role',
    'subscribe',
  ])
})

test('the checkbox stores a boolean, not the string "on"', async () => {
  const onSubmit = vi.fn()
  render(<OneStateForm onSubmit={onSubmit} />)

  await userEvent.click(field('Subscribe'))
  await userEvent.click(create())
  expect(onSubmit.mock.calls[0][0].subscribe).toBe(true)

  await userEvent.click(field('Subscribe'))
  await userEvent.click(create())
  expect(onSubmit.mock.calls[1][0].subscribe).toBe(false)
})
