import { array } from '@visactor/vutils';
import { DataItem, GenerateChartInput } from '../types';
import { data, discreteLegend, formatXFields } from './common';

const title = (context: GenerateChartInput) => {
  const { spec } = context;
  const { title } = spec;
  spec.title = {
    ...title,
    id: 'title'
  };
  return { spec };
};

const layout = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.layout = {
    type: 'grid',
    col: 3,
    row: 3,
    colWidth: [{ index: 1, size: 120 }],
    elements: [
      { modelId: 'title', col: 0, row: 0, colSpan: 3 },
      { modelId: 'legend', col: 0, row: 1, colSpan: 3 },
      { modelId: 'left', col: 0, row: 2 },
      { modelId: 'right', col: 2, row: 2 }
    ]
  };
  spec.region = [{ id: 'left' }, { id: 'right' }];
  return { spec };
};

const comparativeFunnelSeries = (context: GenerateChartInput) => {
  const { spec, cell } = context;
  const generateSeries = (index: number, align: 'left' | 'right') => {
    return {
      type: 'funnel',
      dataIndex: index,
      regionIndex: index,
      isTransform: true,
      gap: 2,
      maxSize: '60%',
      shape: 'rect',
      funnelAlign: align,
      categoryField: cell.x,
      valueField: cell.y,
      heightRatio: 1.5,
      funnel: {
        style: {
          fill: { field: cell.category, scale: 'color' },
          cornerRadius: 4
        }
      },
      transform: {
        style: {
          fill: { field: cell.category, scale: 'color' },
          fillOpacity: 0.1
        }
      },
      outerLabel: {
        visible: true,
        line: { visible: false },
        formatMethod: (data: any, datum: DataItem) => datum[array(cell.y)[0]],
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          fill: 'black',
          limit: Infinity
        }
      },
      extensionMark: [
        index === 0
          ? {
              type: 'text',
              dataIndex: 0,
              style: {
                text: (data: any) => data[array(cell.x)[0]],
                fontSize: 24,
                fill: 'grey',
                textAlign: 'center',
                x: (data: any, ctx: any) => {
                  const { vchart } = ctx;
                  return vchart.getCurrentSize().width / 2 - 10;
                },
                y: (data: DataItem, ctx: any) => {
                  const { getPoints } = ctx;
                  const [tl, tr, br, bl] = getPoints(data);
                  return (tl.y + bl.y) / 2;
                }
              }
            }
          : null
      ].filter(Boolean)
    };
  };
  spec.series = [generateSeries(0, 'right'), generateSeries(1, 'left')];
  return { spec };
};

const comparativeFunnelLegend = (context: GenerateChartInput) => {
  const { spec, cell } = context;
  spec.seriesField = cell.category;
  spec.legends = array(spec.legends).map(legend => ({
    ...legend,
    id: 'legend',
    orient: 'top'
  }));
  return { spec };
};

const comparativeFunnelData = (context: GenerateChartInput) => {
  const { spec, dataTable } = context;
  const mp = {};
  dataTable.forEach(item => {
    const { group } = item;
    if (!mp[group]) {
      mp[group] = [];
    }
    mp[group].push(item);
  });
  spec.data = Object.entries(mp).map(([group, data]) => ({ id: group, values: data }));
  return { spec };
};

export const pipelineComparativeFunnel = [
  title,
  formatXFields,
  layout,
  comparativeFunnelData,
  comparativeFunnelSeries,
  discreteLegend,
  comparativeFunnelLegend
];
