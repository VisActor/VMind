import {
  findRequiredDimensionField,
  findRequiredMeasureField,
  formatXFields,
  formatSizeFields,
  data,
  color,
  discreteLegend,
  onlyUnique,
  oneByOneDelayFunc
} from '../../src/transformers/common';
import { GenerateChartInput } from '../../src/types/transform';
import { TWO_FIELD_DATA, THREE_FIELD_DATA, COLORS } from '../common';

describe('Common Transformers', () => {
  const fieldInfo = [
    { fieldName: 'name', role: 'dimension' as any },
    { fieldName: 'value', role: 'measure' as any },
    { fieldName: 'category', role: 'dimension' as any },
    { fieldName: 'amount', role: 'measure' as any },
    { fieldName: 'type', role: 'dimension' as any }
  ];

  describe('findRequiredDimensionField', () => {
    it('should return first available color field from supported names', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value', color: 'category' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredDimensionField(context, ['color', 'series']);
      expect(result).toBe('category');
    });

    it('should prioritize first supported field name', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value', color: 'category', series: 'type' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredDimensionField(context, ['series', 'color']);
      expect(result).toBe('type');
    });

    it('should find dimension field from remaining fields when no color field specified', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredDimensionField(context, ['color']);
      expect(result).toBe('category'); // First remaining dimension field
    });

    it('should return first remaining field if no dimension fields available', () => {
      const limitedFieldInfo = [
        { fieldName: 'name', role: 'measure' as any },
        { fieldName: 'value', role: 'measure' as any },
        { fieldName: 'extra', role: 'measure' as any }
      ];

      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo: limitedFieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredDimensionField(context, ['color']);
      expect(result).toBe('extra');
    });

    it('should return undefined when no fields available', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo: [
          { fieldName: 'name', role: 'dimension' as any },
          { fieldName: 'value', role: 'measure' as any }
        ],
        dataTable: [],
        spec: {}
      };

      const result = findRequiredDimensionField(context, ['color']);
      expect(result).toBeUndefined();
    });

    it('should handle empty fieldInfo', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo: [],
        dataTable: [],
        spec: {}
      };

      const result = findRequiredDimensionField(context, ['color']);
      expect(result).toBeUndefined();
    });
  });

  describe('findRequiredMeasureField', () => {
    it('should return first available measure field from supported names', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value', size: 'amount' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredMeasureField(context, ['size', 'radius']);
      expect(result).toBe('amount');
    });

    it('should handle array values in supported field names', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: ['value', 'amount'] },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredMeasureField(context, ['y']);
      expect(result).toBe('value');
    });

    it('should find measure field from remaining fields when no specific field provided', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredMeasureField(context, ['size']);
      expect(result).toBe('amount'); // Remaining measure field
    });

    it('should return first remaining field if no measure fields available', () => {
      const limitedFieldInfo = [
        { fieldName: 'name', role: 'dimension' as any },
        { fieldName: 'value', role: 'dimension' as any },
        { fieldName: 'extra', role: 'dimension' as any }
      ];

      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo: limitedFieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = findRequiredMeasureField(context, ['size']);
      expect(result).toBe('extra');
    });

    it('should return undefined when no remaining fields available', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo: [
          { fieldName: 'name', role: 'dimension' as any },
          { fieldName: 'value', role: 'measure' as any }
        ],
        dataTable: [],
        spec: {}
      };

      const result = findRequiredMeasureField(context, ['size']);
      expect(result).toBeUndefined();
    });
  });

  describe('formatXFields', () => {
    it('should assign x field from context when available', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = formatXFields(context);
      expect(result.cell.x).toBe('name');
    });

    it('should find dimension field when x field not provided', () => {
      const context: GenerateChartInput = {
        cell: { y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = formatXFields(context);
      expect(result.cell.x).toBeDefined(); // Should find first available dimension field
    });

    it('should keep original cell when no valid field found', () => {
      const context: GenerateChartInput = {
        cell: { y: 'value' },
        fieldInfo: [{ fieldName: 'value', role: 'measure' as any }],
        dataTable: [],
        spec: {}
      };

      const result = formatXFields(context);
      expect(result.cell.x).toBeUndefined();
    });
  });

  describe('formatSizeFields', () => {
    it('should add size field when size field is specified in supported names', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value', size: 'amount' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = formatSizeFields(context, ['size']);
      expect(result.cell.size).toBe('amount');
    });

    it('should find measure field from remaining fields when no size field provided', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = formatSizeFields(context, ['size']);
      expect(result.cell.size).toBe('amount'); // Remaining measure field
    });

    it('should return unchanged cell when no valid field found', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo: [
          { fieldName: 'name', role: 'dimension' as any },
          { fieldName: 'value', role: 'measure' as any }
        ],
        dataTable: [],
        spec: {}
      };

      const result = formatSizeFields(context, ['size']);
      expect(result.cell.size).toBeUndefined();
    });
  });

  describe('data function', () => {
    it('should assign dataTable to spec.data with correct structure when valid', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: TWO_FIELD_DATA,
        spec: {}
      };

      const result = data(context);
      expect(result.spec.data).toEqual({
        id: 'data',
        values: TWO_FIELD_DATA
      });
    });

    it('should handle invalid dataTable', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: null as any,
        spec: {}
      };

      const result = data(context);
      expect(result.spec.data).toEqual({
        id: 'data',
        values: []
      });
    });

    it('should handle undefined dataTable', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: undefined as any,
        spec: {}
      };

      const result = data(context);
      expect(result.spec.data).toEqual({
        id: 'data',
        values: []
      });
    });
  });

  describe('color function', () => {
    it('should not add color when chartTheme is provided', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        chartTheme: 'dark',
        spec: {}
      };

      const result = color(context);
      expect(result.spec.color).toBeUndefined();
    });

    it('should apply custom colors when provided', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff'];
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        colors: customColors,
        spec: {}
      };

      const result = color(context);
      expect(result.spec.color).toEqual(customColors);
    });

    it('should apply default color theme when no colors or chartTheme provided', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = color(context);
      expect(result.spec.color).toBeDefined();
      expect(Array.isArray(result.spec.color)).toBe(true);
    });

    it('should not apply colors when colors array is empty', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        colors: [],
        spec: {}
      };

      const result = color(context);
      expect(result.spec.color).toBeDefined();
      expect(Array.isArray(result.spec.color)).toBe(true);
    });
  });

  describe('discreteLegend function', () => {
    it('should add legend when seriesField is present and no existing legends', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value', color: 'category' },
        fieldInfo,
        dataTable: [],
        spec: { seriesField: 'category' }
      };

      const result = discreteLegend(context);
      expect(result.spec.legends).toBeDefined();
      expect(Array.isArray(result.spec.legends)).toBe(true);
      expect(result.spec.legends[0].orient).toBe('right');
    });

    it('should not add legend when no color field and no seriesField', () => {
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value' },
        fieldInfo,
        dataTable: [],
        spec: {}
      };

      const result = discreteLegend(context);
      expect(result.spec.legends).toBeUndefined();
    });

    it('should not modify existing legends configuration', () => {
      const existingLegends = [{ visible: false, orient: 'top' as const }];
      const context: GenerateChartInput = {
        cell: { x: 'name', y: 'value', color: 'category' },
        fieldInfo,
        dataTable: [],
        legends: existingLegends,
        spec: {
          seriesField: 'category'
        }
      };

      const result = discreteLegend(context);
      expect(result.spec.legends).toBe(existingLegends);
    });
  });

  describe('onlyUnique function', () => {
    it('should filter unique values', () => {
      const array = ['a', 'b', 'a', 'c', 'b', 'd'];
      const unique = array.filter(onlyUnique);
      expect(unique).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should work with numbers', () => {
      const array = [1, 2, 1, 3, 2, 4];
      const unique = array.filter(onlyUnique);
      expect(unique).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty array', () => {
      const array: any[] = [];
      const unique = array.filter(onlyUnique);
      expect(unique).toEqual([]);
    });

    it('should handle array with one element', () => {
      const array = ['single'];
      const unique = array.filter(onlyUnique);
      expect(unique).toEqual(['single']);
    });
  });

  describe('oneByOneDelayFunc function', () => {
    it('should create a delay function that calculates delay based on group index', () => {
      const delayFunc = oneByOneDelayFunc(1000);

      // Mock data with __CHARTSPACE_DEFAULT_DATA_INDEX property
      const mockDatum1 = { name: 'A', value: 10, __CHARTSPACE_DEFAULT_DATA_INDEX: 0 };
      const mockDatum2 = { name: 'B', value: 20, __CHARTSPACE_DEFAULT_DATA_INDEX: 10 };
      const mockDatum3 = { name: 'C', value: 30, __CHARTSPACE_DEFAULT_DATA_INDEX: 20 };

      expect(delayFunc(mockDatum1)).toBe(0); // 0 % 10 * 1000 = 0
      expect(delayFunc(mockDatum2)).toBe(0); // 10 % 10 * 1000 = 0
      expect(delayFunc(mockDatum3)).toBe(0); // 20 % 10 * 1000 = 0
    });

    it('should handle different group indices', () => {
      const delayFunc = oneByOneDelayFunc(500);

      const mockDatum1 = { name: 'A', __CHARTSPACE_DEFAULT_DATA_INDEX: 1 };
      const mockDatum2 = { name: 'B', __CHARTSPACE_DEFAULT_DATA_INDEX: 2 };
      const mockDatum3 = { name: 'C', __CHARTSPACE_DEFAULT_DATA_INDEX: 13 }; // 13 % 10 = 3

      expect(delayFunc(mockDatum1)).toBe(500); // 1 % 10 * 500 = 500
      expect(delayFunc(mockDatum2)).toBe(1000); // 2 % 10 * 500 = 1000
      expect(delayFunc(mockDatum3)).toBe(1500); // 3 % 10 * 500 = 1500
    });

    it('should handle zero delay', () => {
      const delayFunc = oneByOneDelayFunc(0);

      const mockDatum = { name: 'A', __CHARTSPACE_DEFAULT_DATA_INDEX: 3 };
      expect(delayFunc(mockDatum)).toBe(0);
    });

    it('should handle missing __CHARTSPACE_DEFAULT_DATA_INDEX', () => {
      const delayFunc = oneByOneDelayFunc(1000);

      const mockDatum = { name: 'A', value: 10 };
      // Should handle gracefully (may return NaN or 0)
      const result = delayFunc(mockDatum);
      expect(typeof result).toBe('number');
    });
  });
});
