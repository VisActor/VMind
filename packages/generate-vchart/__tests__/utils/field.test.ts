import {
  getFieldsByDataType,
  getAllFieldsByDataType,
  getFieldsByRoleType,
  getFieldIdInCell,
  sampleSize,
  detectFieldType,
  getFieldInfo,
  getFieldInfoFromDataset,
  getRemainedFields
} from '../../src/utils/field';
import { FieldInfoItem, DataItem } from '../../src/types/transform';
import { DataRole, DataType } from '../../src/utils/enum';

describe('Field Utilities', () => {
  // Sample field info for testing
  const sampleFieldInfo: FieldInfoItem[] = [
    { fieldName: 'name', type: DataType.STRING, role: DataRole.DIMENSION },
    { fieldName: 'age', type: DataType.INT, role: DataRole.MEASURE },
    { fieldName: 'salary', type: DataType.FLOAT, role: DataRole.MEASURE },
    { fieldName: 'birthDate', type: DataType.DATE, role: DataRole.DIMENSION },
    { fieldName: 'department', type: DataType.STRING, role: DataRole.DIMENSION }
  ];

  describe('getFieldsByDataType', () => {
    it('should return the first field matching any of the provided data types', () => {
      const result = getFieldsByDataType(sampleFieldInfo, [DataType.STRING]);
      expect(result).toEqual({ fieldName: 'name', type: DataType.STRING, role: DataRole.DIMENSION });
    });

    it('should return the first field matching multiple data types', () => {
      const result = getFieldsByDataType(sampleFieldInfo, [DataType.INT, DataType.FLOAT]);
      expect(result).toEqual({ fieldName: 'age', type: DataType.INT, role: DataRole.MEASURE });
    });

    it('should return undefined when no fields match the data types', () => {
      const result = getFieldsByDataType(sampleFieldInfo, ['unknown_type']);
      expect(result).toBeUndefined();
    });

    it('should handle empty fields array', () => {
      const result = getFieldsByDataType([], [DataType.STRING]);
      expect(result).toBeUndefined();
    });

    it('should handle null/undefined fields array', () => {
      const result = getFieldsByDataType(null as any, [DataType.STRING]);
      expect(result).toBeUndefined();
    });

    it('should handle empty data type list', () => {
      const result = getFieldsByDataType(sampleFieldInfo, []);
      expect(result).toBeUndefined();
    });
  });

  describe('getAllFieldsByDataType', () => {
    it('should return all fields matching the provided data types', () => {
      const result = getAllFieldsByDataType(sampleFieldInfo, [DataType.STRING]);
      expect(result).toHaveLength(2);
      expect(result[0].fieldName).toBe('name');
      expect(result[1].fieldName).toBe('department');
    });

    it('should return all numeric fields', () => {
      const result = getAllFieldsByDataType(sampleFieldInfo, [DataType.INT, DataType.FLOAT]);
      expect(result).toHaveLength(2);
      expect(result[0].fieldName).toBe('age');
      expect(result[1].fieldName).toBe('salary');
    });

    it('should return empty array when no fields match', () => {
      const result = getAllFieldsByDataType(sampleFieldInfo, ['unknown_type']);
      expect(result).toEqual([]);
    });

    it('should handle empty fields array', () => {
      const result = getAllFieldsByDataType([], [DataType.STRING]);
      expect(result).toEqual([]);
    });

    it('should handle null/undefined fields array', () => {
      const result = getAllFieldsByDataType(null as any, [DataType.STRING]);
      expect(result).toEqual([]);
    });
  });

  describe('getFieldsByRoleType', () => {
    it('should return the first field with specified role type', () => {
      const result = getFieldsByRoleType(sampleFieldInfo, DataRole.MEASURE);
      expect(result).toEqual({ fieldName: 'age', type: DataType.INT, role: DataRole.MEASURE });
    });

    it('should return the first dimension field', () => {
      const result = getFieldsByRoleType(sampleFieldInfo, DataRole.DIMENSION);
      expect(result).toEqual({ fieldName: 'name', type: DataType.STRING, role: DataRole.DIMENSION });
    });

    it('should return undefined when no fields match the role', () => {
      const fieldsWithoutMeasure = [{ fieldName: 'name', type: DataType.STRING, role: DataRole.DIMENSION }];
      const result = getFieldsByRoleType(fieldsWithoutMeasure, DataRole.MEASURE);
      expect(result).toBeUndefined();
    });

    it('should handle empty fields array', () => {
      const result = getFieldsByRoleType([], DataRole.DIMENSION);
      expect(result).toBeUndefined();
    });

    it('should handle null/undefined fields array', () => {
      const result = getFieldsByRoleType(null as any, DataRole.DIMENSION);
      expect(result).toBeUndefined();
    });
  });

  describe('getFieldIdInCell', () => {
    it('should return the field itself when it is a string', () => {
      const result = getFieldIdInCell('fieldName');
      expect(result).toBe('fieldName');
    });

    it('should return the first element when field is an array', () => {
      const result = getFieldIdInCell(['field1', 'field2', 'field3']);
      expect(result).toBe('field1');
    });

    it('should handle empty array', () => {
      const result = getFieldIdInCell([]);
      expect(result).toBeUndefined();
    });

    it('should handle null/undefined input', () => {
      const result = getFieldIdInCell(null);
      expect(result).toBe(null);
    });

    it('should handle non-string, non-array input', () => {
      const result = getFieldIdInCell(123);
      expect(result).toBe(123);
    });
  });

  describe('sampleSize', () => {
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('should return empty array when input is null', () => {
      const result = sampleSize(null, 5);
      expect(result).toEqual([]);
    });

    it('should return empty array when n is less than 1', () => {
      const result = sampleSize(testArray, 0);
      expect(result).toEqual([]);
    });

    it('should return empty array when n is negative', () => {
      const result = sampleSize(testArray, -1);
      expect(result).toEqual([]);
    });

    it('should return entire array when n is greater than array length', () => {
      const result = sampleSize([1, 2, 3], 5);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should return correct number of samples', () => {
      const result = sampleSize(testArray, 3);
      expect(result).toHaveLength(3);
      result.forEach(item => {
        expect(testArray).toContain(item);
      });
    });

    it('should return unique samples (no duplicates)', () => {
      const result = sampleSize(testArray, 5);
      const uniqueResult = [...new Set(result)];
      expect(result).toHaveLength(uniqueResult.length);
    });

    it('should handle edge case with array length 1', () => {
      const result = sampleSize([42], 1);
      expect(result).toEqual([42]);
    });

    it('should handle empty array', () => {
      const result = sampleSize([], 5);
      expect(result).toEqual([]);
    });
  });

  describe('detectFieldType', () => {
    it('should detect integer type correctly', () => {
      const dataset: DataItem[] = [{ value: 1 }, { value: 2 }, { value: 100 }];
      const result = detectFieldType(dataset, 'value');
      expect(result).toEqual({
        fieldName: 'value',
        type: DataType.INT,
        role: DataRole.MEASURE
      });
    });

    it('should detect float type correctly', () => {
      const dataset: DataItem[] = [{ value: 1.5 }, { value: 2.7 }, { value: 100.99 }];
      const result = detectFieldType(dataset, 'value');
      expect(result).toEqual({
        fieldName: 'value',
        type: DataType.FLOAT,
        role: DataRole.MEASURE
      });
    });

    it('should detect string type correctly', () => {
      const dataset: DataItem[] = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      const result = detectFieldType(dataset, 'name');
      expect(result).toEqual({
        fieldName: 'name',
        type: DataType.STRING,
        role: DataRole.DIMENSION
      });
    });

    it('should detect date type from predefined column names', () => {
      const dataset: DataItem[] = [{ 年份: '2023' }, { 年份: '2024' }];
      const result = detectFieldType(dataset, '年份');
      expect(result).toEqual({
        fieldName: '年份',
        type: DataType.DATE,
        role: DataRole.DIMENSION
      });
    });

    it('should detect date type from date column name', () => {
      const dataset: DataItem[] = [{ date: '2023-01-01' }, { date: '2023-02-01' }];
      const result = detectFieldType(dataset, 'date');
      expect(result).toEqual({
        fieldName: 'date',
        type: DataType.DATE,
        role: DataRole.DIMENSION
      });
    });

    it('should convert int to float when mixed numeric types found', () => {
      const dataset: DataItem[] = [{ value: 1 }, { value: 2.5 }, { value: 3 }];
      const result = detectFieldType(dataset, 'value');
      expect(result.type).toBe(DataType.FLOAT);
    });

    it('should convert numeric to string when non-numeric value found', () => {
      const dataset: DataItem[] = [{ value: 1 }, { value: 2 }, { value: 'not a number' }];
      const result = detectFieldType(dataset, 'value');
      expect(result.type).toBe(DataType.STRING);
    });

    it('should convert date to string when non-date value found', () => {
      const dataset: DataItem[] = [{ date: '2023-01-01' }, { date: '2023-02-01' }, { date: 'not a date' }];
      const result = detectFieldType(dataset, 'date');
      expect(result.type).toBe(DataType.STRING);
    });

    it('should handle empty dataset', () => {
      const result = detectFieldType([], 'anyField');
      expect(result.fieldName).toBe('anyField');
      expect(result.type).toBeUndefined();
    });

    it('should handle dataset with missing column values', () => {
      const dataset: DataItem[] = [
        { value: 1 },
        { otherField: 'test' }, // missing 'value' field
        { value: 3 }
      ];
      const result = detectFieldType(dataset, 'value');
      expect(result.fieldName).toBe('value');
    });

    it('should handle mixed data types and choose most restrictive', () => {
      const dataset: DataItem[] = [
        { mixed: '123' }, // string that looks like number
        { mixed: 456 }, // actual number
        { mixed: 'text' } // clear string
      ];
      const result = detectFieldType(dataset, 'mixed');
      expect(result.type).toBe(DataType.STRING);
    });
  });

  describe('getFieldInfo', () => {
    it('should return field info for all columns', () => {
      const dataset: DataItem[] = [
        { name: 'Alice', age: 30, salary: 50000.5 },
        { name: 'Bob', age: 25, salary: 45000.0 }
      ];
      const columns = ['name', 'age', 'salary'];
      const result = getFieldInfo(dataset, columns);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        fieldName: 'name',
        type: DataType.STRING,
        role: DataRole.DIMENSION
      });
      expect(result[1]).toEqual({
        fieldName: 'age',
        type: DataType.INT,
        role: DataRole.MEASURE
      });
      expect(result[2]).toEqual({
        fieldName: 'salary',
        type: DataType.FLOAT,
        role: DataRole.MEASURE
      });
    });

    it('should sample large datasets', () => {
      // Create a large dataset (>1000 rows)
      const largeDataset: DataItem[] = Array.from({ length: 1500 }, (_, i) => ({
        id: i,
        value: Math.random() * 100
      }));

      const result = getFieldInfo(largeDataset, ['id', 'value']);
      expect(result).toHaveLength(2);
      expect(result[0].fieldName).toBe('id');
      expect(result[1].fieldName).toBe('value');
    });

    it('should handle empty columns array', () => {
      const dataset: DataItem[] = [{ name: 'test' }];
      const result = getFieldInfo(dataset, []);
      expect(result).toEqual([]);
    });

    it('should handle empty dataset', () => {
      const result = getFieldInfo([], ['name', 'age']);
      expect(result).toHaveLength(2);
      expect(result[0].fieldName).toBe('name');
      expect(result[1].fieldName).toBe('age');
    });
  });

  describe('getFieldInfoFromDataset', () => {
    it('should extract all columns from dataset and return field info', () => {
      const dataset: DataItem[] = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25, department: 'Engineering' },
        { salary: 50000 } // different columns in different rows
      ];

      const result = getFieldInfoFromDataset(dataset);
      expect(result).toHaveLength(4);

      const fieldNames = result.map(f => f.fieldName);
      expect(fieldNames).toContain('name');
      expect(fieldNames).toContain('age');
      expect(fieldNames).toContain('department');
      expect(fieldNames).toContain('salary');
    });

    it('should handle empty dataset', () => {
      const result = getFieldInfoFromDataset([]);
      expect(result).toEqual([]);
    });

    it('should handle null/undefined dataset', () => {
      const result1 = getFieldInfoFromDataset(null as any);
      expect(result1).toEqual([]);

      const result2 = getFieldInfoFromDataset(undefined as any);
      expect(result2).toEqual([]);
    });

    it('should handle dataset with empty objects', () => {
      const dataset: DataItem[] = [{}, {}, {}];
      const result = getFieldInfoFromDataset(dataset);
      expect(result).toEqual([]);
    });

    it('should handle dataset with consistent schema', () => {
      const dataset: DataItem[] = [
        { id: 1, name: 'Alice', active: 'true' },
        { id: 2, name: 'Bob', active: 'false' },
        { id: 3, name: 'Charlie', active: 'true' }
      ];

      const result = getFieldInfoFromDataset(dataset);
      expect(result).toHaveLength(3);

      const idField = result.find(f => f.fieldName === 'id');
      const nameField = result.find(f => f.fieldName === 'name');
      const activeField = result.find(f => f.fieldName === 'active');

      expect(idField?.type).toBe(DataType.INT);
      expect(nameField?.type).toBe(DataType.STRING);
      expect(activeField?.type).toBe(DataType.STRING); // string values
    });
  });

  describe('getRemainedFields', () => {
    it('should return fields not used in cell', () => {
      const cell = { x: 'name', y: 'age' };
      const result = getRemainedFields(cell, sampleFieldInfo);

      expect(result).toHaveLength(3);
      const remainedNames = result.map(f => f.fieldName);
      expect(remainedNames).toContain('salary');
      expect(remainedNames).toContain('birthDate');
      expect(remainedNames).toContain('department');
      expect(remainedNames).not.toContain('name');
      expect(remainedNames).not.toContain('age');
    });

    it('should handle array values in cell', () => {
      const cell = { x: ['name', 'department'], y: 'age' };
      const result = getRemainedFields(cell, sampleFieldInfo);

      expect(result).toHaveLength(2);
      const remainedNames = result.map(f => f.fieldName);
      expect(remainedNames).toContain('salary');
      expect(remainedNames).toContain('birthDate');
      expect(remainedNames).not.toContain('name');
      expect(remainedNames).not.toContain('department');
      expect(remainedNames).not.toContain('age');
    });

    it('should return all fields when cell is empty', () => {
      const cell = {};
      const result = getRemainedFields(cell, sampleFieldInfo);
      expect(result).toEqual(sampleFieldInfo);
    });

    it('should handle cell with undefined/null values', () => {
      const cell = { x: 'name', y: null as any, z: undefined as any };
      const result = getRemainedFields(cell, sampleFieldInfo);

      const remainedNames = result.map(f => f.fieldName);
      expect(remainedNames).not.toContain('name');
      expect(remainedNames).toContain('age');
      expect(remainedNames).toContain('salary');
    });

    it('should handle empty fieldInfo', () => {
      const cell = { x: 'name', y: 'age' };
      const result = getRemainedFields(cell, []);
      expect(result).toEqual([]);
    });

    it('should handle cell with non-existent field names', () => {
      const cell = { x: 'nonExistentField', y: 'anotherNonExistentField' };
      const result = getRemainedFields(cell, sampleFieldInfo);

      // Should return all fields since none are actually used
      expect(result).toEqual(sampleFieldInfo);
    });

    it('should handle complex nested array structures', () => {
      const cell = {
        x: ['name', 'department'],
        y: ['age'],
        color: 'salary'
      };
      const result = getRemainedFields(cell, sampleFieldInfo);

      expect(result).toHaveLength(1);
      expect(result[0].fieldName).toBe('birthDate');
    });

    it('should handle mixed array and string values', () => {
      const cell = {
        dimensions: ['name', 'department'],
        measure: 'age',
        other: ['salary']
      };
      const result = getRemainedFields(cell, sampleFieldInfo);

      expect(result).toHaveLength(1);
      expect(result[0].fieldName).toBe('birthDate');
    });
  });
});
