import { scorer } from '../score';
import { ChartType, UserPurpose, ScreenSize } from '../type';

describe('scorer', () => {
  it('should return COLUMN chart type for basic bar scenario', () => {
    const dimList = [
      {
        uniqueID: 1,
        data: ['A', 'B', 'C'],
        dataType: 'string' as const,
        cardinal: 3
      }
    ];
    const measureList = [
      {
        uniqueID: 2,
        data: [10, 20, 30],
        min: 10,
        max: 30,
        mean: 20,
        standardDev: 10,
        coefficient: 0.5,
        Q1: 10
      }
    ];
    const inputDataSet = [
      { 1: 'A', 2: '10' },
      { 1: 'B', 2: '20' },
      { 1: 'C', 2: '30' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const result = resultFns[0]();
    expect(result.chartType).toBe(ChartType.COLUMN);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return COLUMN_PERCENT chart type', () => {
    const dimList = [
      { uniqueID: 1, data: ['A', 'B'], dataType: 'string' as const, cardinal: 2 },
      { uniqueID: 2, data: ['X', 'Y'], dataType: 'string' as const, cardinal: 2 }
    ];
    const measureList = [
      { uniqueID: 3, data: [10, 20, 30, 40], min: 10, max: 40, mean: 25, standardDev: 12, coefficient: 0.48, Q1: 10 }
    ];
    const inputDataSet = [
      { 1: 'A', 2: 'X', 3: '10' },
      { 1: 'A', 2: 'Y', 3: '20' },
      { 1: 'B', 2: 'X', 3: '30' },
      { 1: 'B', 2: 'Y', 3: '40' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const result = resultFns[1]();
    expect(result.chartType).toBe(ChartType.COLUMN_PERCENT);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return COLUMN_PARALLEL chart type', () => {
    const dimList = [{ uniqueID: 1, data: ['A', 'B'], dataType: 'string' as const, cardinal: 2 }];
    const measureList = [
      { uniqueID: 2, data: [10, 20], min: 10, max: 20, mean: 15, standardDev: 5, coefficient: 0.33, Q1: 10 },
      { uniqueID: 3, data: [15, 25], min: 15, max: 25, mean: 20, standardDev: 5, coefficient: 0.25, Q1: 15 }
    ];
    const inputDataSet = [
      { 1: 'A', 2: '10', 3: '15' },
      { 1: 'B', 2: '20', 3: '25' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const result = resultFns[2]();
    expect(result.chartType).toBe(ChartType.COLUMN_PARALLEL);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return SCATTER chart type', () => {
    const dimList = [
      {
        uniqueID: 1,
        data: [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          'AA',
          'AB',
          'AC',
          'AD'
        ],
        dataType: 'string' as const,
        cardinal: 30
      }
    ];
    const measureList = [
      {
        uniqueID: 2,
        data: Array(30)
          .fill(1)
          .map((_, i) => i + 1),
        min: 1,
        max: 30,
        mean: 15.5,
        standardDev: 8.7,
        coefficient: 0.56,
        Q1: 8
      },
      {
        uniqueID: 3,
        data: Array(30)
          .fill(2)
          .map((_, i) => i + 2),
        min: 2,
        max: 31,
        mean: 16.5,
        standardDev: 8.7,
        coefficient: 0.53,
        Q1: 9
      }
    ];
    const inputDataSet = Array(30)
      .fill(0)
      .map((_, i) => ({ 1: String.fromCharCode(65 + (i % 26)), 2: String(i + 1), 3: String(i + 2) }));
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const result = resultFns[3]();
    expect(result.chartType).toBe(ChartType.SCATTER);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return LINE chart type', () => {
    const dimList = [
      { uniqueID: 1, data: ['2020-01-01', '2020-01-02', '2020-01-03'], dataType: 'date' as const, cardinal: 3 }
    ];
    const measureList = [
      { uniqueID: 2, data: [10, 20, 30], min: 10, max: 30, mean: 20, standardDev: 10, coefficient: 0.5, Q1: 10 }
    ];
    const inputDataSet = [
      { 1: '2020-01-01', 2: '10' },
      { 1: '2020-01-02', 2: '20' },
      { 1: '2020-01-03', 2: '30' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const result = resultFns[4]();
    expect(result.chartType).toBe(ChartType.LINE);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return PIE chart type for pie scenario', () => {
    const dimList = [];
    const measureList = [
      { uniqueID: 2, data: [10, 20, 30], min: 10, max: 30, mean: 20, standardDev: 10, coefficient: 0.5, Q1: 10 },
      { uniqueID: 3, data: [5, 15, 25], min: 5, max: 25, mean: 15, standardDev: 10, coefficient: 0.66, Q1: 5 },
      { uniqueID: 4, data: [8, 18, 28], min: 8, max: 28, mean: 18, standardDev: 10, coefficient: 0.55, Q1: 8 }
    ];
    const inputDataSet = [
      { 2: '10', 3: '5', 4: '8' },
      { 2: '20', 3: '15', 4: '18' },
      { 2: '30', 3: '25', 4: '28' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const pieResult = resultFns[5]();
    expect(pieResult.chartType).toBe(ChartType.PIE);
    expect(pieResult.score).toBeGreaterThanOrEqual(0);
    expect(pieResult.fullMark).toBeGreaterThan(0);
  });

  it('should return RADAR chart type', () => {
    const dimList = [{ uniqueID: 1, data: ['A', 'B'], dataType: 'string' as const, cardinal: 2 }];
    const measureList = [
      { uniqueID: 2, data: [10, 20], min: 10, max: 20, mean: 15, standardDev: 5, coefficient: 0.33, Q1: 10 }
    ];
    const inputDataSet = [
      { 1: 'A', 2: '10' },
      { 1: 'B', 2: '20' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList, purpose: UserPurpose.DISTRIBUTION });
    const result = resultFns[6]();
    expect(result.chartType).toBe(ChartType.RADAR);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return WORD_CLOUD chart type', () => {
    const dimList = [
      {
        uniqueID: 1,
        data: Array(20)
          .fill(0)
          .map((_, i) => `word${i}`),
        dataType: 'string' as const,
        cardinal: 20
      }
    ];
    const measureList = [];
    const inputDataSet = Array(20)
      .fill(0)
      .map((_, i) => ({ 1: `word${i}` }));
    const resultFns = scorer({ inputDataSet, dimList, measureList, purpose: UserPurpose.STORYTELLING });
    const result = resultFns[7]();
    expect(result.chartType).toBe(ChartType.WORD_CLOUD);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return FUNNEL chart type', () => {
    const dimList = [{ uniqueID: 1, data: ['A'], dataType: 'string' as const, cardinal: 1 }];
    const measureList = [
      { uniqueID: 2, data: [10], min: 10, max: 10, mean: 10, standardDev: 0, coefficient: 0, Q1: 10 }
    ];
    const inputDataSet = [{ 1: 'A', 2: '10' }];
    const resultFns = scorer({ inputDataSet, dimList, measureList, purpose: UserPurpose.TREND });
    const result = resultFns[8]();
    expect(result.chartType).toBe(ChartType.FUNNEL);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  it('should return DUAL_AXIS chart type', () => {
    const dimList = [{ uniqueID: 1, data: ['A', 'B'], dataType: 'string' as const, cardinal: 2 }];
    const measureList = [
      { uniqueID: 2, data: [1, 200], min: 1, max: 200, mean: 100.5, standardDev: 140.007, coefficient: 1.393, Q1: 1 },
      { uniqueID: 3, data: [300, 400], min: 300, max: 400, mean: 350, standardDev: 70.71, coefficient: 0.202, Q1: 300 }
    ];
    const inputDataSet = [
      { 1: 'A', 2: '1', 3: '300' },
      { 1: 'B', 2: '200', 3: '400' }
    ];
    const resultFns = scorer({ inputDataSet, dimList, measureList });
    const result = resultFns[9]();
    expect(result.chartType).toBe(ChartType.DUAL_AXIS);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fullMark).toBeGreaterThan(0);
  });

  // 边界与异常场景
  describe('异常与边界场景', () => {
    it('should handle empty inputDataSet', () => {
      const dimList = [{ uniqueID: 1, data: [], dataType: 'string' as const, cardinal: 0 }];
      const measureList = [{ uniqueID: 2, data: [], min: 0, max: 0, mean: 0, standardDev: 0, coefficient: 0, Q1: 0 }];
      const inputDataSet = [];
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      resultFns.forEach(fn => {
        const result = fn();
        expect(result.score).toBe(0);
        expect(result.fullMark).toBe(0);
        expect(result.chartType).toBeDefined();
      });
    });

    it('should handle empty dimList', () => {
      const dimList = [];
      const measureList = [
        { uniqueID: 2, data: [10, 20], min: 10, max: 20, mean: 15, standardDev: 5, coefficient: 0.33, Q1: 10 }
      ];
      const inputDataSet = [{ 2: '10' }, { 2: '20' }];
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      resultFns.forEach(fn => {
        const result = fn();
        expect(result.chartType).toBeDefined();
      });
    });

    it('should handle empty measureList', () => {
      const dimList = [{ uniqueID: 1, data: ['A', 'B'], dataType: 'string' as const, cardinal: 2 }];
      const measureList = [];
      const inputDataSet = [{ 1: 'A' }, { 1: 'B' }];
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      resultFns.forEach(fn => {
        const result = fn();
        expect(result.chartType).toBeDefined();
      });
    });

    it('should handle mismatched data types', () => {
      const dimList = [{ uniqueID: 1, data: ['A', 'B'], dataType: 'date' as const, cardinal: 2 }];
      const measureList = [
        { uniqueID: 2, data: [10, 20], min: 10, max: 20, mean: 15, standardDev: 5, coefficient: 0.33, Q1: 10 }
      ];
      const inputDataSet = [
        { 1: 'A', 2: '10' },
        { 1: 'B', 2: '20' }
      ];
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      resultFns.forEach(fn => {
        const result = fn();
        expect(result.chartType).toBeDefined();
      });
    });

    it('should handle large data size', () => {
      const dimList = [
        {
          uniqueID: 1,
          data: Array(101)
            .fill(0)
            .map((_, i) => `A${i}`),
          dataType: 'string' as const,
          cardinal: 101
        }
      ];
      const measureList = [
        { uniqueID: 2, data: Array(101).fill(1), min: 1, max: 1, mean: 1, standardDev: 0, coefficient: 0, Q1: 1 }
      ];
      const inputDataSet = Array(101)
        .fill(0)
        .map((_, i) => ({ 1: `A${i}`, 2: '1' }));
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      resultFns.forEach(fn => {
        const result = fn();
        expect(result.chartType).toBeDefined();
      });
    });
  });

  // 结构断言与快照
  describe('结构断言与快照', () => {
    it('COLUMN chartType result structure', () => {
      const dimList = [{ uniqueID: 1, data: ['A', 'B', 'C'], dataType: 'string' as const, cardinal: 3 }];
      const measureList = [
        { uniqueID: 2, data: [10, 20, 30], min: 10, max: 30, mean: 20, standardDev: 10, coefficient: 0.5, Q1: 10 }
      ];
      const inputDataSet = [
        { 1: 'A', 2: '10' },
        { 1: 'B', 2: '20' },
        { 1: 'C', 2: '30' }
      ];
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      const result = resultFns[0]();
      expect(result.cell).toBeDefined();
      expect(result.dataset).toBeDefined();
      expect(result.scoreDetails).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });

  // 参数化测试示例
  describe.each([
    ['COLUMN', 0, ChartType.COLUMN],
    ['COLUMN_PERCENT', 1, ChartType.COLUMN_PERCENT],
    ['COLUMN_PARALLEL', 2, ChartType.COLUMN_PARALLEL],
    ['SCATTER', 3, ChartType.SCATTER],
    ['LINE', 4, ChartType.LINE],
    ['PIE', 5, ChartType.PIE],
    ['RADAR', 6, ChartType.RADAR],
    ['WORD_CLOUD', 7, ChartType.WORD_CLOUD],
    ['FUNNEL', 8, ChartType.FUNNEL],
    ['DUAL_AXIS', 9, ChartType.DUAL_AXIS]
  ])('主流类型参数化断言: %s', (desc, idx, expectedType) => {
    it(`should return correct chartType for ${desc}`, () => {
      // 这里用最小 mock 数据，实际可根据 idx 定制
      // 以 COLUMN 为例
      let dimList, measureList, inputDataSet;
      if (expectedType === ChartType.COLUMN) {
        dimList = [{ uniqueID: 1, data: ['A', 'B', 'C'], dataType: 'string' as const, cardinal: 3 }];
        measureList = [
          { uniqueID: 2, data: [10, 20, 30], min: 10, max: 30, mean: 20, standardDev: 10, coefficient: 0.5, Q1: 10 }
        ];
        inputDataSet = [
          { 1: 'A', 2: '10' },
          { 1: 'B', 2: '20' },
          { 1: 'C', 2: '30' }
        ];
      } else {
        // 其它类型可用已有测试数据或简化 mock
        dimList = [];
        measureList = [
          { uniqueID: 2, data: [10, 20, 30], min: 10, max: 30, mean: 20, standardDev: 10, coefficient: 0.5, Q1: 10 }
        ];
        inputDataSet = [{ 2: '10' }, { 2: '20' }, { 2: '30' }];
      }
      const resultFns = scorer({ inputDataSet, dimList, measureList });
      const result = resultFns[idx]();
      expect(result.chartType).toBe(expectedType);
    });
  });
});
