
# parseCSVDataWithLLM

## Interface Description

The parseCSVDataWithLLM interface is used to pass the first 5 rows of CSV data to the large language model, combined with the user's chart display intention, to obtain the dataset and fieldInfo.

## Supported Models:
- GPT-3.5
- GPT-4

## Interface Parameters

```typescript
parseCSVDataWithLLM(csv: string, userPrompt: string): { fieldInfo: SimpleFieldInfo[], dataset: any[] }
```

- csv: A string type, representing the CSV string to be parsed.
- userPrompt: A string type, representing the user's chart display intention.

## Return Value Type

Returns an object containing two properties:

- fieldInfo: A SimpleFieldInfo[] type, representing the parsed field information, each element is an object, containing the following properties:
```bash
- fieldName: A string type, representing the field name.
- description: A string type, representing the field description, optional.
- type: A DataType type, representing the field type, can be "string", "int", "float", "date".
- role: A ROLE type, representing the field role, can be "dimension", "measure".
```


- dataset: An any[] type, representing the parsed dataset, each element is an object, the key is the field name, and the value is the corresponding data.

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

const userPrompt=`Show the sales of each product in different regions`
const vmind = new VMind(options)
const { fieldInfo, dataset } = vmind.parseCSVData(parseCSVDataWithLLM, userPrompt);
```

## Related Tutorials
[Data Format and Data Processing](../guide/Basic_Tutorial/Chart_Generation)
