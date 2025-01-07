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
});
