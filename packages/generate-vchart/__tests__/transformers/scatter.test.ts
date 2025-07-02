import { generateChart } from '../../src';
import { scatterField, scatterAxis, animationScatter, pipelineScatterPlot } from '../../src/transformers/scatter';
import { GenerateChartInput } from '../../src/types/transform';
import { DataRole } from '../../src/utils/enum';
import { SCATTER_DATA_FOUR, SCATTER_DATA_TWO, SCATTER_FIELD_INFO, SCATTER_FIELD_INFO_FOUR } from '../common';

describe('Scatter Chart Transformers', () => {
  const baseContext: GenerateChartInput = {
    chartType: 'scatter',
    cell: { x: 'x_axis', y: 'y_axis' },
    dataTable: [
      { x_axis: 10, y_axis: 20 },
      { x_axis: 30, y_axis: 40 }
    ],
    spec: {
      data: {
        values: [
          { x_axis: 10, y_axis: 20 },
          { x_axis: 30, y_axis: 40 }
        ]
      }
    },
    fieldInfo: [
      { fieldName: 'x_axis', type: 'numerical', role: DataRole.MEASURE },
      { fieldName: 'y_axis', type: 'numerical', role: DataRole.MEASURE }
    ]
  };

  describe('scatterField', () => {
    it('should assign basic x and y fields correctly', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field' },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.xField).toBe('x_field');
      expect(result.spec.yField).toBe('y_field');
      expect(result.spec.seriesField).toBeUndefined();
      expect(result.spec.sizeField).toBeUndefined();
    });

    it('should set seriesField when color is provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field', color: 'category' },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.xField).toBe('x_field');
      expect(result.spec.yField).toBe('y_field');
      expect(result.spec.seriesField).toBe('category');
    });

    it('should set sizeField and size config when size is provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field', size: 'magnitude' },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.xField).toBe('x_field');
      expect(result.spec.yField).toBe('y_field');
      expect(result.spec.sizeField).toBe('magnitude');
      expect(result.spec.size).toEqual({ type: 'linear' });
    });

    it('should set both color and size fields when both are provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field', color: 'category', size: 'magnitude' },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.xField).toBe('x_field');
      expect(result.spec.yField).toBe('y_field');
      expect(result.spec.seriesField).toBe('category');
      expect(result.spec.sizeField).toBe('magnitude');
      expect(result.spec.size).toEqual({ type: 'linear' });
    });

    it('should not set seriesField when color is null', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field', color: null },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.seriesField).toBeUndefined();
    });

    it('should not set sizeField when size is null', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field', size: null },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.sizeField).toBeUndefined();
      expect(result.spec.size).toBeUndefined();
    });

    it('should not set seriesField when color is undefined', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'x_field', y: 'y_field', color: undefined },
        spec: { data: { values: [] } }
      };

      const result = scatterField(context);

      expect(result.spec.seriesField).toBeUndefined();
    });
  });

  describe('scatterAxis', () => {
    it('should create linear axes for numeric fields', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'x_numeric',
          yField: 'y_numeric',
          data: { values: [] }
        },
        fieldInfo: [
          { fieldName: 'x_numeric', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'y_numeric', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      const result = scatterAxis(context);

      expect(result.spec.axes).toHaveLength(2);
      expect(result.spec.axes[0]).toEqual({
        orient: 'bottom',
        type: 'linear',
        title: { visible: false },
        visible: true
      });
      expect(result.spec.axes[1]).toEqual({
        orient: 'left',
        type: 'linear',
        title: { visible: false },
        visible: true
      });
    });

    it('should create band axes for dimension fields', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'x_category',
          yField: 'y_category',
          data: { values: [] }
        },
        fieldInfo: [
          { fieldName: 'x_category', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'y_category', type: 'string', role: DataRole.DIMENSION }
        ]
      };

      const result = scatterAxis(context);

      expect(result.spec.axes).toHaveLength(2);
      expect(result.spec.axes[0]).toEqual({
        orient: 'bottom',
        type: 'band',
        title: { visible: false },
        visible: true
      });
      expect(result.spec.axes[1]).toEqual({
        orient: 'left',
        type: 'band',
        title: { visible: false },
        visible: true
      });
    });

    it('should create mixed axis types when fields have different roles', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'x_category',
          yField: 'y_numeric',
          data: { values: [] }
        },
        fieldInfo: [
          { fieldName: 'x_category', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'y_numeric', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      const result = scatterAxis(context);

      expect(result.spec.axes[0].type).toBe('band'); // x-axis for dimension
      expect(result.spec.axes[1].type).toBe('linear'); // y-axis for measure
    });

    it('should handle missing field info gracefully', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'nonexistent_x',
          yField: 'nonexistent_y',
          data: { values: [] }
        },
        fieldInfo: [{ fieldName: 'other_field', type: 'string', role: DataRole.DIMENSION }]
      };

      const result = scatterAxis(context);

      expect(result.spec.axes).toHaveLength(2);
      // Should default to linear when field info not found
      expect(result.spec.axes[0].type).toBe('linear');
      expect(result.spec.axes[1].type).toBe('linear');
    });

    it('should handle empty fieldInfo array', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'x_field',
          yField: 'y_field',
          data: { values: [] }
        },
        fieldInfo: []
      };

      const result = scatterAxis(context);

      expect(result.spec.axes).toHaveLength(2);
      expect(result.spec.axes[0].type).toBe('linear');
      expect(result.spec.axes[1].type).toBe('linear');
    });

    it('should handle undefined fieldInfo', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'x_field',
          yField: 'y_field',
          data: { values: [] }
        },
        fieldInfo: undefined as any
      };

      const result = scatterAxis(context);

      expect(result.spec.axes).toHaveLength(2);
      expect(result.spec.axes[0].type).toBe('linear');
      expect(result.spec.axes[1].type).toBe('linear');
    });

    it('should handle fields with mixed case dimensions', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          xField: 'X_Field',
          yField: 'Y_FIELD',
          data: { values: [] }
        },
        fieldInfo: [
          { fieldName: 'X_Field', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'Y_FIELD', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      const result = scatterAxis(context);

      expect(result.spec.axes[0].type).toBe('band'); // x-axis for dimension
      expect(result.spec.axes[1].type).toBe('linear'); // y-axis for measure
    });
  });

  describe('animationScatter', () => {
    it('should create animation with default total time', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: {
            values: [
              { x: 1, y: 2 },
              { x: 3, y: 4 },
              { x: 5, y: 6 }
            ]
          }
        }
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      expect(result.spec.animationAppear.duration).toBe(500); // DEFAULT_ANIMATION_DURATION
      expect(typeof result.spec.animationAppear.delay).toBe('function');
    });

    it('should create animation with custom total time', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: {
            values: [
              { x: 1, y: 2 },
              { x: 3, y: 4 }
            ]
          }
        },
        animationOptions: {
          totalTime: 5000
        }
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      expect(result.spec.animationAppear.duration).toBe(500);
      expect(typeof result.spec.animationAppear.delay).toBe('function');
    });

    it('should handle empty data gracefully', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: { values: [] }
        }
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      expect(result.spec.animationAppear.duration).toBe(500);
    });

    it('should calculate correct group number for large datasets', () => {
      // Create dataset larger than ONE_BY_ONE_GROUP_SIZE (50)
      const largeDataset = Array.from({ length: 150 }, (_, i) => ({ x: i, y: i * 2 }));

      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: { values: largeDataset }
        },
        animationOptions: {
          totalTime: 6000
        }
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      expect(result.spec.animationAppear.duration).toBe(500);
      expect(typeof result.spec.animationAppear.delay).toBe('function');
    });

    it('should handle single data point', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: {
            values: [{ x: 10, y: 20 }]
          }
        }
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      expect(result.spec.animationAppear.duration).toBe(500);
      expect(typeof result.spec.animationAppear.delay).toBe('function');
    });

    it('should test delay function with valid datum', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: {
            values: [
              { x: 1, y: 2 },
              { x: 3, y: 4 },
              { x: 5, y: 6 }
            ]
          }
        },
        animationOptions: {
          totalTime: 3000
        }
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      const delayFunc = result.spec.animationAppear.delay;

      // Test delay function with mock datum
      const mockDatum1 = { __CHARTSPACE_DEFAULT_DATA_INDEX: 0 };
      const mockDatum2 = { __CHARTSPACE_DEFAULT_DATA_INDEX: 50 };
      const mockDatum3 = { __CHARTSPACE_DEFAULT_DATA_INDEX: 100 };

      expect(delayFunc(mockDatum1)).toBe(0); // 0 % 50 * delay = 0
      expect(delayFunc(mockDatum2)).toBe(0); // 50 % 50 * delay = 0
      expect(typeof delayFunc(mockDatum3)).toBe('number'); // 100 % 50 * delay
    });

    it('should handle missing animationOptions gracefully', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        spec: {
          data: {
            values: [{ x: 1, y: 2 }]
          }
        },
        animationOptions: undefined
      };

      const result = animationScatter(context);

      expect(result.spec.animationAppear).toBeDefined();
      expect(result.spec.animationAppear.duration).toBe(500);
      expect(typeof result.spec.animationAppear.delay).toBe('function');
    });
  });

  describe('pipelineScatterPlot', () => {
    it('should have correct pipeline structure', () => {
      expect(pipelineScatterPlot).toHaveLength(7);
      expect(pipelineScatterPlot[0].name).toBe('formatXFields');
      expect(pipelineScatterPlot[1].name).toBe('data');
      expect(pipelineScatterPlot[2].name).toBe('color');
      expect(pipelineScatterPlot[3]).toBe(scatterField);
      expect(pipelineScatterPlot[4]).toBe(scatterAxis);
      expect(pipelineScatterPlot[5].name).toBe('discreteLegend');
    });

    it('should execute pipeline correctly for basic scatter chart', () => {
      let context: GenerateChartInput = {
        chartType: 'scatter',
        cell: { x: 'x_val', y: 'y_val' },
        dataTable: [
          { x_val: 10, y_val: 20 },
          { x_val: 30, y_val: 40 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'x_val', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'y_val', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      // Execute pipeline step by step
      for (const transformFn of pipelineScatterPlot) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify final result
      expect(context.spec.xField).toBe('x_val');
      expect(context.spec.yField).toBe('y_val');
      expect(context.spec.axes).toHaveLength(2);
      expect(context.spec.data).toBeDefined();
      expect(context.spec.color).toBeDefined();
    });

    it('should execute pipeline correctly for scatter chart with color and size', () => {
      let context: GenerateChartInput = {
        chartType: 'scatter',
        cell: { x: 'x_val', y: 'y_val', color: 'category', size: 'magnitude' },
        dataTable: [
          { x_val: 10, y_val: 20, category: 'A', magnitude: 5 },
          { x_val: 30, y_val: 40, category: 'B', magnitude: 8 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'x_val', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'y_val', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'category', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'magnitude', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      // Execute pipeline
      for (const transformFn of pipelineScatterPlot) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify field mappings
      expect(context.spec.xField).toBe('x_val');
      expect(context.spec.yField).toBe('y_val');
      expect(context.spec.seriesField).toBe('category');
      expect(context.spec.sizeField).toBe('magnitude');
      expect(context.spec.size).toEqual({ type: 'linear' });
      expect(context.spec.legends).toBeDefined();
    });

    it('should handle mixed axis types through pipeline', () => {
      let context: GenerateChartInput = {
        chartType: 'scatter',
        cell: { x: 'category', y: 'value' },
        dataTable: [
          { category: 'A', value: 10 },
          { category: 'B', value: 20 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'category', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'value', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      // Execute pipeline
      for (const transformFn of pipelineScatterPlot) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify axis types
      expect(context.spec.axes[0].type).toBe('band'); // x-axis for dimension
      expect(context.spec.axes[1].type).toBe('linear'); // y-axis for measure
    });

    it('should handle complex field mapping through pipeline', () => {
      let context: GenerateChartInput = {
        chartType: 'scatter',
        cell: { x: 'x_auto', y: 'y_auto', color: 'department', size: 'experience' },
        dataTable: [
          { department: 'Engineering', experience: 5, x_auto: 10, y_auto: 20 },
          { department: 'Marketing', experience: 3, x_auto: 15, y_auto: 25 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'department', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'experience', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'x_auto', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'y_auto', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      // Execute pipeline
      for (const transformFn of pipelineScatterPlot) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify field mappings
      expect(context.spec.xField).toBe('x_auto');
      expect(context.spec.yField).toBe('y_auto');
      expect(context.spec.seriesField).toBe('department');
      expect(context.spec.sizeField).toBe('experience');
      expect(context.spec.size).toEqual({ type: 'linear' });
    });

    it('should execute pipeline with missing fieldInfo gracefully', () => {
      let context: GenerateChartInput = {
        chartType: 'scatter',
        cell: { x: 'x_val', y: 'y_val' },
        dataTable: [
          { x_val: 10, y_val: 20 },
          { x_val: 30, y_val: 40 }
        ],
        spec: {},
        fieldInfo: []
      };

      // Execute pipeline step by step
      for (const transformFn of pipelineScatterPlot) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Should still work with defaults
      expect(context.spec.xField).toBe('x_val');
      expect(context.spec.yField).toBe('y_val');
      expect(context.spec.axes).toHaveLength(2);
      expect(context.spec.axes[0].type).toBe('linear'); // Default when field info missing
      expect(context.spec.axes[1].type).toBe('linear'); // Default when field info missing
    });

    it('should execute pipeline with null cell values gracefully', () => {
      let context: GenerateChartInput = {
        chartType: 'scatter',
        cell: { x: 'x_val', y: 'y_val', color: null, size: null },
        dataTable: [
          { x_val: 10, y_val: 20 },
          { x_val: 30, y_val: 40 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'x_val', type: 'numerical', role: DataRole.MEASURE },
          { fieldName: 'y_val', type: 'numerical', role: DataRole.MEASURE }
        ]
      };

      // Execute pipeline
      for (const transformFn of pipelineScatterPlot) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify null values are handled correctly
      expect(context.spec.xField).toBe('x_val');
      expect(context.spec.yField).toBe('y_val');
      expect(context.spec.seriesField).toBeUndefined();
      expect(context.spec.sizeField).toBeUndefined();
      expect(context.spec.size).toBeUndefined();
    });
  });

  describe('generate scatter chart', () => {
    it('should generate scatter chart', () => {
      const chart = generateChart('scatter', {
        dataTable: SCATTER_DATA_TWO,
        cell: {
          x: 'x',
          y: 'y'
        },
        spec: {}
      });

      expect(chart.spec).toEqual({
        type: 'scatter',
        color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
        axes: [
          { orient: 'bottom', title: { visible: false }, type: 'linear', visible: true },
          {
            orient: 'left',
            title: { visible: false },
            type: 'linear',
            visible: true
          }
        ],
        data: { id: 'data', values: SCATTER_DATA_TWO },
        xField: 'x',
        yField: 'y'
      });
    });

    it('should generate scatter chart when has color and size field', () => {
      const chart = generateChart('scatter', {
        dataTable: SCATTER_DATA_FOUR,
        cell: {
          x: 'x',
          y: 'y',
          color: 'group',
          size: 'size'
        },
        spec: {}
      });

      expect(chart.spec).toEqual({
        type: 'scatter',
        color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
        axes: [
          { orient: 'bottom', title: { visible: false }, type: 'linear', visible: true },
          {
            orient: 'left',
            title: { visible: false },
            type: 'linear',
            visible: true
          }
        ],
        data: { id: 'data', values: SCATTER_DATA_FOUR },
        xField: 'x',
        yField: 'y',
        seriesField: 'group',
        sizeField: 'size',
        size: {
          type: 'linear'
        },
        legends: [
          {
            item: { visible: true },
            orient: 'right',
            type: 'discrete'
          }
        ]
      });
    });

    it('should generate scatter chart with dimension x-axis', () => {
      const chart = generateChart('scatter', {
        dataTable: [
          { category: 'A', value: 10 },
          { category: 'B', value: 20 },
          { category: 'C', value: 15 }
        ],
        cell: {
          x: 'category',
          y: 'value'
        },
        spec: {},
        fieldInfo: [
          { fieldName: 'category', type: 'string', role: DataRole.DIMENSION },
          { fieldName: 'value', type: 'numerical', role: DataRole.MEASURE }
        ]
      });

      expect(chart.spec.axes[0].type).toBe('band');
      expect(chart.spec.axes[1].type).toBe('linear');
    });

    it('should generate scatter chart with only size field', () => {
      const chart = generateChart('scatter', {
        dataTable: SCATTER_DATA_FOUR.map(({ group, ...rest }) => rest),
        cell: {
          x: 'x',
          y: 'y',
          size: 'size'
        },
        spec: {}
      });

      expect(chart.spec.seriesField).toBeUndefined();
      expect(chart.spec.sizeField).toBe('size');
      expect(chart.spec.size).toEqual({ type: 'linear' });
      expect(chart.spec.legends).toBeUndefined();
    });

    it('should generate scatter chart with only color field', () => {
      const chart = generateChart('scatter', {
        dataTable: SCATTER_DATA_FOUR.map(({ size, ...rest }) => rest),
        cell: {
          x: 'x',
          y: 'y',
          color: 'group'
        },
        spec: {}
      });

      expect(chart.spec.seriesField).toBe('group');
      expect(chart.spec.sizeField).toBeUndefined();
      expect(chart.spec.size).toBeUndefined();
      expect(chart.spec.legends).toEqual([
        {
          item: { visible: true },
          orient: 'right',
          type: 'discrete'
        }
      ]);
    });
  });
});
