import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import { getVizSchema } from './utils';
import type { GetVizSchemaContext, GetVizSchemaOutput } from './types';

const GetVizSchemaTaskNodeMeta: RuleBasedTaskNodeMeta<GetVizSchemaContext, GetVizSchemaOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [getVizSchema]
};

export default GetVizSchemaTaskNodeMeta;
