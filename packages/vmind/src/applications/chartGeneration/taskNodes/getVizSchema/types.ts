import type { ChartGenerationContext } from '../../../../applications/types';
import type { VizSchema } from '../../../../common/typings';

export type GetVizSchemaContext = ChartGenerationContext;

export type GetVizSchemaOutput = {
  vizSchema: VizSchema;
};
