/** Base DataCell */
export type DataCell = string | number;

/** Base Data Item */
export type DataItem = Record<string, DataCell>;

/** Data Table */
export type DataTable = DataItem[];

export enum DataType {
  DATE = 'date',
  TIME = 'time',
  STRING = 'string',
  REGION = 'region',
  NUMERICAL = 'numerical',
  RATIO = 'ratio',
  COUNT = 'count',
  FLOAT = 'float',
  INT = 'int'
}

export enum ROLE {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

/** field information Of Data Table */
export interface FieldInfo {
  /** name of field */
  fieldName: string;
  /** alias of field */
  alias?: string;
  /** description of field */
  description?: string;
  /** field type, eg: time / category / numerical */
  type: DataType;
  /** field role */
  role: ROLE;
  /** field location */
  location?: ROLE;
  /** example of field value */
  dataExample?: DataCell[];
  /** domain of field value */
  domain?: (string | number)[];
  /** unit of measure field */
  unit?: string;
  /**  */
  ratioGranularity?: '%' | '‰';
  /** granularity of date field */
  dateGranularity?: 'year' | 'quarter' | 'month' | 'week' | 'day';
}
