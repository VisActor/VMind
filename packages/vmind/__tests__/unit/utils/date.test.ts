import { convertStringToDateValue } from '../../../src/utils/common';
describe('convertStringToDateValue', () => {
  it('convertStringToDateValue("2023-01-01") should return "2023-01-01"', () => {
    expect(convertStringToDateValue('2023-01-01')).toBe('2023-01-01');
  });
  it('convertStringToDateValue("2023 01 01") should return "2023-01-01"', () => {
    expect(convertStringToDateValue('2023 01 01')).toBe('2023 01 01');
  });

  it('convertStringToDateValue("20230101") should return "20230101"', () => {
    expect(convertStringToDateValue('20230101')).toBe('20230101');
  });

  it('convertStringToDateValue("2023年01月01日") should return "2023-01-01"', () => {
    expect(convertStringToDateValue('2023年01月01日')).toBe('2023-01-01');
  });
});
