import { expect, test } from 'vitest'
import { parseDuration } from './parseDuration'

test('reads a single part', () => {
  expect(parseDuration('500ms')).toBe(500)
  expect(parseDuration('90s')).toBe(90000)
  expect(parseDuration('2h')).toBe(7200000)
  expect(parseDuration('1w')).toBe(604800000)
})

test('parts add up whatever order they are written in', () => {
  expect(parseDuration('1h30m')).toBe(5400000)
  expect(parseDuration('30m1h')).toBe(5400000)
  expect(parseDuration('1d 12h')).toBe(129600000)
})

test('m is minutes and ms is milliseconds', () => {
  expect(parseDuration('5m')).toBe(300000)
  expect(parseDuration('5ms')).toBe(5)
  expect(parseDuration('1m5ms')).toBe(60005)
})

test('zero is a duration', () => {
  expect(parseDuration('0s')).toBe(0)
  expect(parseDuration('0h0m')).toBe(0)
})

test('anything left over makes the whole string invalid', () => {
  expect(parseDuration('1h junk')).toBeNull()
  expect(parseDuration('about 2h')).toBeNull()
  expect(parseDuration('1h,30m')).toBeNull()
})

test('malformed input is null', () => {
  for (const bad of ['', '   ', 'abc', '1', '1x', '1.5h', '-1h', 'h1', null, 42, undefined]) {
    expect(parseDuration(bad)).toBeNull()
  }
})
