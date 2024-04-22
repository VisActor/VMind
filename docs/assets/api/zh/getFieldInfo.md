# getFieldInfo

## 接口描述

getFieldInfo接口用于解析JSON结构的数据以获得其中的字段信息(fieldInfo)。fieldInfo包括字段名称、类型、值域等信息，其结构如下：
```typescript
export type SimpleFieldInfo = {
  fieldName: string;
  description?: string; //additional description of the field. This will help the model have a more comprehensive understanding of this field, improving the quality of chart generation.
  type: 'int' | 'float' | 'string' | 'date';
  role: 'dimension' | 'measure';
  domain?: (string | number)[];
};
```

## 接口参数

```typescript
getFieldInfo(dataset: Record<string, number | string>[]): SimpleFieldInfo[]
```

- dataset: JSON格式的数据集，是一个数组，每个元素是一个对象，键为字段名称，值为对应的数据。

## 返回值类型

返回一个fieldInfo数组，表示解析后的字段信息。每个元素是一个对象，包含以下属性：
```bash
- fieldName: string类型，表示字段名称。
- description: string类型，表示字段描述，可选。
- type: DataType类型，表示字段类型，可为"string"、"int"、"float"、"date"。
- role: ROLE类型，表示字段角色，可为"dimension"、"measure"。
```

## 使用示例

```typescript
import VMind from '@visactor/vmind'

const dataset=[
    {
        "Product name": "Coke",
        "region": "south",
        "Sales": 2350
    },
    {
        "Product name": "Coke",
        "region": "east",
        "Sales": 1027
    },
    {
        "Product name": "Coke",
        "region": "west",
        "Sales": 1027
    },
    {
        "Product name": "Coke",
        "region": "north",
        "Sales": 1027
    }
]

const vmind = new VMind(options)
const fieldInfo  = vmind.getFieldInfo(dataset);
```

## 相关教程
[数据格式与数据处理](../guide/Basic_Tutorial/Chart_Generation)
