import { isNumber } from '@visactor/vutils';

export function isInteger(value: any) {
  return typeof value == 'number' && Number.isInteger(value);
}

export function isNaN(value: any) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}
