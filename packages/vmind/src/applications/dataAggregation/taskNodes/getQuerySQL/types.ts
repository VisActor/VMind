import { SimpleFieldInfo } from 'src/typings';
import { SQL } from '../../types';

export type GetQuerySQLResult = {
  sql: SQL;
  llmFieldInfo: SimpleFieldInfo[];
  usage: any;
};
