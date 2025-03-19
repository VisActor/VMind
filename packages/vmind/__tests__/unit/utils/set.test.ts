import { set } from '../../../src/utils/set';

describe('set', () => {
  it('should set value correctly', () => {
    const spec = { padding: { top: 0, left: 0 } };
    set(spec, 'padding', 10);

    expect(spec).toEqual({ padding: 10 });
  });

  it('should handle nested object correctly', () => {
    const spec = { label: { a: 1 } };
    set(spec, 'label.visible', false);
    expect(spec).toEqual({ label: { a: 1, visible: false } });
  });

  it('should set value correctly when value is null', () => {
    const spec = { padding: { top: 0, left: 0 } };
    set(spec, 'padding', null);

    expect(spec).toEqual({ padding: null });
  });

  it('should set value correctly when value is undefined', () => {
    const spec = { padding: { top: 0, left: 0 } };
    set(spec, 'padding', undefined);

    expect(spec).toEqual({ padding: { top: 0, left: 0 } });
  });

  it('should create new object when path does not exist', () => {
    const spec = {};
    set(spec, 'padding.top', 10);

    expect(spec).toEqual({ padding: { top: 10 } });
  });

  it('should set value on existing object when path exists', () => {
    const spec = { padding: { top: 0, left: 0 } };
    set(spec, 'padding.top', 10);

    expect(spec).toEqual({ padding: { top: 10, left: 0 } });
  });

  it('should set value on existing object when path exists and value is null', () => {
    const spec = { padding: { top: 0, left: 0 } };
    set(spec, 'padding.top', null);

    expect(spec).toEqual({ padding: { top: null, left: 0 } });
  });

  it('should set value on existing object when path exists and value is undefined', () => {
    const spec = { padding: { top: 0, left: 0 } };
    set(spec, 'padding.top', undefined);

    expect(spec).toEqual({ padding: { top: 0, left: 0 } });
  });

  it('should set value when prev value is a string', () => {
    const spec = { xField: 'x' };
    set(spec, 'xField', ['x', 'y']);

    expect(spec).toEqual({ xField: ['x', 'y'] });

    set(spec, 'xField', 0);
    expect(spec).toEqual({ xField: 0 });
  });
});
