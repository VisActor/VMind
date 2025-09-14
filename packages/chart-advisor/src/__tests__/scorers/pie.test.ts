import { createPieScorer } from '../../scorers/pie';
import { defaultConfig } from '../../rules/config';

describe('Pie Scorer', () => {
  const scorer = createPieScorer(defaultConfig);

  it('should return full score for valid pie chart data', () => {
    const data = {
      data: [{ metric1: 1 }, { metric1: 2 }, { metric1: 3 }, { metric1: 4 }, { metric1: 5 }],
      dimensions: ['dim1'],
      metrics: ['metric1'],
      chartType: 'pie'
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
      chartType: 'pie'
    };
    const result = scorer(data, defaultConfig);
    expect(result.score).toBeLessThan(1);
    expect(result.details.dataRange).toBe(false);
  });

  it('should return zero score for missing dimensions/metrics', () => {
    const data = {
      data: [{ metric1: 1 }, { metric1: 2 }, { metric1: 3 }, { metric1: 4 }, { metric1: 5 }],
      dimensions: [],
      metrics: [],
      chartType: 'pie'
    };
    const result = scorer(data, defaultConfig);
    expect(result.score).toBeLessThan(1);
    expect(result.details.dimensionMetric).toBe(false);
  });
});
