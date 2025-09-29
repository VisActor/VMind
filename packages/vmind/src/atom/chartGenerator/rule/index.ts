import { array } from '@visactor/vutils';
import type { SimpleVChartSpec } from '../../../atom/imageReader/interface';
import { ChartType } from '../../../types';
import type { Cell, ChartGeneratorCtx } from '../../../types';
import { unfoldTransform } from '../../../utils/unfold';
import type { DataTable } from '@visactor/generate-vchart';
import { DataRole, DataType, generateChart } from '@visactor/generate-vchart';
import type { GenerateChartCellContext } from '../type';

/**
 * 根据规则去模拟LLM 生成结果
 * @param context
 * @returns
 */
export const getRuleLLMContent = (context: ChartGeneratorCtx) => {
  const { fieldInfo } = context;
  const measureFields = fieldInfo.filter(field => field.role === DataRole.MEASURE);
  let chartType = null;
  const cell: Cell = {};

  if (measureFields.length === 1 && measureFields[0].type === DataType.RATIO) {
    // waterwave spec
    chartType = ChartType.LiquidChart;
    cell.value = measureFields[0].fieldName;
    return {
      CHART_TYPE: chartType,
      FIELD_MAP: cell
    };
  }
  return null;
};

const formatDataTable = (simpleVChartSpec: SimpleVChartSpec, data: DataTable) => {
  const { type } = simpleVChartSpec;
  if (type === 'rangeColumn') {
    const firstDatum = data[0];

    if (firstDatum && 'group' in firstDatum) {
      const groups = data.reduce((acc, cur) => {
        if (!acc.includes(cur.group)) {
          acc.push(cur.group);
        }
        return acc;
      }, []);

      if (groups.length === 2) {
        const newData = unfoldTransform(
          {
            keyField: 'group',
            valueField: 'value',
            groupBy: 'name'
          },
          data
        );

        return newData.map(entry => {
          return {
            name: entry.name,
            value: entry[groups[0]],
            value1: entry[groups[1]]
          };
        });
      }
    }
  }
  // 桑基图特殊判断，直接使用大模型生成的links数据作为dataTable
  else if (type === 'sankey') {
    return simpleVChartSpec.series[0]?.links;
  }
  // 散点图认为有两个度量值
  else if (type === 'scatter') {
    return data.map(item => {
      const arr = array(item.value);
      return {
        name: item.name,
        value: arr[0],
        value1: arr[1]
      };
    });
  } else if (type === 'waterfall') {
    const finalData = [];
    for (let i = data.length - 1; i >= 0; i--) {
      if (i === 0 || i === data.length - 1) {
        finalData.push({ name: data[i].name, value: data[i].value });
      } else {
        finalData.push({ name: data[i].name, value: Number(data[i].value) - Number(data[i - 1].value) });
      }
    }
    finalData.reverse();
    return finalData;
  }
  // 热力图特殊处理
  else if (type === 'heatmap') {
    // 拿到所有的'name'，并设置值为1
    const finalData = Array.from(
      new Set(data.map(item => item.name).concat(data.map(item => item.name1)))
        .keys()
        .map(key => ({ name: key, name1: key, value: 1 }))
    );
    // 模型识别数据可能不全，尽可能补全数据
    for (const item of data) {
      const obj = { name: item.name1, name1: item.name, value: item.value as number };
      if (finalData.findIndex(i => i.name === item.name && i.name1 === item.name1) === -1) {
        finalData.push(item as typeof obj, obj);
      }
    }
    return finalData;
  }

  return data;
};

export const getContextBySimpleVChartSpec = (simpleVChartSpec: SimpleVChartSpec) => {
  const { type, data, series: originalSeries, coordinate, palette } = simpleVChartSpec;

  const dataTable =
    formatDataTable(
      simpleVChartSpec,
      data ??
        originalSeries?.reduce((acc, cur) => {
          // 对比漏斗图，group字段可能不会在data中，特殊处理
          if (type === 'comparativeFunnel' && 'group' in cur) {
            cur.data?.forEach(item => (item.group = cur.group as string));
          }
          acc.push(...cur.data);
          return acc;
        }, [])
    ) ?? [];

  const chartType =
    type === 'common'
      ? originalSeries &&
        originalSeries.length >= 2 &&
        originalSeries.some((s, index) => index > 0 && s.type !== originalSeries[0].type)
        ? type
        : originalSeries?.[0]?.type === 'bar' && coordinate === 'polar'
        ? 'rose'
        : originalSeries?.[0]?.type ?? type
      : type === 'bar' && 'value' in data[0] && 'value1' in data[0]
      ? 'rangeColumn'
      : type;

  let series = originalSeries;
  if (chartType === 'common') {
    // series合并相同type的数据
    series = originalSeries?.reduce((acc, curr) => {
      const existItem = acc.find(item => item.type === curr.type);
      if (existItem) {
        existItem.data.push(...curr.data);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }

  const cell: Cell = {};
  const firstDatum = dataTable?.[0];
  if (chartType === 'sankey') {
    cell.source = 'source';
    cell.target = 'target';
  }
  if (firstDatum && 'group' in firstDatum) {
    cell.color = 'group';
  } else if (palette && palette.length === dataTable?.length && palette.length > 1) {
    cell.color = 'name';
  }
  // 上一个if之后调用，防止被覆盖
  if (chartType === 'treemap') {
    cell.color = ['group', 'name'];
    cell.size = 'value';
  }

  if (coordinate === 'polar') {
    if (type === 'pie') {
      cell.angle = 'value';
    } else if (type === 'rose') {
      cell.angle = 'name';
      cell.radius = 'value';
    } else if (type === 'radar') {
      cell.x = 'name';
      cell.y = 'value';
    }
    cell.category = 'name';
  } else if (coordinate === 'rect' || chartType === 'funnel') {
    cell.x = 'name';
    cell.y = 'value';
  } else if (chartType === 'circlePacking') {
    cell.size = 'value';
  }
  if (type === 'scatter') {
    cell.x = 'value';
    cell.y = 'value1';
  }
  if (chartType === 'heatmap') {
    cell.x = 'name';
    // 热图有两个维度数据，因此新增name1字段
    cell.y = 'name1';
    cell.size = 'value';
  }
  if (chartType === 'comparativeFunnel') {
    cell.x = 'name';
    cell.y = 'value';
    cell.category = 'group';
  }

  const fieldInfo = ['name', 'value', 'group', 'value1', 'name1'].reduce((res, field) => {
    if (firstDatum && field in firstDatum) {
      res.push({
        fieldName: field,
        type: field === 'value' || field === 'value1' ? DataType.FLOAT : DataType.STRING,
        role: field === 'value' || field === 'value1' ? DataRole.MEASURE : DataRole.DIMENSION
      });
    }

    return res;
  }, []);

  if (chartType === 'rangeColumn' && 'value1' in firstDatum) {
    cell.y = ['value', 'value1'];
    fieldInfo.push({
      fieldName: 'value1',
      type: DataType.FLOAT,
      role: DataRole.MEASURE
    });
  }

  const context: GenerateChartCellContext = generateChart(chartType, {
    ...simpleVChartSpec,
    dataTable,
    cell,
    fieldInfo,
    series
  });
  context.chartType = chartType;
  return context;
};
