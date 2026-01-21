import { createLineScorer } from '../../scorers/line';
import { defaultConfig } from '../../rules/config';

describe('Line Scorer', () => {
  const scorer = createLineScorer(defaultConfig);

  it('should return full score for valid line chart data', () => {
    const data = {
      data: [
        { metric1: 1 },
        { metric1: 2 },
        { metric1: 3 },
        { metric1: 4 },
        { metric1: 5 },
        { metric1: 6 },
        { metric1: 7 },
        { metric1: 8 },
        { metric1: 9 },
        { metric1: 10 }
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
      data: [],
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
      data: [
        { metric1: 1 },
        { metric1: 2 },
        { metric1: 3 },
        { metric1: 4 },
        { metric1: 5 },
        { metric1: 6 },
        { metric1: 7 },
        { metric1: 8 },
        { metric1: 9 },
        { metric1: 10 }
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
