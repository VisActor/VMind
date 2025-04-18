import { merge } from '@visactor/vutils';
import { runOperactionsOfSpec, updateSpecByOperation } from '../../../../src/atom/VChartSpec/utils';

const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        {
          type: 'Autocracies',
          year: '1930',
          value: 129
        },
        {
          type: 'Autocracies',
          year: '1940',
          value: 133
        },
        {
          type: 'Autocracies',
          year: '1950',
          value: 130
        },
        {
          type: 'Autocracies',
          year: '1960',
          value: 126
        },
        {
          type: 'Autocracies',
          year: '1970',
          value: 117
        },
        {
          type: 'Autocracies',
          year: '1980',
          value: 114
        },
        {
          type: 'Autocracies',
          year: '1990',
          value: 111
        },
        {
          type: 'Autocracies',
          year: '2000',
          value: 89
        },
        {
          type: 'Autocracies',
          year: '2010',
          value: 80
        },
        {
          type: 'Autocracies',
          year: '2018',
          value: 80
        },
        {
          type: 'Democracies',
          year: '1930',
          value: 22
        },
        {
          type: 'Democracies',
          year: '1940',
          value: 13
        },
        {
          type: 'Democracies',
          year: '1950',
          value: 25
        },
        {
          type: 'Democracies',
          year: '1960',
          value: 29
        },
        {
          type: 'Democracies',
          year: '1970',
          value: 38
        },
        {
          type: 'Democracies',
          year: '1980',
          value: 41
        },
        {
          type: 'Democracies',
          year: '1990',
          value: 57
        },
        {
          type: 'Democracies',
          year: '2000',
          value: 87
        },
        {
          type: 'Democracies',
          year: '2010',
          value: 98
        },
        {
          type: 'Democracies',
          year: '2018',
          value: 99
        }
      ]
    }
  ],
  xField: ['year', 'type'],
  yField: 'value',
  seriesField: 'type',
  legends: {
    visible: true,
    orient: 'top',
    position: 'start'
  }
};

describe('updateSpecByOperation of barchart', () => {
  it('should delete the array of markLine when op is "deleteAll"', () => {
    const specWithMarkLine = {
      ...spec,
      markLine: [
        {
          y: 10,
          line: {
            style: {
              stroke: '#000',
              lineDash: [5, 5]
            }
          },
          label: {
            position: 'insideEnd',
            text: 'Value 10'
          }
        },
        {
          y: 100,
          line: {
            style: {
              stroke: '#000',
              lineDash: [5, 5]
            }
          },
          label: {
            position: 'insideEnd',
            text: 'Value 100'
          }
        },
        {
          y: 60,
          line: {
            style: {
              stroke: '#000',
              lineDash: [5, 5]
            }
          },
          label: {
            position: 'insideEnd',
            text: 'Value 60'
          }
        }
      ]
    };

    const { newSpec } = updateSpecByOperation(merge({}, specWithMarkLine), {
      op: 'deleteAll',
      target: 'markLine'
    });

    expect(newSpec).toEqual(spec);
  });

  it('should delete the array of markLine when op is "deleteAll"', () => {
    const specWithMarkLine = {
      ...spec,
      markLine: [
        {
          x: 10
        }
      ]
    };
    const { spec: newSpec } = runOperactionsOfSpec(merge({}, specWithMarkLine), [
      {
        op: 'delete',
        target: 'markLine.x'
      },
      {
        op: 'add',
        target: 'markLine.y',
        value: 10
      }
    ]);

    expect(newSpec.markLine).toEqual([{ y: 10 }]);
  });
});
