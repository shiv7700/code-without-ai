import { expect, test } from 'vitest'
import { compareVersions } from './compareVersions'

test('compares segments as numbers, not as text', () => {
  expect(compareVersions('1.10.0', '1.9.0')).toBe(1)
  expect(compareVersions('1.9.0', '1.10.0')).toBe(-1)
  expect(compareVersions('2.0.0', '10.0.0')).toBe(-1)
})

test('the same version is equal', () => {
  expect(compareVersions('1.2.3', '1.2.3')).toBe(0)
})

test('a missing segment counts as zero', () => {
  expect(compareVersions('1.2', '1.2.0')).toBe(0)
  expect(compareVersions('1', '1.0.0')).toBe(0)
  expect(compareVersions('1.2', '1.2.1')).toBe(-1)
})

test('a leading v is ignored', () => {
  expect(compareVersions('v1.0.0', '1.0.0')).toBe(0)
  expect(compareVersions('V2.0.0', 'v1.9.9')).toBe(1)
})

test('a pre-release comes before the release it leads to', () => {
  expect(compareVersions('1.0.0-beta', '1.0.0')).toBe(-1)
  expect(compareVersions('1.0.0', '1.0.0-beta')).toBe(1)
  expect(compareVersions('1.0.0-alpha', '1.0.0-beta')).toBe(-1)
  expect(compareVersions('1.0.0-beta', '0.9.9')).toBe(1)
})

test('it sorts a list', () => {
  const list = ['1.10.0', '1.0.0-rc', '1.2', '1.0.0', '1.9.0']
  expect([...list].sort(compareVersions)).toEqual([
    '1.0.0-rc',
    '1.0.0',
    '1.2',
    '1.9.0',
    '1.10.0',
  ])
})

test('it answers with -1, 0 or 1 and nothing else', () => {
  expect(compareVersions('3.0.0', '1.0.0')).toBe(1)
  expect(compareVersions('1.0.0', '3.0.0')).toBe(-1)
})
