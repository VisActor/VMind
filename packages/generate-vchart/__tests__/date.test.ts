import { validateDate } from '../src';

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
