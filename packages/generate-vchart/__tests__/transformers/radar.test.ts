import { generateChart } from '../../src';
import { TWO_FIELD_DATA } from '../common';

describe('generate radar chart of dataTable which has two field', () => {
  it('should generate radar chart', () => {
    const chart = generateChart('radar', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'radar',
      area: { visible: true },
      axes: [
        {
          type: 'linear',
          visible: true,
          orient: 'radius', // radius axis

          zIndex: 100,

          domainLine: {
            visible: false
          },
          label: {
            visible: true,
            space: 0
          },
          grid: {
            smooth: false
          }
        },
        {
          orient: 'angle', // angle axis
          type: 'band',
          visible: true,
          zIndex: 50,
          tick: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          label: {
            space: 20
          }
        }
      ],
      categoryField: 'name',
      valueField: 'value',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA }
    });
  });

  it('should generate radar chart when specify cell.angle and cell.value', () => {
    const chart = generateChart('radar', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        angle: 'name',
        value: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'radar',
      area: { visible: true },
      axes: [
        {
          orient: 'radius', // radius axis
          type: 'linear',
          zIndex: 100,

          domainLine: {
            visible: false
          },
          label: {
            visible: true,
            space: 0
          },
          grid: {
            smooth: false
          },
          visible: true
        },
        {
          orient: 'angle', // angle axis,
          type: 'band',
          visible: true,
          zIndex: 50,
          tick: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          label: {
            space: 20
          }
        }
      ],
      categoryField: 'name',
      valueField: 'value',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA }
    });
  });
});
