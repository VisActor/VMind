import { isValidDataTable } from '../../src/utils/data';
import { DataTable } from '../../src/types/transform';

describe('Data Utilities', () => {
  describe('isValidDataTable', () => {
    it('should return true for valid data table with objects', () => {
      const validDataTable: DataTable = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ];

      const result = isValidDataTable(validDataTable);
      expect(result).toBe(true);
    });

    it('should return true for valid data table with different object structures', () => {
      const validDataTable: DataTable = [
        { id: 1, value: 100, category: 'A' },
        { id: 2, value: 200, category: 'B' },
        { id: 3, value: 150, category: 'C' }
      ];

      const result = isValidDataTable(validDataTable);
      expect(result).toBe(true);
    });

    it('should return true for data table with single item', () => {
      const singleItemTable: DataTable = [{ name: 'Single Item', value: 42 }];

      const result = isValidDataTable(singleItemTable);
      expect(result).toBe(true);
    });

    it('should return true for data table with mixed data types', () => {
      const mixedDataTable: DataTable = [
        { name: 'Alice', age: 30, active: 'true', score: 95.5 },
        { name: 'Bob', age: 25, active: 'false', score: 87.2 }
      ];

      const result = isValidDataTable(mixedDataTable);
      expect(result).toBe(true);
    });

    it('should return true for data table with different properties in each row', () => {
      const unevenDataTable: DataTable = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', department: 'Engineering' },
        { salary: 50000, position: 'Developer' }
      ];

      const result = isValidDataTable(unevenDataTable);
      expect(result).toBe(true);
    });

    it('should return false for empty array', () => {
      const emptyArray: DataTable = [];

      const result = isValidDataTable(emptyArray);
      expect(result).toBe(false);
    });

    it('should return false for null input', () => {
      const result = isValidDataTable(null);
      expect(result).toBe(false);
    });

    it('should return false for undefined input', () => {
      const result = isValidDataTable(undefined);
      expect(result).toBe(false);
    });

    it('should return false for undefined input (explicit)', () => {
      const undefinedDataTable: DataTable | undefined = undefined;

      const result = isValidDataTable(undefinedDataTable);
      expect(result).toBe(false);
    });

    it('should return false for non-array input (string)', () => {
      const stringInput = 'not an array' as any;

      const result = isValidDataTable(stringInput);
      expect(result).toBe(false);
    });

    it('should return false for non-array input (number)', () => {
      const numberInput = 123 as any;

      const result = isValidDataTable(numberInput);
      expect(result).toBe(false);
    });

    it('should return false for non-array input (object)', () => {
      const objectInput = { name: 'Alice', age: 30 } as any;

      const result = isValidDataTable(objectInput);
      expect(result).toBe(false);
    });

    it('should return false for non-array input (boolean)', () => {
      const booleanInput = true as any;

      const result = isValidDataTable(booleanInput);
      expect(result).toBe(false);
    });

    it('should handle data table with empty objects', () => {
      const emptyObjectsTable: DataTable = [{}, {}, {}];

      const result = isValidDataTable(emptyObjectsTable);
      expect(result).toBe(true); // Array is not empty, so it's valid
    });

    it('should handle data table with nested objects', () => {
      const nestedDataTable: DataTable = [
        {
          name: 'Alice',
          details: { age: 30, city: 'New York' } as any
        },
        {
          name: 'Bob',
          details: { age: 25, city: 'San Francisco' } as any
        }
      ];

      const result = isValidDataTable(nestedDataTable);
      expect(result).toBe(true);
    });

    it('should handle data table with array values', () => {
      const arrayValueTable: DataTable = [
        {
          name: 'Alice',
          hobbies: ['reading', 'swimming'] as any
        },
        {
          name: 'Bob',
          hobbies: ['coding', 'gaming'] as any
        }
      ];

      const result = isValidDataTable(arrayValueTable);
      expect(result).toBe(true);
    });

    it('should handle data table with null values in properties', () => {
      const nullValueTable: DataTable = [
        { name: 'Alice', age: 30, department: null },
        { name: 'Bob', age: null, department: 'Engineering' }
      ];

      const result = isValidDataTable(nullValueTable);
      expect(result).toBe(true);
    });

    it('should handle data table with undefined values in properties', () => {
      const undefinedValueTable: DataTable = [
        { name: 'Alice', age: 30, department: undefined },
        { name: 'Bob', age: undefined, department: 'Engineering' }
      ];

      const result = isValidDataTable(undefinedValueTable);
      expect(result).toBe(true);
    });

    it('should handle edge case with very large data table', () => {
      const largeDataTable: DataTable = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        category: `Category_${i % 10}`
      }));

      const result = isValidDataTable(largeDataTable);
      expect(result).toBe(true);
    });

    it('should handle data table with numeric string keys', () => {
      const numericKeyTable: DataTable = [
        { '0': 'first', '1': 'second', '2': 'third' },
        { '0': 'uno', '1': 'dos', '2': 'tres' }
      ];

      const result = isValidDataTable(numericKeyTable);
      expect(result).toBe(true);
    });

    it('should handle data table with special characters in keys', () => {
      const specialCharTable: DataTable = [
        { 'user-name': 'Alice', user_age: 30, 'user.email': 'alice@example.com' },
        { 'user-name': 'Bob', user_age: 25, 'user.email': 'bob@example.com' }
      ];

      const result = isValidDataTable(specialCharTable);
      expect(result).toBe(true);
    });

    it('should handle data table with unicode characters', () => {
      const unicodeTable: DataTable = [
        { 名字: 'Alice', 年龄: 30, 城市: '北京' },
        { 名字: 'Bob', 年龄: 25, 城市: '上海' }
      ];

      const result = isValidDataTable(unicodeTable);
      expect(result).toBe(true);
    });

    it('should handle data table with zero values', () => {
      const zeroValueTable: DataTable = [
        { name: 'Zero Test', count: 0, percentage: 0.0 },
        { name: 'Another Zero', count: 0, percentage: 0 }
      ];

      const result = isValidDataTable(zeroValueTable);
      expect(result).toBe(true);
    });

    it('should handle data table with negative values', () => {
      const negativeValueTable: DataTable = [
        { name: 'Loss', profit: -100, change: -5.5 },
        { name: 'Gain', profit: 200, change: 3.2 }
      ];

      const result = isValidDataTable(negativeValueTable);
      expect(result).toBe(true);
    });

    it('should handle data table with very long strings', () => {
      const longString = 'a'.repeat(10000);
      const longStringTable: DataTable = [
        { id: 1, description: longString },
        { id: 2, description: 'short' }
      ];

      const result = isValidDataTable(longStringTable);
      expect(result).toBe(true);
    });

    // Edge cases for function parameter handling
    it('should handle function called without arguments', () => {
      const result = isValidDataTable();
      expect(result).toBe(false);
    });

    it('should handle function called with multiple arguments (only first should be used)', () => {
      const validTable: DataTable = [{ name: 'Alice' }];
      const invalidTable: any = null;

      // TypeScript would prevent this, but testing runtime behavior
      const result = (isValidDataTable as any)(validTable, invalidTable, 'extra');
      expect(result).toBe(true);
    });
  });
});
