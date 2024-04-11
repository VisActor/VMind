import { RuleBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { GetVizSchemaContext, GetVizSchemaOutput } from '../../types';
import { getVizSchema } from './utils';

const generateVizSchemaTaskNodeMeta: RuleBasedTaskNodeMeta<GetVizSchemaContext, GetVizSchemaOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [getVizSchema]
};

export default generateVizSchemaTaskNodeMeta;
