export type DataQueryResponse = {
  THOUGHT?: string;
  sql: string;
  fieldInfo: { fieldName: string; description?: string }[];
};
