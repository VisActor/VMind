import { generateChart } from '../../src/index';
import { formatFieldsOfBoxPlot, boxPlotField } from '../../src/transformers/boxplot';
import { GenerateChartInput } from '../../src/types/transform';

describe('BoxPlot Chart Generator', () => {
  describe('formatFieldsOfBoxPlot', () => {
    it('should split comma-separated y string into array', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: 'min, q1, median, q3, max' },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual(['min', 'q1', 'median', 'q3', 'max']);
    });

    it('should handle comma-separated string with extra spaces', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: '  min,  q1  , median,q3   ,max  ' },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual(['min', 'q1', 'median', 'q3', 'max']);
    });

    it('should keep array y field unchanged', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1', 'y2', 'y3', 'y4', 'y5'] },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual(['y1', 'y2', 'y3', 'y4', 'y5']);
    });

    it('should keep single string y field unchanged when no comma', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: 'value' },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toBe('value');
    });

    it('should extract fields from cell when y is null', () => {
      const context: GenerateChartInput = {
        cell: {
          x: 'category',
          y: null,
          min: 'minField',
          q1: 'q1Field',
          median: 'medianField',
          q3: 'q3Field',
          max: 'maxField'
        } as any,
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual(['minField', 'q1Field', 'medianField', 'q3Field', 'maxField']);
    });

    it('should extract fields from cell when y is undefined', () => {
      const context: GenerateChartInput = {
        cell: {
          x: 'category',
          lower_whisker: 'lowerWhiskerField',
          lowerWhisker: 'lowerWhiskerField2',
          min: 'minField',
          lower_quartile: 'lowerQuartileField',
          midline: 'midlineField',
          upper_quartile: 'upperQuartileField',
          upper_whisker: 'upperWhiskerField',
          max: 'maxField'
        } as any,
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual([
        'lowerWhiskerField',
        'lowerWhiskerField2',
        'minField',
        'lowerQuartileField',
        'midlineField',
        'upperQuartileField',
        'upperWhiskerField',
        'maxField'
      ]);
    });

    it('should extract fields from cell when y is empty array', () => {
      const context: GenerateChartInput = {
        cell: {
          x: 'category',
          y: [],
          lowerBox: 'lowerBoxField',
          lower_box: 'lowerBoxField2',
          upperBox: 'upperBoxField',
          upper_box: 'upperBoxField2',
          lowerQuartile: 'lowerQuartileField',
          upperQuartile: 'upperQuartileField',
          upperWhisker: 'upperWhiskerField',
          upper: 'upperField'
        } as any,
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual([
        'lowerBoxField',
        'lowerBoxField2',
        'lowerQuartileField',
        'upperBoxField',
        'upperBoxField2',
        'upperQuartileField',
        'upperWhiskerField',
        'upperField'
      ]);
    });

    it('should filter out falsy values when extracting fields', () => {
      const context: GenerateChartInput = {
        cell: {
          x: 'category',
          y: null,
          min: 'minField',
          q1: null,
          median: 'medianField',
          q3: undefined,
          max: 'maxField',
          empty: '',
          zero: 0,
          false: false
        } as any,
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);

      expect(result.cell.y).toEqual(['minField', 'medianField', 'maxField']);
    });
  });

  describe('boxPlotField', () => {
    const sampleData = [
      { category: 'A', y1: 10, y2: 20, y3: 30, y4: 40, y5: 50 },
      { category: 'B', y1: 15, y2: 25, y3: 35, y4: 45, y5: 55 }
    ];

    it('should assign xField correctly', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y3', 'y1', 'y5', 'y2', 'y4'] },
        dataTable: sampleData,
        spec: {}
      };

      const result = boxPlotField(context);

      expect(result.spec.xField).toBe('category');
    });

    it('should sort y fields by their values and assign boxplot fields correctly', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y3', 'y1', 'y5', 'y2', 'y4'] }, // unsorted
        dataTable: sampleData, // y1=10, y2=20, y3=30, y4=40, y5=50
        spec: {}
      };

      const result = boxPlotField(context);

      // Should be sorted as: y1(10), y2(20), y3(30), y4(40), y5(50)
      expect(result.spec.minField).toBe('y1'); // minimum
      expect(result.spec.q1Field).toBe('y2'); // lower quartile
      expect(result.spec.medianField).toBe('y3'); // median
      expect(result.spec.q3Field).toBe('y4'); // upper quartile
      expect(result.spec.maxField).toBe('y5'); // maximum
    });

    it('should handle single y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1'] },
        dataTable: sampleData,
        spec: {}
      };

      const result = boxPlotField(context);

      expect(result.spec.minField).toBe('y1');
      expect(result.spec.q1Field).toBe('y1');
      expect(result.spec.medianField).toBe('y1');
      expect(result.spec.q3Field).toBe('y1');
      expect(result.spec.maxField).toBe('y1');
    });

    it('should handle two y fields', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y2', 'y1'] },
        dataTable: sampleData, // y1=10, y2=20
        spec: {}
      };

      const result = boxPlotField(context);

      // Sorted: y1(10), y2(20)
      expect(result.spec.minField).toBe('y1');
      expect(result.spec.q1Field).toBe('y2'); // Math.min(1, 2-1) = 1
      expect(result.spec.medianField).toBe('y1'); // Math.floor((2-1)/2) = 0
      expect(result.spec.q3Field).toBe('y1'); // Math.max(0, 2-2) = 0
      expect(result.spec.maxField).toBe('y2');
    });

    it('should handle three y fields', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y3', 'y1', 'y2'] },
        dataTable: sampleData, // y1=10, y2=20, y3=30
        spec: {}
      };

      const result = boxPlotField(context);

      // Sorted: y1(10), y2(20), y3(30)
      expect(result.spec.minField).toBe('y1');
      expect(result.spec.q1Field).toBe('y2'); // Math.min(1, 3-1) = 1
      expect(result.spec.medianField).toBe('y2'); // Math.floor((3-1)/2) = 1
      expect(result.spec.q3Field).toBe('y2'); // Math.max(0, 3-2) = 1
      expect(result.spec.maxField).toBe('y3');
    });

    it('should handle empty dataTable gracefully', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1', 'y2', 'y3'] },
        dataTable: [],
        spec: {}
      };

      const result = boxPlotField(context);

      expect(result.spec.xField).toBe('category');
      expect(result.spec.minField).toBeDefined();
      expect(result.spec.maxField).toBeDefined();
    });

    it('should handle invalid dataTable gracefully', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1', 'y2', 'y3'] },
        dataTable: 'invalid' as any,
        spec: {}
      };

      const result = boxPlotField(context);

      expect(result.spec.xField).toBe('category');
      expect(result.spec.minField).toBeDefined();
      expect(result.spec.maxField).toBeDefined();
    });

    it('should handle missing values in data gracefully', () => {
      const dataWithMissingValues = [
        { category: 'A' }, // missing y fields
        { category: 'B', y1: 15, y2: 25 }
      ];

      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y2', 'y1', 'y3'] },
        dataTable: dataWithMissingValues,
        spec: {}
      };

      const result = boxPlotField(context);

      expect(result.spec.xField).toBe('category');
      expect(result.spec.minField).toBeDefined();
      expect(result.spec.maxField).toBeDefined();
    });

    it('should handle single string y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['value'] },
        dataTable: [{ category: 'A', value: 100 }],
        spec: {}
      };

      const result = boxPlotField(context);

      expect(result.spec.xField).toBe('category');
      expect(result.spec.minField).toBe('value');
      expect(result.spec.maxField).toBe('value');
    });
  });

  describe('Integration Tests', () => {
    it('should work with comma-separated y field string in full pipeline', () => {
      const data = [
        { region: 'North', min: 10, q1: 20, median: 30, q3: 40, max: 50 },
        { region: 'South', min: 15, q1: 25, median: 35, q3: 45, max: 55 }
      ];

      const { spec } = generateChart('boxplot', {
        dataTable: data,
        cell: { x: 'region', y: 'min, q1, median, q3, max' },
        spec: {}
      });

      expect(spec.xField).toBe('region');
      expect(spec.minField).toBe('min');
      expect(spec.q1Field).toBe('q1');
      expect(spec.medianField).toBe('median');
      expect(spec.q3Field).toBe('q3');
      expect(spec.maxField).toBe('max');
    });

    it('should work with predefined field names in cell', () => {
      const data = [{ category: 'A', lower: 5, middle: 15, upper: 25 }];

      const { spec } = generateChart('boxplot', {
        dataTable: data,
        cell: {
          x: 'category',
          y: null,
          min: 'lower',
          median: 'middle',
          max: 'upper'
        } as any,
        spec: {}
      });

      expect(spec.xField).toBe('category');
      expect(spec.minField).toBe('lower');
      expect(spec.medianField).toBe('middle');
      expect(spec.maxField).toBe('upper');
    });
  });
});

