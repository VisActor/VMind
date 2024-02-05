# parseCSVData

## 接口描述

parseCSVData接口用于将CSV字符串转换为VMind所需的数据集（dataset）和字段信息（fieldInfo）。

## 接口参数

```typescript
parseCSVData(csv: string): { fieldInfo: SimpleFieldInfo[], dataset: any[] }
```

- csv: string类型，表示需要解析的CSV字符串。

## 返回值类型

返回一个对象，包含两个属性：

- fieldInfo: SimpleFieldInfo[]类型，表示解析后的字段信息，每个元素是一个对象，包含以下属性：

```bash
- fieldName: string类型，表示字段名称。
- description: string类型，表示字段描述，可选。
- type: DataType类型，表示字段类型，可为"string"、"int"、"float"、"date"。
- role: ROLE类型，表示字段角色，可为"dimension"、"measure"。
```


- dataset: DataItem类型，表示解析后的数据集，每个元素是一个对象，键为字段名称，值为对应的数据:
```ts
type DataItem = Record<string, number | string>;
```

## 使用示例

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

## 相关教程
[数据格式与数据处理](../guide/Basic_Tutorial/Chart_Generation)
