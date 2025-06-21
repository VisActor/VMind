import { ScoringConfig } from '../types';

export const defaultConfig: ScoringConfig = {
  thresholds: {
    maxBarNumber: 30,
    minBarNumber: 2,
    maxDataRange: 1000,
    minDataRatio: 0.01
  },
  weights: {
    dimensionCheck: 1.0,
    dataRange: 3.0,
    dataDistribution: 2.0,
    userPurpose: 1.0
  }
};
