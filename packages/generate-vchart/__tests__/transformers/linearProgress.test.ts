import { generateChart } from '../../src';
import {
  formatFieldsOfLinearProgressChart,
  linearProgressField,
  linearProgressAxes,
  pipelineLinearProgress
} from '../../src/transformers/linearProgress';
import { GenerateChartInput } from '../../src/types/transform';
import { DataRole } from '../../src/utils/enum';

describe('Linear Progress Chart Transformers', () => {
  const baseContext: GenerateChartInput = {
    chartType: 'linearProgress',
    cell: { x: 'category', y: 'value' },
    dataTable: [
      { category: 'Task A', value: 0.8 },
      { category: 'Task B', value: 0.6 }
    ],
    spec: {
      data: {
        values: [
          { category: 'Task A', value: 0.8 },
          { category: 'Task B', value: 0.6 }
        ]
      }
    },
    fieldInfo: [
      { fieldName: 'category', role: DataRole.DIMENSION, type: 'string' },
      { fieldName: 'value', role: DataRole.MEASURE, type: 'number' }
    ]
  };

  describe('formatFieldsOfLinearProgressChart', () => {
    it('should use existing x and y fields when provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', y: 'value' }
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.x).toBe('category');
      expect(result.cell.y).toBe('value');
    });

    it('should prioritize x field from x or color fields', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'name', color: 'type', y: 'score' }
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.x).toBe('name'); // Should take first available field
    });

    it('should use color field for x when x is not provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { color: 'type', y: 'score' }
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.x).toBe('type');
    });

    it('should fallback to dimension field when no x or color provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { y: 'value' },
        fieldInfo: [
          { fieldName: 'category', role: DataRole.DIMENSION, type: 'string' },
          { fieldName: 'value', role: DataRole.MEASURE, type: 'number' }
        ]
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.x).toBe('category');
    });

    it('should use first remaining field when no dimension field available', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { y: 'value' },
        fieldInfo: [
          { fieldName: 'other', role: DataRole.MEASURE, type: 'number' },
          { fieldName: 'value', role: DataRole.MEASURE, type: 'number' }
        ]
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.x).toBe('other'); // Should use first remaining field
    });

    it('should prioritize y field from multiple value field options', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: {
          x: 'category',
          y: 'primary',
          size: 'secondary',
          value: 'tertiary',
          radius: 'fourth',
          angle: 'fifth'
        }
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.y).toBe('primary');
    });

    it('should use size field when y is not provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', size: 'amount' }
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.y).toBe('amount');
    });

    it('should fallback to measure field when no y field options provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category' },
        fieldInfo: [
          { fieldName: 'category', role: DataRole.DIMENSION, type: 'string' },
          { fieldName: 'score', role: DataRole.MEASURE, type: 'number' }
        ]
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.y).toBe('score');
    });

    it('should handle array fields correctly', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: ['cat1', 'cat2'], y: ['val1', 'val2'] }
      };

      const result = formatFieldsOfLinearProgressChart(context);

      expect(result.cell.x).toBe('cat1');
      expect(result.cell.y).toBe('val1');
    });
  });

  describe('linearProgressField', () => {
    it('should assign fields correctly and set corner radius', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', y: 'value' },
        spec: { data: { values: [] } }
      };

      const result = linearProgressField(context);

      expect(result.spec.xField).toBe('value'); // y becomes xField
      expect(result.spec.yField).toBe('category'); // x becomes yField
      expect(result.spec.cornerRadius).toBe(20);
    });

    it('should set seriesField when color is provided', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', y: 'value', color: 'type' },
        spec: { data: { values: [] } }
      };

      const result = linearProgressField(context);

      expect(result.spec.seriesField).toBe('type');
    });

    it('should set seriesField when valid color is provided after formatColorFields', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', y: 'value', color: null },
        spec: { data: { values: [] } }
      };

      const result = linearProgressField(context);

      // formatColorFields will likely find a color field, so seriesField will be set
      expect(result.spec.seriesField).toBeDefined();
    });
  });

  describe('linearProgressAxes', () => {
    it('should create axes with correct configuration for multiple data', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', y: 'value' },
        spec: {
          data: {
            values: [
              { category: 'Task A', value: 0.8 },
              { category: 'Task B', value: 0.6 }
            ]
          }
        }
      };

      const result = linearProgressAxes(context);

      expect(result.spec.axes).toHaveLength(2);

      // Left axis (band)
      expect(result.spec.axes[0]).toEqual({
        orient: 'left',
        type: 'band',
        domainLine: { visible: false },
        tick: { visible: false },
        label: { formatMethod: null }
      });

      // Bottom axis (linear)
      expect(result.spec.axes[1].orient).toBe('bottom');
      expect(result.spec.axes[1].type).toBe('linear');
      expect(result.spec.axes[1].visible).toBe(true);
      expect(result.spec.axes[1].grid.visible).toBe(false);
      expect(result.spec.axes[1].label.flush).toBe(true);
    });

    it('should create special label format for single data', () => {
      const context: GenerateChartInput = {
        ...baseContext,
        cell: { x: 'category', y: 'value' },
        spec: {
          data: {
            values: [{ category: 'Task A', value: 0.8 }]
          }
        }
      };

      const result = linearProgressAxes(context);

      // Should have formatMethod for single data
      expect(typeof result.spec.axes[0].label.formatMethod).toBe('function');

      // Test the format function
      const formatMethod = result.spec.axes[0].label.formatMethod;
      expect(formatMethod('Task A')).toBe('category: Task A');
    });

    it('should format percentage values correctly in bottom axis', () => {
      const context: GenerateChartInput = {
        ...baseContext
      };

      const result = linearProgressAxes(context);

      const formatMethod = result.spec.axes[1].label.formatMethod;

      // Test percentage formatting
      expect(formatMethod(0.5)).toBe('50%');
      expect(formatMethod(0.8)).toBe('80%');
      expect(formatMethod(1)).toBe('100%');
      expect(formatMethod(0)).toBe('0%');

      // Test non-percentage values
      expect(formatMethod(1.5)).toBe(1.5);
      expect(formatMethod(-0.5)).toBe(-0.5);
      expect(formatMethod(100)).toBe(100);
    });

    it('should handle edge cases for percentage formatting', () => {
      const context: GenerateChartInput = {
        ...baseContext
      };

      const result = linearProgressAxes(context);
      const formatMethod = result.spec.axes[1].label.formatMethod;

      // Test edge cases
      expect(formatMethod(0.999)).toBe('99.9%');
      expect(formatMethod(0.001)).toBe('0.1%');
    });
  });

  describe('pipelineLinearProgress', () => {
    it('should have correct pipeline order and functions', () => {
      expect(pipelineLinearProgress).toHaveLength(5);
      expect(pipelineLinearProgress[0]).toBe(formatFieldsOfLinearProgressChart);
      // Note: data, color functions are imported from common, so we test by name
      expect(pipelineLinearProgress[1].name).toBe('data');
      expect(pipelineLinearProgress[2].name).toBe('color');
      expect(pipelineLinearProgress[3]).toBe(linearProgressField);
      expect(pipelineLinearProgress[4]).toBe(linearProgressAxes);
    });

    it('should execute pipeline correctly end-to-end', () => {
      let context: GenerateChartInput = {
        chartType: 'linearProgress',
        cell: { x: 'name', y: 'progress' },
        dataTable: [
          { name: 'Project A', progress: 0.75 },
          { name: 'Project B', progress: 0.6 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'name', role: DataRole.DIMENSION, type: 'string' },
          { fieldName: 'progress', role: DataRole.MEASURE, type: 'number' }
        ]
      };

      // Execute pipeline step by step
      for (const transformFn of pipelineLinearProgress) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify final result
      expect(context.spec.xField).toBe('progress');
      expect(context.spec.yField).toBe('name');
      expect(context.spec.cornerRadius).toBe(20);
      expect(context.spec.axes).toHaveLength(2);
      expect(context.spec.data).toBeDefined();
      expect(context.spec.color).toBeDefined();
    });

    it('should handle complex field mapping through pipeline', () => {
      let context: GenerateChartInput = {
        chartType: 'linearProgress',
        cell: { color: 'department', size: 'completion' },
        dataTable: [
          { department: 'Engineering', completion: 0.85 },
          { department: 'Marketing', completion: 0.7 }
        ],
        spec: {},
        fieldInfo: [
          { fieldName: 'department', role: DataRole.DIMENSION, type: 'string' },
          { fieldName: 'completion', role: DataRole.MEASURE, type: 'number' }
        ]
      };

      // Execute pipeline
      for (const transformFn of pipelineLinearProgress) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify field mapping
      expect(context.cell.x).toBe('department'); // from color
      expect(context.cell.y).toBe('completion'); // from size
      expect(context.spec.xField).toBe('completion');
      expect(context.spec.yField).toBe('department');
      expect(context.spec.seriesField).toBe('department');
    });

    it('should handle single data point through pipeline', () => {
      let context: GenerateChartInput = {
        chartType: 'linearProgress',
        cell: { x: 'task', y: 'done' },
        dataTable: [{ task: 'Single Task', done: 0.9 }],
        spec: {},
        fieldInfo: [
          { fieldName: 'task', role: DataRole.DIMENSION, type: 'string' },
          { fieldName: 'done', role: DataRole.MEASURE, type: 'number' }
        ]
      };

      // Execute pipeline
      for (const transformFn of pipelineLinearProgress) {
        const result = transformFn(context);
        context = { ...context, ...result };
      }

      // Verify single data handling
      expect(context.spec.data.values).toHaveLength(1);
      expect(typeof context.spec.axes[0].label.formatMethod).toBe('function');

      // Test the format function for single data
      const formatMethod = context.spec.axes[0].label.formatMethod;
      expect(formatMethod('Single Task')).toBe('task: Single Task');
    });
  });

  describe('genetateChart of linear progress', () => {
    it('should generate linear progress chart', () => {
      const { spec, cell } = generateChart('linear_progress', {
        dataTable: [
          {
            name: 'x',
            value: 0.68
          }
        ],
        cell: {
          x: 'name',
          y: 'value'
        },
        spec: {}
      });

      expect(JSON.parse(JSON.stringify(spec))).toEqual({
        type: 'linearProgress',
        data: {
          id: 'data',
          values: [
            {
              name: 'x',
              value: 0.68
            }
          ]
        },
        color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
        xField: 'value',
        yField: 'name',
        seriesField: 'name',
        cornerRadius: 20,
        axes: [
          {
            orient: 'left',
            type: 'band',
            domainLine: {
              visible: false
            },
            label: {},
            tick: {
              visible: false
            }
          },
          {
            orient: 'bottom',
            type: 'linear',
            visible: true,
            grid: {
              visible: false
            },
            label: {
              flush: true
            }
          }
        ]
      });
    });

    it('should generate linear progress chart with multiple data points', () => {
      const { spec } = generateChart('linear_progress', {
        dataTable: [
          { task: 'Task A', progress: 0.8 },
          { task: 'Task B', progress: 0.6 },
          { task: 'Task C', progress: 0.9 }
        ],
        cell: {
          x: 'task',
          y: 'progress'
        },
        spec: {}
      });

      expect(spec.data.values).toHaveLength(3);
      expect(spec.xField).toBe('progress');
      expect(spec.yField).toBe('task');
      expect(spec.axes[0].label.formatMethod).toBe(null); // Multiple data, no special formatting
    });

    it('should generate linear progress chart with color field', () => {
      const { spec } = generateChart('linear_progress', {
        dataTable: [
          { project: 'A', completion: 0.7, department: 'Engineering' },
          { project: 'B', completion: 0.5, department: 'Marketing' }
        ],
        cell: {
          x: 'project',
          y: 'completion',
          color: 'department'
        },
        spec: {}
      });

      expect(spec.seriesField).toBe('department');
      expect(spec.xField).toBe('completion');
      expect(spec.yField).toBe('project');
    });
  });
});
