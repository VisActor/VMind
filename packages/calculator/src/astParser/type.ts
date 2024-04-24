import { Select } from 'node-sql-parser';
import { Query, TableData } from '../types';

export type SQLAst = Select;
export type ASTParserPipe = (query: Partial<Query>, context: ASTParserContext) => Partial<Query>;

export type ASTParserContext = {
  ast: SQLAst;
  dataSource: TableData;
  fieldInfo: SimpleFieldInfo[];
  replaceMap: Map<string, string>;
};

export type DataQueryResponse = {
  THOUGHT?: string;
  sql: string;
  fieldInfo: { fieldName: string; description?: string }[];
};

export type SimpleFieldInfo = {
  fieldName: string;
  description?: string; //additional description of the field. This will help the model have a more comprehensive understanding of this field, improving the quality of chart generation.
  type: DataType;
  role: ROLE;
};

export enum DataType {
  INT = 'int',
  STRING = 'string',
  FLOAT = 'float',
  DATE = 'date'
}

export enum ROLE {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}
