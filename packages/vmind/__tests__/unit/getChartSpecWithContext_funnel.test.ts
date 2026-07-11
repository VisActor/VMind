import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { ChartType } from '../../src/types';

const dataTable = [
  { stage: 'Visit', count: 1000 },
  { stage: 'Signup', count: 400 },
  { stage: 'Pay', count: 120 }
];

describe('getChartSpecWithContext - Funnel Chart', () => {
  it('should generate correct funnel spec and sort values descending by measure', () => {
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable: [
        { stage: 'Pay', count: 120 },
        { stage: 'Visit', count: 1000 },
        { stage: 'Signup', count: 400 }
      ],
      cell: {
        x: 'stage',
        y: 'count'
      },
      chartType: ChartType.FunnelChart.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.FunnelChart);
    expect(spec.type).toBe('funnel');
    expect(spec.categoryField).toBe('stage');
    expect(spec.valueField).toBe('count');
    expect(spec.label).toMatchObject({ visible: true });
    expect(spec.data).toMatchObject({ id: 'data' });
    expect(spec.data.values).toEqual(dataTable);
  });

  it('should map color/value cell aliases onto categoryField and valueField', () => {
    const aliasedDataTable = [
      { name: 'Awareness', value: 500 },
      { name: 'Interest', value: 300 },
      { name: 'Purchase', value: 80 }
    ];
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable: aliasedDataTable.map(item => ({ ...item })),
      cell: {
        color: 'name',
        value: 'value'
      },
      chartType: ChartType.FunnelChart.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.FunnelChart);
    expect(spec.type).toBe('funnel');
    expect(spec.categoryField).toBe('name');
    expect(spec.valueField).toBe('value');
    // Without cell.y, funnelData sort comparator falls back to undefined values and keeps input order.
    expect(spec.data.values).toEqual(aliasedDataTable);
  });

  it('should prefer value field over y when both are present', () => {
    const mixedDataTable = [
      { step: 'A', metric: 10, amount: 90 },
      { step: 'B', metric: 20, amount: 40 }
    ];
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable: mixedDataTable.map(item => ({ ...item })),
      cell: {
        x: 'step',
        y: 'metric',
        value: 'amount'
      },
      chartType: ChartType.FunnelChart.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.FunnelChart);
    expect(spec.type).toBe('funnel');
    expect(spec.categoryField).toBe('step');
    // valueField uses cell.value first; sorting still uses cell.y (metric) when present.
    expect(spec.valueField).toBe('amount');
    expect(spec.data.values.map((row: { step: string }) => row.step)).toEqual(['B', 'A']);
  });
});
