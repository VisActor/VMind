import { SUPPORTED_CHART_LIST } from '../../../src/atom/chartGenerator/const';
import { getContextAfterRevised } from '../../../src/atom/chartGenerator/llmResultRevise';
import { getCellContextBySimpleVChartSpec } from '../../../src/atom/chartGenerator/rule';
import { getChartSpecWithContext } from '../../../src/atom/chartGenerator/spec';
import type { GenerateChartCellContext } from '../../../src/atom/chartGenerator/type';
import type { SimpleVChartSpec } from '../../../src/atom/imageReader/interface';

function convertSimpleSpecToSpec(simpleSpec: SimpleVChartSpec): any {
  const { ctx, mockLLMContent } = getCellContextBySimpleVChartSpec(simpleSpec);
  const { CHART_TYPE, FIELD_MAP, stackOrPercent, transpose } = mockLLMContent;
  let newContext = {
    ...ctx,
    chartType: CHART_TYPE,
    cell: FIELD_MAP,
    chartTypeList: SUPPORTED_CHART_LIST,
    stackOrPercent,
    transpose
  } as GenerateChartCellContext;
  newContext = getContextAfterRevised(newContext);

  const { spec } = getChartSpecWithContext(newContext);

  return { spec };
}

const groupRadar = {
  type: 'radar',
  coordinate: 'polar',
  palette: ['#5470C6', '#91CC75', '#EE6666'],
  legends: [
    {
      type: 'discrete',
      orient: 'top'
    }
  ],
  axes: [
    {
      type: 'band',
      orient: 'angle'
    },
    {
      type: 'linear',
      orient: 'radius',
      hasGrid: true
    }
  ],
  series: [
    {
      type: 'line',
      data: [
        {
          name: '1th',
          value: 5,
          group: 'A'
        },
        {
          name: '2th',
          value: 4,
          group: 'A'
        },
        {
          name: '3th',
          value: 3,
          group: 'A'
        },
        {
          name: '4th',
          value: 4,
          group: 'A'
        },
        {
          name: '5th',
          value: 5,
          group: 'A'
        },
        {
          name: '6th',
          value: 3,
          group: 'A'
        },
        {
          name: '7th',
          value: 4,
          group: 'A'
        },
        {
          name: '8th',
          value: 5,
          group: 'A'
        },
        {
          name: '9th',
          value: 4,
          group: 'A'
        },
        {
          name: '10th',
          value: 3,
          group: 'A'
        },
        {
          name: '11th',
          value: 4,
          group: 'A'
        },
        {
          name: '12th',
          value: 5,
          group: 'A'
        }
      ]
    },
    {
      type: 'line',
      data: [
        {
          name: '1th',
          value: 3,
          group: 'B'
        },
        {
          name: '2th',
          value: 2,
          group: 'B'
        },
        {
          name: '3th',
          value: 5,
          group: 'B'
        },
        {
          name: '4th',
          value: 3,
          group: 'B'
        },
        {
          name: '5th',
          value: 4,
          group: 'B'
        },
        {
          name: '6th',
          value: 2,
          group: 'B'
        },
        {
          name: '7th',
          value: 3,
          group: 'B'
        },
        {
          name: '8th',
          value: 4,
          group: 'B'
        },
        {
          name: '9th',
          value: 5,
          group: 'B'
        },
        {
          name: '10th',
          value: 3,
          group: 'B'
        },
        {
          name: '11th',
          value: 4,
          group: 'B'
        },
        {
          name: '12th',
          value: 2,
          group: 'B'
        }
      ]
    },
    {
      type: 'line',
      data: [
        {
          name: '1th',
          value: 4,
          group: 'C'
        },
        {
          name: '2th',
          value: 3,
          group: 'C'
        },
        {
          name: '3th',
          value: 4,
          group: 'C'
        },
        {
          name: '4th',
          value: 5,
          group: 'C'
        },
        {
          name: '5th',
          value: 3,
          group: 'C'
        },
        {
          name: '6th',
          value: 4,
          group: 'C'
        },
        {
          name: '7th',
          value: 5,
          group: 'C'
        },
        {
          name: '8th',
          value: 3,
          group: 'C'
        },
        {
          name: '9th',
          value: 4,
          group: 'C'
        },
        {
          name: '10th',
          value: 5,
          group: 'C'
        },
        {
          name: '11th',
          value: 3,
          group: 'C'
        },
        {
          name: '12th',
          value: 4,
          group: 'C'
        }
      ]
    }
  ]
};

it('groupRadar', () => {
  const { spec } = convertSimpleSpecToSpec(groupRadar as SimpleVChartSpec);

  expect(spec.valueField).toBe('value');
});

it('rangeColumn', () => {
  const rangeColumn = {
    type: 'rangeColumn',
    coordinate: 'rect',
    transpose: true,
    data: [
      {
        name: 'Category One',
        value: 76,
        group: 'start'
      },
      {
        name: 'Category One',
        value: 100,
        group: 'end'
      }
    ],
    palette: ['#007bff'],
    axes: [
      {
        type: 'band',
        orient: 'left'
      },
      {
        type: 'linear',
        orient: 'bottom',
        hasGrid: true
      }
    ],
    label: [
      {
        position: 'inside'
      }
    ]
  };

  const { spec } = convertSimpleSpecToSpec(rangeColumn as SimpleVChartSpec);

  expect(spec.data.values).toEqual([
    {
      name: 'Category One',
      value: 76,
      value1: 100
    }
  ]);
});
