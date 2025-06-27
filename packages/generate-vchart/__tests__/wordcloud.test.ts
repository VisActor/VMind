import { generateChart } from '../src';
import { TWO_FIELD_DATA } from './common';

describe('generate wordcloud', () => {
  it('should generate wordcloud chart', () => {
    const chart = generateChart('wordcloud', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        color: 'name',
        size: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'wordCloud',
      nameField: 'name',
      seriesField: 'name',
      valueField: 'value',
      fontSizeRange: [20, 50],
      fontWeightRange: [800, 800],
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA }
    });
  });

  it('should generate wordcloud chart for empty cell', () => {
    const chart = generateChart('wordcloud', {
      dataTable: TWO_FIELD_DATA,

      cell: {},
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'wordCloud',
      nameField: 'name',
      seriesField: 'name',
      fontSizeRange: [20, 50],
      fontWeightRange: [800, 800],
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: { id: 'data', values: TWO_FIELD_DATA }
    });
  });
});
