import JSON5 from 'json5';
import { isArray } from '@visactor/vutils';

export const parseSQLResponse = (response: string) => {
  const sql = response.match(/sql:\n?```(.*?)```/s)[1];
  const fieldInfoStr = response.match(/fieldInfo:\n?```(.*?)```/s)[1];
  let fieldInfo = [];
  try {
    const tempFieldInfo = JSON5.parse(fieldInfoStr);
    if (isArray(tempFieldInfo)) {
      fieldInfo = tempFieldInfo;
    } else {
      fieldInfo = tempFieldInfo.fieldInfo;
    }
  } catch (e) {
    //fieldInfoStr is not a json string; try to wrap it with []
    fieldInfo = JSON5.parse(`[${fieldInfoStr}]`);
  }
  return {
    sql,
    llmFieldInfo: fieldInfo
  };
};
