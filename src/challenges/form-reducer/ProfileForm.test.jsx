import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ProfileForm from './ProfileForm'

const build = () => ({ name: 'Ada', email: 'ada@example.com' })

const field = (label) => screen.getByLabelText(label)
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

const retype = async (label, value) => {
  await userEvent.clear(field(label))
  await userEvent.type(field(label), value)
}

test('both fields start from what it was given', () => {
  render(<ProfileForm initial={build()} onSave={() => {}} />)

  expect(field('Name')).toHaveValue('Ada')
  expect(field('Email')).toHaveValue('ada@example.com')
})

test('one field changes without disturbing the other', async () => {
  render(<ProfileForm initial={build()} onSave={() => {}} />)

  await retype('Name', 'Grace')

  expect(field('Name')).toHaveValue('Grace')
  expect(field('Email')).toHaveValue('ada@example.com')
})

test('Save reports the current values', async () => {
  const onSave = vi.fn()
  render(<ProfileForm initial={build()} onSave={onSave} />)

  await retype('Name', 'Grace')
  await click('Save')

  expect(onSave).toHaveBeenCalledWith({
    name: 'Grace',
    email: 'ada@example.com',
  })
})

test('Reset puts every field back', async () => {
  render(<ProfileForm initial={build()} onSave={() => {}} />)

  await retype('Name', 'Grace')
  await retype('Email', 'grace@example.com')
  await click('Reset')

  expect(field('Name')).toHaveValue('Ada')
  expect(field('Email')).toHaveValue('ada@example.com')
})

test('Reset still works after a save', async () => {
  render(<ProfileForm initial={build()} onSave={() => {}} />)

  await retype('Name', 'Grace')
  await click('Save')
  await retype('Name', 'Hedy')
  await click('Reset')

  expect(field('Name')).toHaveValue('Ada')
})

test('the object it was handed is never written into', async () => {
  const initial = build()
  render(<ProfileForm initial={initial} onSave={() => {}} />)

  await retype('Name', 'Grace')
  await retype('Email', 'grace@example.com')

  expect(initial).toEqual(build())
})
