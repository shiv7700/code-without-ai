import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ProfileForm from './ProfileForm'

const PROFILE = { name: 'Ada', email: 'ada@lovelace.dev', city: 'London' }

const field = (label) => screen.getByLabelText(label)
const save = () => screen.getByRole('button', { name: 'Save' })

test('the inputs start out showing the profile', () => {
  render(<ProfileForm profile={PROFILE} onSave={() => {}} />)

  expect(field('Name')).toHaveValue('Ada')
  expect(field('Email')).toHaveValue('ada@lovelace.dev')
  expect(field('City')).toHaveValue('London')
})

test('typing in one field leaves the other two alone', async () => {
  render(<ProfileForm profile={PROFILE} onSave={() => {}} />)

  await userEvent.clear(field('City'))
  await userEvent.type(field('City'), 'Paris')

  expect(field('City')).toHaveValue('Paris')
  expect(field('Name')).toHaveValue('Ada')
  expect(field('Email')).toHaveValue('ada@lovelace.dev')
})

test('Save reports every field, edited or not', async () => {
  const onSave = vi.fn()
  render(<ProfileForm profile={PROFILE} onSave={onSave} />)

  await userEvent.type(field('Name'), 'm')
  await userEvent.click(save())

  expect(onSave).toHaveBeenCalledWith({
    name: 'Adam',
    email: 'ada@lovelace.dev',
    city: 'London',
  })
})

test('several fields can be edited one after another', async () => {
  const onSave = vi.fn()
  render(<ProfileForm profile={PROFILE} onSave={onSave} />)

  await userEvent.clear(field('Name'))
  await userEvent.type(field('Name'), 'Grace')
  await userEvent.clear(field('City'))
  await userEvent.type(field('City'), 'Arlington')
  await userEvent.click(save())

  expect(onSave).toHaveBeenCalledWith({
    name: 'Grace',
    email: 'ada@lovelace.dev',
    city: 'Arlington',
  })
})

test('the profile it was handed is left untouched', async () => {
  const profile = { ...PROFILE }
  const onSave = vi.fn()
  render(<ProfileForm profile={profile} onSave={onSave} />)

  await userEvent.type(field('Name'), 'm')
  await userEvent.click(save())

  expect(profile).toEqual(PROFILE)
  expect(onSave.mock.calls[0][0]).not.toBe(profile)
})
