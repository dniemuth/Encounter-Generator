import { test, expect } from 'vitest';
import { profCalc } from './helpers';

test('[profCalc]: cr < 4 should return 2', () => {
  expect(profCalc(0)).toBe(2);
  expect(profCalc(0.125)).toBe(2);
  expect(profCalc(0.25)).toBe(2);
  expect(profCalc(0.5)).toBe(2);
  expect(profCalc(1)).toBe(2);
  expect(profCalc(2)).toBe(2);
  expect(profCalc(3)).toBe(2);
  expect(profCalc(4)).toBe(2);
});

test('[profCalc]: cr < 5 - 8 should return 3', () => {
  expect(profCalc(5)).toBe(3);
  expect(profCalc(6)).toBe(3);
  expect(profCalc(7)).toBe(3);
  expect(profCalc(8)).toBe(3);
});

test('[profCalc]: cr < 13 - 16 should return 5', () => {
  expect(profCalc(13)).toBe(5);
  expect(profCalc(14)).toBe(5);
  expect(profCalc(15)).toBe(5);
  expect(profCalc(16)).toBe(5);
});

test('[profCalc]: cr < 25 - 28 should return 8', () => {
  expect(profCalc(25)).toBe(8);
  expect(profCalc(26)).toBe(8);
  expect(profCalc(27)).toBe(8);
  expect(profCalc(28)).toBe(8);
});

test('[profCalc]: cr < 29 - 30 should return 9', () => {
  expect(profCalc(29)).toBe(9);
  expect(profCalc(30)).toBe(9);
});