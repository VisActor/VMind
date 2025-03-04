import { deleteByPath } from '../../../src/utils/set';

describe('deleteByPath', () => {
  it('should delete entire object property', () => {
    const spec = { padding: { top: 0, left: 0 } };

    deleteByPath(spec, 'padding');
    expect(spec).toEqual({});
  });

  it('should delete nested object property', () => {
    const spec = { padding: { top: 0, left: 0 } };
    deleteByPath(spec, 'padding.top');
    expect(spec).toEqual({ padding: { left: 0 } });
  });
  it('should delete entire array property', () => {
    const spec = { padding: [0, 1] };
    deleteByPath(spec, 'padding');
    expect(spec).toEqual({});
  });
  it('should delete first array item using dot notation', () => {
    const spec = { padding: [0, 1] };
    deleteByPath(spec, 'padding.0');
    expect(spec).toEqual({ padding: [1] });
  });
  it('should delete second array item using dot notation', () => {
    const spec = { padding: [0, 1] };
    deleteByPath(spec, 'padding.1');
    expect(spec).toEqual({ padding: [0] });
  });
  it('should delete first array item using bracket notation', () => {
    const spec = { padding: [0, 1] };
    deleteByPath(spec, 'padding[0]');
    expect(spec).toEqual({ padding: [1] });
  });
  it('should delete second array item using bracket notation', () => {
    const spec = { padding: [0, 1] };
    deleteByPath(spec, 'padding[1]');
    expect(spec).toEqual({ padding: [0] });
  });

  it('should delete null when property is null', () => {
    const spec = { padding: null } as any;
    deleteByPath(spec, 'padding');
    expect(spec).toEqual({});
  });

  it('should delete undefined when property is undefined', () => {
    const spec = { padding: undefined } as any;
    deleteByPath(spec, 'padding');
    expect(spec).toEqual({});
  });
});
