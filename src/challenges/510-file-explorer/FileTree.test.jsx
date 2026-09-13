import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import FileTree from './FileTree'

const TREE = {
  name: 'root',
  children: [
    { name: 'README.md' },
    {
      name: 'src',
      children: [
        { name: 'b.js' },
        { name: 'a.js' },
        { name: 'utils', children: [{ name: 'dates.js' }] },
      ],
    },
    { name: 'package.json' },
  ],
}

const setup = () => ({ user: userEvent.setup(), ...render(<FileTree node={TREE} />) })
const names = () => screen.getAllByTestId('entry').map((e) => e.dataset.name)
const open = (user, name) => user.click(screen.getByRole('button', { name }))

test('everything starts collapsed', () => {
  setup()
  expect(names()).toEqual(['root'])
})

test('a folder is a button, a file is not', async () => {
  const { user } = setup()
  await open(user, 'root')

  expect(screen.getByRole('button', { name: 'src' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'README.md' })).not.toBeInTheDocument()
})

test('opening a folder reveals its children', async () => {
  const { user } = setup()
  await open(user, 'root')

  expect(names()).toContain('src')
  expect(names()).toContain('README.md')
})

test('folders come before files, each group alphabetical', async () => {
  const { user } = setup()
  await open(user, 'root')

  expect(names()).toEqual(['root', 'src', 'package.json', 'README.md'])
})

test('grandchildren stay hidden until their folder is opened', async () => {
  const { user } = setup()
  await open(user, 'root')

  expect(names()).not.toContain('a.js')
})

test('nesting goes as deep as the data', async () => {
  const { user } = setup()
  await open(user, 'root')
  await open(user, 'src')
  await open(user, 'utils')

  expect(names()).toEqual([
    'root',
    'src',
    'utils',
    'dates.js',
    'a.js',
    'b.js',
    'package.json',
    'README.md',
  ])
})

test('clicking an open folder collapses it again', async () => {
  const { user } = setup()
  await open(user, 'root')
  await open(user, 'root')

  expect(names()).toEqual(['root'])
})

test('a folder reports whether it is open', async () => {
  const { user } = setup()
  const root = screen.getByRole('button', { name: 'root' })
  expect(root).toHaveAttribute('aria-expanded', 'false')

  await open(user, 'root')
  expect(root).toHaveAttribute('aria-expanded', 'true')
})

test('two folders open independently', async () => {
  const { user } = setup()
  await open(user, 'root')
  await open(user, 'src')

  expect(screen.getByRole('button', { name: 'utils' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})
