import { isArray, isNil } from '@visactor/vutils';
import { DataTable } from '../types/transform';

export const isValidDataTable = (dataTable?: DataTable | undefined | null) => {
  return !isNil(dataTable) && isArray(dataTable) && dataTable.length > 0;
};