describe('generateChart of boxplot', () => {
  it('should generate boxplot chart', () => {
    const data = [
      {
        x: 'Sub-Saharan Africa',
        y1: 8.72,
        y2: 9.73,
        y3: 10.17,
        y4: 10.51,
        y5: 11.64
      },
      {
        x: 'South Asia',
        y1: 9.4,
        y2: 10.06,
        y3: 10.75,
        y4: 11.56,
        y5: 12.5
      },
      {
        x: 'Middle East & North Africa',
        y1: 9.54,
        y2: 10.6,
        y3: 11.05,
        y4: 11.5,
        y5: 11.92
      },
      {
        x: 'Latin America & Caribbean',
        y1: 8.74,
        y2: 9.46,
        y3: 10.35,
        y4: 10.94,
        y5: 12.21
      },
      {
        x: 'East Asia & Pacific',
        y1: 7.8,
        y2: 8.95,
        y3: 10.18,
        y4: 11.57,
        y5: 13.25
      },
      {
        x: 'Europe & Central Asia',
        y1: 9.52,
        y2: 10.39,
        y3: 10.93,
        y4: 11.69,
        y5: 12.63
      }
    ];

    const { spec } = generateChart('boxplot', {
      dataTable: data,
      cell: { x: 'x', y: ['y1', 'y2', 'y3', 'y4', 'y5'] },
      spec: {
        type: 'boxplot'
      }
    });

    expect(spec).toEqual({
      type: 'boxPlot',
      data: {
        id: 'data',
        values: [
          {
            x: 'Sub-Saharan Africa',
            y1: 8.72,
            y2: 9.73,
            y3: 10.17,
            y4: 10.51,
            y5: 11.64
          },
          {
            x: 'South Asia',
            y1: 9.4,
            y2: 10.06,
            y3: 10.75,
            y4: 11.56,
            y5: 12.5
          },
          {
            x: 'Middle East & North Africa',
            y1: 9.54,
            y2: 10.6,
            y3: 11.05,
            y4: 11.5,
            y5: 11.92
          },
          {
            x: 'Latin America & Caribbean',
            y1: 8.74,
            y2: 9.46,
            y3: 10.35,
            y4: 10.94,
            y5: 12.21
          },
          {
            x: 'East Asia & Pacific',
            y1: 7.8,
            y2: 8.95,
            y3: 10.18,
            y4: 11.57,
            y5: 13.25
          },
          {
            x: 'Europe & Central Asia',
            y1: 9.52,
            y2: 10.39,
            y3: 10.93,
            y4: 11.69,
            y5: 12.63
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      xField: 'x',
      minField: 'y1',
      q1Field: 'y2',
      medianField: 'y3',
      q3Field: 'y4',
      maxField: 'y5'
    });
  });
});

describe('BoxPlot Edge Cases and Error Handling', () => {
  describe('formatFieldsOfBoxPlot edge cases', () => {
    it('should handle null y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: null as any },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      expect(Array.isArray(result.cell.y)).toBe(true);
      // When no boxplot fields are available, result will be an empty array
      expect(result.cell.y).toEqual([]);
    });

    it('should handle undefined y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: undefined as any },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      expect(Array.isArray(result.cell.y)).toBe(true);
      // When no boxplot fields are available, result will be an empty array
      expect(result.cell.y).toEqual([]);
    });

    it('should handle empty array y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: [] as any },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      expect(Array.isArray(result.cell.y)).toBe(true);
      // When no boxplot fields are available, result will be an empty array
      expect(result.cell.y).toEqual([]);
    });

    it('should handle empty string y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: '' },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      // Empty string has length 0, so it triggers the special handling
      expect(Array.isArray(result.cell.y)).toBe(true);
      expect(result.cell.y).toEqual([]);
    });

    it('should handle string with only commas', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ',,,' },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      expect(result.cell.y).toEqual(['', '', '', '']);
    });

    it('should handle single comma', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: 'field1,field2' },
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      expect(result.cell.y).toEqual(['field1', 'field2']);
    });

    it('should extract from boxplot specific fields when available', () => {
      const context: GenerateChartInput = {
        cell: {
          x: 'category',
          y: null as any,
          min: 'min_field',
          q1: 'q1_field',
          median: 'median_field',
          q3: 'q3_field',
          max: 'max_field',
          lowerWhisker: 'lower_whisker_field',
          upperWhisker: 'upper_whisker_field'
        } as any,
        dataTable: [],
        spec: {}
      };

      const result = formatFieldsOfBoxPlot(context);
      expect(result.cell.y).toContain('min_field');
      expect(result.cell.y).toContain('q1_field');
      expect(result.cell.y).toContain('median_field');
      expect(result.cell.y).toContain('q3_field');
      expect(result.cell.y).toContain('max_field');
      expect(result.cell.y).toContain('lower_whisker_field');
      expect(result.cell.y).toContain('upper_whisker_field');
    });
  });

  describe('boxPlotField edge cases', () => {
    it('should handle empty dataTable', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1', 'y2', 'y3', 'y4', 'y5'] },
        dataTable: [],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.xField).toBe('category');
      expect(result.spec.minField).toBe('y1');
      expect(result.spec.maxField).toBe('y5');
    });

    it('should handle invalid dataTable', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1', 'y2', 'y3', 'y4', 'y5'] },
        dataTable: null as any,
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.xField).toBe('category');
      expect(result.spec.minField).toBe('y1');
      expect(result.spec.maxField).toBe('y5');
    });

    it('should handle single y field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['single_field'] },
        dataTable: [{ category: 'A', single_field: 10 }],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.minField).toBe('single_field');
      expect(result.spec.q1Field).toBe('single_field');
      expect(result.spec.medianField).toBe('single_field');
      expect(result.spec.q3Field).toBe('single_field');
      expect(result.spec.maxField).toBe('single_field');
    });

    it('should handle two y fields', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['field1', 'field2'] },
        dataTable: [{ category: 'A', field1: 5, field2: 15 }],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.minField).toBe('field1');
      expect(result.spec.q1Field).toBe('field2');
      expect(result.spec.medianField).toBe('field1');
      expect(result.spec.q3Field).toBe('field1');
      expect(result.spec.maxField).toBe('field2');
    });

    it('should sort y fields by their values in dataTable', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['high', 'low', 'medium'] },
        dataTable: [{ category: 'A', high: 100, low: 10, medium: 50 }],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.minField).toBe('low'); // Smallest value (10)
      expect(result.spec.maxField).toBe('high'); // Largest value (100)
      expect(result.spec.medianField).toBe('medium'); // Middle value (50)
    });

    it('should handle missing values in dataTable', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['field1', 'field2', 'field3'] },
        dataTable: [{ category: 'A', field1: 10 }], // field2 and field3 missing
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.minField).toBeDefined();
      expect(result.spec.maxField).toBeDefined();
      expect(result.spec.medianField).toBeDefined();
    });

    it('should handle equal values in all fields', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['field1', 'field2', 'field3', 'field4', 'field5'] },
        dataTable: [
          {
            category: 'A',
            field1: 10,
            field2: 10,
            field3: 10,
            field4: 10,
            field5: 10
          }
        ],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.minField).toBe('field1');
      expect(result.spec.q1Field).toBe('field2');
      expect(result.spec.medianField).toBe('field3');
      expect(result.spec.q3Field).toBe('field4');
      expect(result.spec.maxField).toBe('field5');
    });

    it('should handle string x field', () => {
      const context: GenerateChartInput = {
        cell: { x: 'category', y: ['y1', 'y2'] },
        dataTable: [{ category: 'A', y1: 5, y2: 15 }],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.xField).toBe('category');
    });

    it('should handle array x field', () => {
      const context: GenerateChartInput = {
        cell: { x: ['cat1', 'cat2'], y: ['y1', 'y2'] },
        dataTable: [{ cat1: 'A', cat2: 'B', y1: 5, y2: 15 }],
        spec: {}
      };

      const result = boxPlotField(context);
      expect(result.spec.xField).toEqual(['cat1', 'cat2']);
    });
  });
});
