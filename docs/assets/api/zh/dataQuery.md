# dataQuery

## 接口描述：
dataQuery函数是一个强大的数据聚合工具，它接收三个参数：用户展示意图userPrompt，数据集字段信息fieldInfo和原始数据集dataset。VMind会根据用户的展示意图，编写SQL语句并对dataset执行查询，查询结果会被储存在函数返回值的dataset属性中；同时，查询结果中的字段可能会发生变化，更新后的字段信息也会被储存在返回结果的fieldInfo属性中。

## 支持模型：
- GPT模型
- 豆包模型
- DeepSeek模型
- 其他任意模型

## 接口参数：
``` typescript
/**
  *
  * @param userPrompt(string) 用户的展示意图，例如“展示各商品销售额”。
  * @param dataset(DataTable) 原始数据集，是一个对象数组，每个对象代表一条数据。
  * @param fieldInfo(FieldInfo[]) 可选，数据集字段信息，包含字段名称、类型和角色。在不传入的情况下，VMind会根据dataset自动解析一份fieldInfo配置
  * @returns new FieldInfo && new DataSet after user's query
  */
```

## 返回值类型：
```typescript
{
  // 更新后的字段信息。
  fieldInfo: FieldInfo[];
  // 查询后的数据表
  dataTable: DataTable；
}
```

## 使用示例：

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
// ...其他数据
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

const userPrompt=`展示各商品销售额`
const vmind = new VMind(options)

//调用dataQuery传入userPrompt，sourceFieldInfo和sourceDataset，执行数据聚合
const { fieldInfo, dataset } = vmind.dataQuery(userPrompt, sourceDataset, sourceFieldInfo);
```

## 注意事项：

- dataQuery方法会将userPrompt和fieldInfo传递给大模型用于生成SQL，dataset中的明细数据并不会被传递。
- dataQuery执行过程中，目前支持的SQL关键词有：SELECT, GROUP BY, WHERE, HAVING, ORDER BY, LIMIT。目前支持的聚合函数有：MAX(), MIN(), SUM(), COUNT(), AVG()，但不支持子查询、JOIN、条件语句等复杂的SQL操作。

## 相关教程
[数据聚合](../guide/Basic_Tutorial/Data_Aggregation)
