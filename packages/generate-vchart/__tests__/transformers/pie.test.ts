import { generateChart } from '../../src';
import { COLORS, THREE_FIELD_DATA, TWO_FIELD_DATA } from '../common';

describe('generate pie chart', () => {
  it('should generate bar chart when only specify angle field', () => {
    const chart = generateChart('pie', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        angle: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'pie',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA },
      valueField: 'value',
      categoryField: 'name',
      label: {
        visible: true
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

  it('should generate bar chart when only specify value field', () => {
    const chart = generateChart('pie', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        value: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'pie',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA },
      valueField: 'value',
      categoryField: 'name',
      label: {
        visible: true
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

  it('should generate pie chart when only specify category field', () => {
    const chart = generateChart('pie', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        category: 'name'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'pie',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA },
      valueField: 'value',
      categoryField: 'name',
      label: {
        visible: true
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

  it('should generate pie chart when specify color field', () => {
    const chart = generateChart('pie', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        color: 'name'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'pie',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA },
      valueField: 'value',
      categoryField: 'name',
      label: {
        visible: true
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

  it('should generate pie chart when specify colors', () => {
    const chart = generateChart('pie', {
      dataTable: THREE_FIELD_DATA,

      cell: {
        color: 'name'
      },
      colors: COLORS,
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'pie',
      color: COLORS,
      data: { id: 'data', values: THREE_FIELD_DATA },
      valueField: 'value',
      categoryField: 'name',
      label: {
        visible: true
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
});
