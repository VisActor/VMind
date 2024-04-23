
# getFieldInfo

## Interface Description

The getFieldInfo interface is used to parse JSON-structured data to obtain field information (fieldInfo). FieldInfo includes field name, type, value range, and other information, and its structure is as follows:
```typescript
export type SimpleFieldInfo = {
fieldName: string;
description?: string;
type: 'int' | 'float' | 'string' | 'date';
role: 'dimension' | 'measure';
domain?: (string | number)[];
};
```

## Interface Parameters

```typescript
getFieldInfo(dataset: Record<string, number | string>[]): SimpleFieldInfo[]
```

- dataset: JSON-formatted data set, an array, each element of which is an object, with the key being the field name and the value being the corresponding data.

## Return Value Type

Returns an array of fieldInfo, representing the parsed field information. Each element is an object that contains the following attributes:
```bash
- fieldName: string type, representing the field name.
- description: string type, representing the field description, optional.
- type: DataType type, representing the field type, can be "string", "int", "float", "date".
- role: ROLE type, representing the field role, can be "dimension", "measure".
```

## Usage Example

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
const fieldInfo = vmind.getFieldInfo(dataset);
```

## Related Tutorials
[Data Format and Data Processing](../guide/Basic_Tutorial/Chart_Generation)
