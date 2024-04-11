import { ChartType, SimpleFieldInfo, VMindDataset, VizSchema } from 'src/typings';
import { ChartGenerationContext } from '../types';

export type Cell = {
  //字段映射，可用的视觉通道：["x","y","color","size","angle","time"]
  x?: string;
  y?: string | string[];
  color?: string;
  size?: string;
  angle?: string;
  radius?: string;
  time?: string;
  source?: string;
  target?: string;
  value?: string;
  category?: string;
};

export type GetVizSchemaContext = ChartGenerationContext;

export type GetVizSchemaOutput = {
  vizSchema: VizSchema;
};

export type GenerateChartTypeContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartTypeOutput = {
  chartType: ChartType;
};

export type GenerateFieldMapContext = GenerateChartTypeContext & GenerateChartTypeOutput;

export type GenerateFieldMapOutput = {
  cell: Cell;
};

export type GenerateChartAndFieldMapContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartAndFieldMapOutput = GenerateFieldMapOutput & GenerateChartTypeOutput;
