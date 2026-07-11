import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { ChartType } from '../../src/types';

const dataTable = [
  { name: 'Task A', value: 0.8 },
  { name: 'Task B', value: 0.6 }
];

describe('getChartSpecWithContext - Linear Progress Chart', () => {
  it('should generate correct linear progress spec', () => {
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable,
      cell: {
        x: 'name',
        y: 'value'
      },
      chartType: ChartType.LinearProgress.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.LinearProgress);
    expect(spec.type).toBe('linearProgress');
    expect(spec.xField).toBe('value');
    expect(spec.yField).toBe('name');
    expect(spec.seriesField).toBe('name');
    expect(spec.cornerRadius).toBe(20);
    expect(spec.data.values).toEqual(dataTable);
    expect(spec.axes).toHaveLength(2);
    expect(spec.axes[0]).toMatchObject({
      orient: 'left',
      type: 'band',
      domainLine: { visible: false },
      tick: { visible: false },
      label: { formatMethod: null }
    });
    expect(spec.axes[1]).toMatchObject({
      orient: 'bottom',
      type: 'linear',
      grid: { visible: false },
      label: { flush: true }
    });
    expect(typeof spec.axes[1].label.formatMethod).toBe('function');
    expect(spec.axes[1].label.formatMethod(0.8)).toBe('80%');
    expect(spec.axes[1].label.formatMethod(1.5)).toBe(1.5);
  });

  it('should use single-data label formatting on band axis', () => {
    const singleDataTable = [{ name: 'Task A', value: 0.75 }];
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable: singleDataTable,
      cell: {
        x: 'name',
        y: 'value'
      },
      chartType: ChartType.LinearProgress.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.LinearProgress);
    expect(spec.type).toBe('linearProgress');
    expect(spec.data.values).toEqual(singleDataTable);
    expect(typeof spec.axes[0].label.formatMethod).toBe('function');
    expect(spec.axes[0].label.formatMethod('Task A')).toBe('name: Task A');
  });

  it('should map color field to seriesField', () => {
    const coloredDataTable = [
      { project: 'A', completion: 0.7, department: 'Engineering' },
      { project: 'B', completion: 0.5, department: 'Marketing' }
    ];
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable: coloredDataTable,
      cell: {
        x: 'project',
        y: 'completion',
        color: 'department'
      },
      chartType: ChartType.LinearProgress.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.LinearProgress);
    expect(spec.type).toBe('linearProgress');
    expect(spec.xField).toBe('completion');
    expect(spec.yField).toBe('project');
    expect(spec.seriesField).toBe('department');
    expect(spec.data.values).toEqual(coloredDataTable);
  });
});
