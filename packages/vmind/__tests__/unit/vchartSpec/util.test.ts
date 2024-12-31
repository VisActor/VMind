import { checkDuplicatedKey, convertFunctionString, removeUnneedArrayInSpec } from '../../../src/atom/VChartSpec/utils';

describe('checkDuplicatedKey', () => {
  it('should return null when not match', () => {
    expect(checkDuplicatedKey('a.b.c', 'd')).toBeNull();
  });

  it('should return correct result', () => {
    expect(checkDuplicatedKey('[0].a', 'a')).toEqual({
      remainKeyPath: ''
    });
    expect(checkDuplicatedKey('a.b.c', 'b')).toEqual({
      remainKeyPath: 'c'
    });
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

describe('convertFunctionString', () => {
  it('should convert arrow function string to function', () => {
    const func1 = convertFunctionString('(datum, index) => index === 0? "red" : null');
    expect(func1({}, 0)).toBe('red');
    expect(func1({}, 1)).toBeNull();
  });

  it('should convert function string to function', () => {
    const func1 = convertFunctionString('function(datum, index) { return index === 0? "red" : null }');
    expect(func1({}, 0)).toBe('red');
    expect(func1({}, 1)).toBeNull();
  });

  it('should not convert normal string', () => {
    const str1 = convertFunctionString('a');
    expect(str1).toBe('a');
  });

  it('should not convert normal object', () => {
    const obj1 = convertFunctionString({ a: 1 });
    expect(obj1).toEqual({ a: 1 });
  });

  it('should not convert normal array', () => {
    const arr1 = convertFunctionString([1, 2, 3]);
    expect(arr1).toEqual([1, 2, 3]);
  });

  it('should not convert normal number', () => {
    const num1 = convertFunctionString(1);
    expect(num1).toBe(1);
  });

  it('should not convert normal boolean', () => {
    const bool1 = convertFunctionString(true);
    expect(bool1).toBe(true);
  });

  it('should not convert normal null', () => {
    const null1 = convertFunctionString(null);
    expect(null1).toBeNull();
  });
  it('should not convert normal undefined', () => {
    const undefined1 = convertFunctionString(undefined);
    expect(undefined1).toBeUndefined();
  });
  it('should not convert normal function', () => {
    const func1 = convertFunctionString(() => {
      return 1;
    });
    expect(func1).toBeInstanceOf(Function);
  });
  it('should not convert normal arrow function', () => {
    const func1 = convertFunctionString(() => 1);
    expect(func1).toBeInstanceOf(Function);
  });
  it('should not convert normal object with function', () => {
    const spec = { a: () => 1 };
    const obj1 = convertFunctionString(spec);
    expect(obj1.a).toEqual(spec.a);
  });
});

describe('removeUnneedArrayInSpec', () => {
  it('should remove unneed array in spec', () => {
    expect(
      removeUnneedArrayInSpec(
        {
          legends: [{ orient: 'left' }]
        },
        'legends',
        'legends'
      )
    ).toEqual({ orient: 'left' });

    expect(
      removeUnneedArrayInSpec(
        {
          legends: [{ orient: 'left' }]
        },
        'legends',
        'legends[0]'
      )
    ).toEqual({ orient: 'left' });

    expect(
      removeUnneedArrayInSpec(
        {
          'legends[0]': { orient: 'left' }
        },
        'legends',
        'legends[0]'
      )
    ).toEqual({ orient: 'left' });

    expect(
      removeUnneedArrayInSpec(
        {
          'legends[0]': { orient: 'left' }
        },
        'legends',
        'legends'
      )
    ).toEqual({ orient: 'left' });
  });
});
