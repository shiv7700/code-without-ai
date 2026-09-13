import { expect, test } from 'vitest'
import { classNames } from './classNames'

test('joins strings with a single space', () => {
  expect(classNames('a', 'b')).toBe('a b')
})

test('no arguments gives an empty string', () => {
  expect(classNames()).toBe('')
})

test('drops falsy values without leaving gaps', () => {
  expect(classNames('a', null, undefined, false, '', 'b')).toBe('a b')
})

test('keeps truthy numbers, drops zero', () => {
  expect(classNames(1, 'a', 0)).toBe('1 a')
})

test('an object contributes the keys whose value is truthy', () => {
  expect(classNames({ active: true, disabled: false, open: 1 })).toBe('active open')
})

test('mixes strings and objects', () => {
  expect(classNames('btn', { primary: true }, 'lg')).toBe('btn primary lg')
})

test('an array is flattened', () => {
  expect(classNames(['a', 'b'], 'c')).toBe('a b c')
})

test('arrays nest as deep as they like', () => {
  expect(classNames('a', ['b', ['c', { d: true }, [false, 'e']]])).toBe('a b c d e')
})

test('an empty object or array adds nothing', () => {
  expect(classNames('a', {}, [], 'b')).toBe('a b')
})
