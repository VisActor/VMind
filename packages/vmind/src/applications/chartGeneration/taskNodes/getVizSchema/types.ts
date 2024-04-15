import { ChartGenerationContext } from 'src/applications/types';
import { VizSchema } from 'src/typings';

export type GetVizSchemaContext = ChartGenerationContext;

export type GetVizSchemaOutput = {
  vizSchema: VizSchema;
};
