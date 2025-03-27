import { convertStringToDateValue, validateDate } from '../../../src/utils/common';

describe('validateDate', () => {
  it('validateDate("test") should return false', () => {
    expect(validateDate('test')).toBeFalsy();
  });

  it('validateDate of yyyy-mm-dd-like string', () => {
    expect(validateDate('2023-01-01')).toBeTruthy();
    expect(validateDate('2023 01 01')).toBeTruthy();
    expect(validateDate('20230101')).toBeTruthy();
  });

  it('validateDate of "2023年01月01日"-like string', () => {
    expect(validateDate('2023年01月01日')).toBeTruthy();
    expect(validateDate('2023年1月1日')).toBeTruthy();
    expect(validateDate('2023年12月1日')).toBeTruthy();
    expect(validateDate('2023年1月12日')).toBeTruthy();
  });

  it('validateDate of "2023年1月"-like string', () => {
    expect(validateDate('2023年1月')).toBeTruthy();
    expect(validateDate('2023年12月')).toBeTruthy();
    expect(validateDate('2023年01月')).toBeTruthy();
    expect(validateDate('2023年00月')).toBeFalsy();
  });

  it('validateDate of "12月1日"-like string', () => {
    expect(validateDate('12月1日')).toBeTruthy();
    expect(validateDate('12月12日')).toBeTruthy();
    expect(validateDate('1月1日')).toBeTruthy();
    expect(validateDate('1月10日')).toBeTruthy();
    expect(validateDate('12月99日')).toBeFalsy();
  });

  it('validateDate of "2023年"-like string', () => {
    expect(validateDate('2023年')).toBeTruthy();
  });

  it('validateDate of "1月"-like string', () => {
    expect(validateDate('1月')).toBeTruthy();
  });

  it('validateDate of "Q1"-like string', () => {
    expect(validateDate('Q1')).toBeTruthy();
  });
});

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
