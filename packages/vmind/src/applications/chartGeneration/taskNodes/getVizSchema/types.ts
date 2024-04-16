import { ChartGenerationContext } from 'src/applications/types';
import { VizSchema } from 'src/common/typings';

export type GetVizSchemaContext = ChartGenerationContext;

export type GetVizSchemaOutput = {
  vizSchema: VizSchema;
};
