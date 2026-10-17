import numeral from 'numeral';
// ----------------------------------------------------------------------

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(input: number | string | null | undefined): string {
  let number = Number(input);

  if (Number.isNaN(number) || Math.abs(number) < 1e-10) {
    number = 0;
  }

  const isNegative = number < 0;
  const absValue = Math.abs(number);
  const formatted = numeral(absValue).format('0,0.00');

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function fPercent(number: InputValue) {
  if (number === 0) {
    return '0%';
  }
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export const getCurrencySymbol = () => '£';
