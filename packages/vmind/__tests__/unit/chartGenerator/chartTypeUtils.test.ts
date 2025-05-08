import { formatTypeToVMind } from '../../../src/atom/chartGenerator/spec/chartTypeUtils';

describe('formatTypeToVMind', () => {
  it('should return the correct vmind type', () => {
    expect(formatTypeToVMind('bar')).toBe('Bar Chart');

    expect(formatTypeToVMind('line')).toBe('Line Chart');

    expect(formatTypeToVMind('area')).toBe('Area Chart');

    expect(formatTypeToVMind('pie')).toBe('Pie Chart');

    expect(formatTypeToVMind('wordCloud')).toBe('Word Cloud');

    expect(formatTypeToVMind('rose')).toBe('Rose Chart');

    expect(formatTypeToVMind('radar')).toBe('Radar Chart');

    expect(formatTypeToVMind('sankey')).toBe('Sankey Chart');

    expect(formatTypeToVMind('funnel')).toBe('Funnel Chart');

    expect(formatTypeToVMind('common')).toBe('Dual Axis Chart');

    expect(formatTypeToVMind('waterfall')).toBe('Waterfall Chart');

    expect(formatTypeToVMind('boxPlot')).toBe('Box Plot');

    expect(formatTypeToVMind('liquid')).toBe('Liquid Chart');

    expect(formatTypeToVMind('linearProgress')).toBe('Linear Progress chart');

    expect(formatTypeToVMind('circularProgress')).toBe('Circular Progress chart');

    expect(formatTypeToVMind('circlePacking')).toBe('Bubble Circle Packing');

    expect(formatTypeToVMind('map')).toBe('Map Chart');

    expect(formatTypeToVMind('rangeColumn')).toBe('Range Column Chart');

    expect(formatTypeToVMind('sunburst')).toBe('Sunburst Chart');

    expect(formatTypeToVMind('treemap')).toBe('Treemap Chart');

    expect(formatTypeToVMind('gauge')).toBe('Gauge Chart');

    expect(formatTypeToVMind('heatMap')).toBe('Basic Heat Map');

    expect(formatTypeToVMind('venn')).toBe('Venn Chart');
  });
});
