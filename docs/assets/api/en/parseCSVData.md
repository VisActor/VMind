
# parseCSVData

## Interface Description

The parseCSVData interface is used to convert CSV strings into the dataset and field information required by VMind.

## Interface Parameters

```typescript
parseCSVData(csv: string): { fieldInfo: SimpleFieldInfo[], dataset: any[] }
```

- csv: A string type, representing the CSV string to be parsed.

## Return Value Type

Returns an object containing two properties:

- fieldInfo: Type of SimpleFieldInfo[], representing the parsed field information, each element is an object, containing the following properties:

```bash
- fieldName: string type, representing the field name.
- description: string type, representing the field description, optional.
- type: DataType type, representing the field type, can be "string", "int", "float", "date".
- role: ROLE type, representing the field role, can be "dimension", "measure".
```


- dataset: DataItem type, representing the parsed dataset, each element is an object, the key is the field name, and the value is the corresponding data:
```ts
type DataItem = Record<string, number | string>;
```

## Usage Example

```typescript
import VMind from '@visactor/vmind'
const csv=`Product name,region,Sales
Coke,south,2350
Coke,east,1027
Coke,west,1027
Coke,north,1027
Sprite,south,215
Sprite,east,654
Sprite,west,159
Sprite,north,28
Fanta,south,345
Fanta,east,654
Fanta,west,2100
Fanta,north,1679
Mirinda,south,1476
Mirinda,east,830
Mirinda,west,532
Mirinda,north,498`
const vmind = new VMind(options)
const { fieldInfo, dataset } = vmind.parseCSVData(csv);
```

## Related Tutorials
[Data Format and Data Processing](../guide/Basic_Tutorial/Chart_Generation)
