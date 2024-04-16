import { LOCATION, SimpleFieldInfo, VizSchema } from 'src/common/typings';
import { Transformer } from 'src/base/tools/transformer';
import { GetVizSchemaContext, GetVizSchemaOutput } from './types';

/**
 * Generate a vizSchema from fieldInfo
 * @param fieldInfo SimpleFieldInfo[] - An array of field information, each element contains the field name, description, type, and role, etc.
 * @returns Partial<VizSchema> - Returns a partial VizSchema object, containing the transformed field information.
 */
const getSchemaFromFieldInfo = (fieldInfo: SimpleFieldInfo[]): Partial<VizSchema> => {
  const schema = {
    fields: fieldInfo
      //.filter(d => usefulFields.includes(d.fieldName))
      .map(d => ({
        id: d.fieldName,
        alias: d.fieldName,
        description: d.description,
        visible: true,
        type: d.type,
        role: d.role,
        location: d.role as unknown as LOCATION
      }))
  };
  return schema;
};

export const getVizSchema: Transformer<GetVizSchemaContext, GetVizSchemaOutput> = context => {
  const { fieldInfo } = context;
  const vizSchema = getSchemaFromFieldInfo(fieldInfo) as VizSchema;

  return { vizSchema };
};
