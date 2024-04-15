import { RuleBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { getVizSchema } from './utils';
import { GetVizSchemaContext, GetVizSchemaOutput } from './types';

const generateVizSchemaTaskNodeMeta: RuleBasedTaskNodeMeta<GetVizSchemaContext, GetVizSchemaOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [getVizSchema]
};

export default generateVizSchemaTaskNodeMeta;
