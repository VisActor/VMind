import { createLineScorer } from '../../scorers/line';
import { defaultConfig } from '../../rules/config';

describe('Line Scorer', () => {
  const scorer = createLineScorer(defaultConfig);

  it('should return full score for valid line chart data', () => {
    const data = {
      bars: [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: 10 }
      ],
      dimensions: ['dim1'],
      metrics: ['metric1'],
      chartType: 'line'
    };
    const result = scorer(data, defaultConfig);
    expect(result.score).toBe(1);
    expect(result.details.dataRange).toBe(true);
    expect(result.details.dimensionMetric).toBe(true);
  });

  it('should return zero score for invalid bar count', () => {
    const data = {
      bars: [],
      dimensions: ['dim1'],
      metrics: ['metric1'],
      chartType: 'line'
    };
    const result = scorer(data, defaultConfig);
    expect(result.score).toBeLessThan(1);
    expect(result.details.dataRange).toBe(false);
  });

  it('should return zero score for missing dimensions/metrics', () => {
    const data = {
      bars: [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: 10 }
      ],
      dimensions: [],
      metrics: [],
      chartType: 'line'
    };
    const result = scorer(data, defaultConfig);
    expect(result.score).toBeLessThan(1);
    expect(result.details.dimensionMetric).toBe(false);
  });
});
