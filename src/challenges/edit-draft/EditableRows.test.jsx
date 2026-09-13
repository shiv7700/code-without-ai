import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import EditableRows from './EditableRows'

const build = () => [
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
]

const names = () =>
  screen.queryAllByRole('listitem').map((li) => li.textContent.replace(/Edit.*/, ''))

const edit = (name) =>
  userEvent.click(screen.getByRole('button', { name: `Edit ${name}` }))
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

const retype = async (value) => {
  await userEvent.clear(screen.getByLabelText('Name'))
  await userEvent.type(screen.getByLabelText('Name'), value)
}

test('Edit swaps the row for an input seeded with its name', async () => {
  render(<EditableRows rows={build()} onSave={() => {}} />)

  await edit('Banana')

  expect(screen.getByLabelText('Name')).toHaveValue('Banana')
  expect(screen.getByRole('button', { name: 'Edit Apple' })).toBeInTheDocument()
})

test('only one row edits at a time', async () => {
  render(<EditableRows rows={build()} onSave={() => {}} />)

  await edit('Apple')
  await click('Cancel')
  await edit('Banana')

  expect(screen.getAllByLabelText('Name')).toHaveLength(1)
})

test('Save writes the new name back and closes the editor', async () => {
  const onSave = vi.fn()
  render(<EditableRows rows={build()} onSave={onSave} />)

  await edit('Apple')
  await retype('Apricot')
  await click('Save')

  expect(names()).toEqual(['Apricot', 'Banana'])
  expect(onSave).toHaveBeenCalledWith({ id: 'a', name: 'Apricot' })
  expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
})

test('Cancel leaves the row exactly as it was', async () => {
  render(<EditableRows rows={build()} onSave={() => {}} />)

  await edit('Apple')
  await retype('Apricot')
  await click('Cancel')

  expect(names()).toEqual(['Apple', 'Banana'])
  expect(screen.getByRole('button', { name: 'Edit Apple' })).toBeInTheDocument()
})

test('reopening after a cancel starts from the stored name again', async () => {
  render(<EditableRows rows={build()} onSave={() => {}} />)

  await edit('Apple')
  await retype('Apricot')
  await click('Cancel')
  await edit('Apple')

  expect(screen.getByLabelText('Name')).toHaveValue('Apple')
})

test('the rows it was handed are never written into', async () => {
  const rows = build()
  render(<EditableRows rows={rows} onSave={() => {}} />)

  await edit('Apple')
  await retype('Apricot')
  await click('Save')

  expect(rows).toEqual(build())
})
