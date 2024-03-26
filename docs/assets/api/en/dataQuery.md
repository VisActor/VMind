
# dataQuery

## Interface Description:
The dataQuery function is a powerful data aggregation tool. It takes three parameters: userPrompt, fieldInfo, and dataset. VMind will write SQL statements according to the user's display intent and execute the query on the dataset. The query results will be stored in the dataset property of the function return value. At the same time, the fields in the query results may change, and the updated field information will also be stored in the fieldInfo property of the return result.

## Supported Models:
- GPT-3.5
- GPT-4
- [skylark2-pro](https://www.volcengine.com/product/yunque)

## Interface Parameters:

- userPrompt: string
The user's display intent, such as "show the sales of each product".

- fieldInfo: Array<{fieldName: string, type: string, role: string}>
Information about the dataset fields, including field name, type, and role.

- dataset: Array<{[key: string]: any}>
The original dataset, which is an array of objects, each object represents a piece of data.

## Return Value Type:

- fieldInfo: Array<{fieldName: string, type: string, role: string}>
Updated field information.

- dataset: Array<{[key: string]: any}>
Query result dataset.

## Usage Example:

```ts
import VMind from '@visactor/vmind'

const sourceDataset = [
{
"Product name": "Coke",
"Sales": 2350
},
{
"Product name": "Sprite",
"total_sales": 1056
},
{
"Product name": "Fanta",
"total_sales": 4778
},
{
"Product name": "Mirinda",
"total_sales": 3336
}
// ...other data
]

const sourceFieldInfo = [
{
"fieldName": "Product name",
"type": "string",
"role": "dimension"
},
{
"fieldName": "Sales",
"type": "int",
"role": "measure"
}
]

const userPrompt=`Show the sales of each product`
const vmind = new VMind(options)

// Call dataQuery with userPrompt, sourceFieldInfo, and sourceDataset to perform data aggregation
const { fieldInfo, dataset } = vmind.dataQuery(userPrompt, sourceFieldInfo, sourceDataset);
```

## Notes:

- The dataQuery method will pass userPrompt and fieldInfo to the large model to generate SQL, but the detailed data in the dataset will not be passed.
- During the execution of dataQuery, the currently supported SQL keywords are: SELECT, GROUP BY, WHERE, HAVING, ORDER BY, LIMIT. The currently supported aggregation functions are: MAX(), MIN(), SUM(), COUNT(), AVG(), but complex SQL operations such as subqueries, JOIN, conditional statements, etc. are not supported.

## Related Tutorials
[Data Aggregation](../guide/Basic_Tutorial/Data_Aggregation)
