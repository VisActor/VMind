import { checkDuplicatedKey } from '../../../src/atom/VChartSpec/utils';

describe('checkDuplicatedKey', () => {
  it('should return null when not match', () => {
    expect(checkDuplicatedKey('a.b.c', 'd')).toBeNull();
    expect(checkDuplicatedKey('a.b.c', 'b')).toBeNull();

    expect(checkDuplicatedKey('[0].a', 'a')).toBeNull();
  });

  it('should return correct result', () => {
    expect(checkDuplicatedKey('[0].a', '0')).toEqual({
      remainKeyPath: 'a'
    });
    expect(checkDuplicatedKey('a.b.c', 'a')).toEqual({
      remainKeyPath: 'b.c'
    });
    expect(checkDuplicatedKey('a[0].b.c', 'a')).toEqual({
      remainKeyPath: '[0].b.c'
    });
    expect(checkDuplicatedKey('a[0].b.c', 'a[0]')).toEqual({
      remainKeyPath: 'b.c'
    });
    expect(checkDuplicatedKey('a[0].b.c', 'a[0].b')).toEqual({
      remainKeyPath: 'c'
    });
    expect(checkDuplicatedKey('a[0].b.c', 'a[0].b.c')).toEqual({
      remainKeyPath: ''
    });
  });
});
