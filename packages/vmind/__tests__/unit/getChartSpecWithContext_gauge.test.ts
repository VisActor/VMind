import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { ChartType } from '../../src/types';

describe('getChartSpecWithContext - Gauge Chart', () => {
  it('should generate correct gauge spec', () => {
    const context = {
      chartType: ChartType.Gauge.toUpperCase(),
      dataTable: [
        {
          type: 'A',
          value: 0.6
        }
      ],
      cell: { size: 'value', color: 'type' }
    };

    const result = getChartSpecWithContext(context);

    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('gauge');
    expect(result.spec.valueField).toEqual(context.cell.size);
    expect(result.spec.categoryField).toEqual(context.cell.color);
    expect(result.spec.outerRadius).toEqual(0.8);
    expect(result.spec.innerRadius).toEqual(0.5);
    expect(result.spec.startAngle).toEqual(-180);
    expect(result.spec.endAngle).toEqual(0);
  });

  it('should handle missing dataTable fields gracefully', () => {
    const context = {
      chartType: ChartType.Gauge.toUpperCase(),
      dataTable: [{}],
      cell: { size: 'value', color: 'type' }
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec).toBeDefined();
  });

  it('should handle missing cell fields gracefully', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: [
        {
          type: 'A',
          value: 0.6
        }
      ],
      cell: {}
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec).toBeDefined();
  });
});
