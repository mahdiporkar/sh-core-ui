import { createIntlDateAdapter, faIR, normalizeSHDigits } from '../src/locales';
test('normalizes Persian and Arabic digits', () => expect(normalizeSHDigits('۱۲٣')).toBe('123'));
test('provides RTL Persian locale and Persian calendar', () => {
  expect(faIR.direction).toBe('rtl');
  expect(createIntlDateAdapter('fa-IR', 'persian').format(new Date('2026-01-01'))).toBeTruthy();
});
