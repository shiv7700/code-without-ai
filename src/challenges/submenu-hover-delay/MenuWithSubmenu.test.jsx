import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import MenuWithSubmenu from './MenuWithSubmenu'

const ITEMS = [
  {
    id: 'file',
    label: 'File',
    children: [
      { id: 'new', label: 'New' },
      { id: 'open', label: 'Open' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    children: [{ id: 'undo', label: 'Undo' }],
  },
  { id: 'help', label: 'Help' },
]

function bookings() {
  const jobs = []
  return {
    schedule: (fn) => {
      const job = { fn, live: true }
      jobs.push(job)
      return () => {
        job.live = false
      }
    },
    waiting: () => jobs.filter((job) => job.live).length,
    runAll: () =>
      act(async () => {
        for (const job of jobs.filter((j) => j.live)) {
          job.live = false
          job.fn()
        }
      }),
  }
}

const entry = (name) => screen.getByRole('menuitem', { name })
const submenu = (name) => screen.queryByRole('menu', { name })

test('a named menu, nothing open, and the submenus advertised', () => {
  render(<MenuWithSubmenu items={ITEMS} schedule={bookings().schedule} onSelect={() => {}} />)

  expect(screen.getByRole('menu', { name: 'Main menu' })).toBeInTheDocument()
  expect(entry('File')).toHaveAttribute('aria-haspopup', 'menu')
  expect(entry('File')).toHaveAttribute('aria-expanded', 'false')
  expect(entry('Help')).not.toHaveAttribute('aria-haspopup')
  expect(submenu('File')).toBeNull()
})

test('pointing at an entry opens nothing until the booking runs', async () => {
  const booked = bookings()
  render(<MenuWithSubmenu items={ITEMS} schedule={booked.schedule} onSelect={() => {}} />)

  await userEvent.hover(entry('File'))
  expect(booked.waiting()).toBe(1)
  expect(submenu('File')).toBeNull()

  await booked.runAll()
  expect(submenu('File')).toBeInTheDocument()
  expect(entry('File')).toHaveAttribute('aria-expanded', 'true')
})

test('leaving before it runs means it never opens', async () => {
  const booked = bookings()
  render(<MenuWithSubmenu items={ITEMS} schedule={booked.schedule} onSelect={() => {}} />)

  await userEvent.hover(entry('File'))
  await userEvent.unhover(entry('File'))
  expect(booked.waiting()).toBe(0)

  await booked.runAll()
  expect(submenu('File')).toBeNull()
})

test('sweeping across the menu opens only where the pointer stopped', async () => {
  const booked = bookings()
  render(<MenuWithSubmenu items={ITEMS} schedule={booked.schedule} onSelect={() => {}} />)

  await userEvent.hover(entry('File'))
  await userEvent.hover(entry('Edit'))
  await booked.runAll()

  expect(submenu('Edit')).toBeInTheDocument()
  expect(submenu('File')).toBeNull()
})

test('moving off an open entry closes it', async () => {
  const booked = bookings()
  render(<MenuWithSubmenu items={ITEMS} schedule={booked.schedule} onSelect={() => {}} />)

  await userEvent.hover(entry('File'))
  await booked.runAll()
  expect(submenu('File')).toBeInTheDocument()

  await userEvent.unhover(entry('File'))
  expect(submenu('File')).toBeNull()
})

test('choosing an item reports it', async () => {
  const booked = bookings()
  const onSelect = vi.fn()
  render(<MenuWithSubmenu items={ITEMS} schedule={booked.schedule} onSelect={onSelect} />)

  await userEvent.click(entry('Help'))
  expect(onSelect).toHaveBeenLastCalledWith('help')

  await userEvent.hover(entry('File'))
  await booked.runAll()
  await userEvent.click(entry('Open'))
  expect(onSelect).toHaveBeenLastCalledWith('open')
})

test('unmounting with a booking waiting cancels it', async () => {
  const booked = bookings()
  const { unmount } = render(
    <MenuWithSubmenu items={ITEMS} schedule={booked.schedule} onSelect={() => {}} />,
  )

  await userEvent.hover(entry('File'))
  expect(booked.waiting()).toBe(1)

  unmount()
  expect(booked.waiting()).toBe(0)
})
