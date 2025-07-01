import { DataRole, DataType, type FieldInfoItem } from '@visactor/generate-vchart';
import { checkChartTypeAndCell } from '../../../src/atom/chartGenerator/utils';

describe('checkChartTypeAndCell', () => {
  const mockFieldInfo: FieldInfoItem[] = [
    { fieldName: 'field1', type: DataType.STRING, role: DataRole.DIMENSION },
    { fieldName: 'field2', type: DataType.INT, role: DataRole.MEASURE },
    { fieldName: 'field3', type: DataType.INT, role: DataRole.MEASURE }
  ];

  describe('field validation', () => {
    it('should return true when all fields exist', () => {
      const cell = { x: 'field1', y: 'field2' };
      const result = checkChartTypeAndCell('BAR CHART', cell, mockFieldInfo);
      expect(result).toBe(true);
    });

    it('should return true when missing single field', () => {
      const cell = { x: 'field1', y: 'missingField' };
      const result = checkChartTypeAndCell('LINE CHART', cell, mockFieldInfo);
      expect(result).toBe(true); // Because checkChannel will fail
    });

    it('should warn and return true when missing field in array', () => {
      const cell = { x: ['field1', 'missingField'], y: 'field2' };
      const result = checkChartTypeAndCell('BAR CHART', cell, mockFieldInfo);
      expect(result).toBe(true); // Because checkChannel will fail
    });

    it('should handle empty cell field', () => {
      const cell = { y: 'field2' };
      const result = checkChartTypeAndCell('LINE CHART', cell, mockFieldInfo);
      expect(result).toBe(false); // Because checkChannel will fail
    });
  });

  describe('chart type validation', () => {
    it('should validate BAR CHART channels', () => {
      const validCell = { x: 'field1', y: 'field2' };
      const invalidCell = { x: 'field1' }; // missing y

      expect(checkChartTypeAndCell('BAR CHART', validCell, mockFieldInfo)).toBe(true);
      expect(checkChartTypeAndCell('BAR CHART', invalidCell, mockFieldInfo)).toBe(false);
    });

    it('should validate LINE CHART channels', () => {
      const validCell = { x: 'field1', y: 'field2' };
      const invalidCell = { y: 'field2' }; // missing x

      expect(checkChartTypeAndCell('LINE CHART', validCell, mockFieldInfo)).toBe(true);
      expect(checkChartTypeAndCell('LINE CHART', invalidCell, mockFieldInfo)).toBe(false);
    });

    it('should validate DUAL AXIS CHART channels', () => {
      const validCell = { x: 'field1', y: ['field2', 'field3'] };
      const invalidCell1 = { x: 'field1', y: 'field2' }; // y needs 2 fields
      const invalidCell2 = { x: 'field1' }; // missing y

      expect(checkChartTypeAndCell('DUAL AXIS CHART', validCell, mockFieldInfo)).toBe(true);
      expect(checkChartTypeAndCell('DUAL AXIS CHART', invalidCell1, mockFieldInfo)).toBe(false);
      expect(checkChartTypeAndCell('DUAL AXIS CHART', invalidCell2, mockFieldInfo)).toBe(false);
    });

    it('should return true for unchecked chart types', () => {
      const cell = { anyField: 'field1' };
      expect(checkChartTypeAndCell('UNKNOWN CHART', cell, mockFieldInfo)).toBe(true);
    });
  });
});
