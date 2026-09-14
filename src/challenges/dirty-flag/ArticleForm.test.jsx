import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ArticleForm from './ArticleForm'

const build = () => ({ title: 'Draft', body: 'Some words' })

const title = () => screen.getByLabelText('Title')
const save = () => screen.getByRole('button', { name: 'Save' })

test('Save is disabled on a form nobody has touched', () => {
  render(<ArticleForm initial={build()} onSave={() => {}} />)
  expect(save()).toBeDisabled()
})

test('an edit enables Save', async () => {
  render(<ArticleForm initial={build()} onSave={() => {}} />)

  await userEvent.type(title(), '!')

  expect(title()).toHaveValue('Draft!')
  expect(save()).toBeEnabled()
})

test('undoing the edit disables it again', async () => {
  render(<ArticleForm initial={build()} onSave={() => {}} />)

  await userEvent.type(title(), '!')
  await userEvent.type(title(), '{backspace}')

  expect(title()).toHaveValue('Draft')
  expect(save()).toBeDisabled()
})

test('Save reports the values and goes clean', async () => {
  const onSave = vi.fn()
  render(<ArticleForm initial={build()} onSave={onSave} />)

  await userEvent.type(title(), '!')
  await userEvent.click(save())

  expect(onSave).toHaveBeenCalledWith({ title: 'Draft!', body: 'Some words' })
  expect(save()).toBeDisabled()
})

test('after a save, dirty is measured against what was saved', async () => {
  render(<ArticleForm initial={build()} onSave={() => {}} />)

  await userEvent.type(title(), '!')
  await userEvent.click(save())

  await userEvent.type(title(), '?')
  expect(save()).toBeEnabled()

  await userEvent.type(title(), '{backspace}')
  expect(title()).toHaveValue('Draft!')
  expect(save()).toBeDisabled()
})

test('the object it was handed is never written into', async () => {
  const initial = build()
  render(<ArticleForm initial={initial} onSave={() => {}} />)

  await userEvent.type(title(), '!')
  await userEvent.click(save())

  expect(initial).toEqual(build())
})
