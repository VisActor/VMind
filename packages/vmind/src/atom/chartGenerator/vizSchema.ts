import type { ChartGeneratorCtx } from '../../types';

/**
 * Generate a vizSchema from fieldInfo
 * @param fieldInfo SimpleFieldInfo[] - An array of field information, each element contains the field name, description, type, and role, etc.
 * @returns Partial<VizSchema> - Returns a partial VizSchema object, containing the transformed field information.
 */
export const getVizSchema = (context: ChartGeneratorCtx) => {
  const { fieldInfo } = context;
  return {
    fields: fieldInfo.map(d => ({
      id: d.fieldName,
      alias: d.fieldName,
      description: d.description,
      visible: true,
      type: d.type,
      role: d.role,
      location: d.role
    }))
  };
};
