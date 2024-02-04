# 数据格式与数据处理
在这篇教程中，我们将向你详细介绍VMind所支持的数据格式，并介绍如何使用VMind中的数据处理函数来获得这些数据。

# VMind数据格式
## 数据集dataset
在VMind中，大部分函数都需要输入一个数据集dataset。

在VMind的定义中，数据集dataset是一种表格数据（Tabular Data），其结构与VChart中[展平的数据](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Concepts/Data/Data_Types_and_Interface)相同，是由多条数据组成的数组。
以商品销售数据集为例，下面展示一个dataset的例子：
```json
// 商品销售数据集
[
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
    },
    {
        "Product name": "Sprite",
        "region": "south",
        "Sales": 215
    },
    {
        "Product name": "Sprite",
        "region": "east",
        "Sales": 654
    },
    {
        "Product name": "Sprite",
        "region": "west",
        "Sales": 159
    },
    {
        "Product name": "Sprite",
        "region": "north",
        "Sales": 28
    },
    {
        "Product name": "Fanta",
        "region": "south",
        "Sales": 345
    },
    {
        "Product name": "Fanta",
        "region": "east",
        "Sales": 654
    },
    {
        "Product name": "Fanta",
        "region": "west",
        "Sales": 2100
    },
    {
        "Product name": "Fanta",
        "region": "north",
        "Sales": 1679
    },
    {
        "Product name": "Mirinda",
        "region": "south",
        "Sales": 1476
    },
    {
        "Product name": "Mirinda",
        "region": "east",
        "Sales": 830
    },
    {
        "Product name": "Mirinda",
        "region": "west",
        "Sales": 532
    },
    {
        "Product name": "Mirinda",
        "region": "north",
        "Sales": 498
    }
]
```


⚠️注意： **为了让VMind中的图表生成、数据聚合等任务能够更好地执行，我们建议你对数据中的每一个字段使用具有一定语义的名称（例如Product name，region，Sales等）。我们不建议使用没有任何语义的字段名称（column1，column2或随机字符串等）。大语言模型将依赖字段名称中蕴含的语义信息在图表生成、数据聚合时对字段进行选择**
## 字段信息fieldInfo
在VMind中，你需要使用fieldInfo对象来描述数据集中的字段信息。fieldInfo描述了数据中每个字段的名称、类型、字段描述等信息。这些信息将被传给LLM用于图表生成、数据聚合等任务中。

下面是fieldInfo对象的类型定义：
```ts
export type SimpleFieldInfo = {
  fieldName: string;
  description?: string; //additional description of the field. This will help the model have a more comprehensive understanding of this field, improving the quality of chart generation.
  type: DataType;
  role: ROLE;
};
```
对于上一个章节中展示的数据集，其对应的fieldInfo如下：
```json
[
    {
        "fieldName": "Product name",
        "description": "Represents the name of the product, which is a string.",
        "type": "string",
        "role": "dimension"
    },
    {
        "fieldName": "region",
        "description": "Represents the region where the product is sold, which is a string.",
        "type": "string",
        "role": "dimension"
    },
    {
        "fieldName": "Sales",
        "description": "Represents the sales amount of the product, which is an integer.",
        "type": "int",
        "role": "measure"
    }
]
```


⚠️注意： **大语言模型将依赖fieldInfo中的字段描述description，在图表生成、数据聚合时对字段进行选择。fieldInfo中的description不是必选项，可以通过parseCSVDataWithLLM函数自动生成。**

# 数据处理函数
CSV数据是一种通用的、相对简单的文件格式，它以纯文本形式存储表格数据。在本章，我们将介绍如何使用VMind内置的数据处理函数，将csv数据转换为dataset和fieldInfo

## parseCSVData
VMind中的parseCSVData函数能够将csv字符串转换为dataset结构，并通过规则提取字段信息生成fieldInfo。在函数执行过程中，不会请求大语言模型。
以商品销售数据集为例，下面是parseCSVData函数的使用示例：
```ts
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

关于VMind实例的创建以及options中的详细配置，可以参见[创建VMind实例](./Create_VMind_Instance.md)


在这个例子中，该函数返回的dataset与上一章的商品销售数据集dataset相同，返回的fieldInfo如下：
```json
[
    {
        "fieldName": "Product name",
        "type": "string",
        "role": "dimension"
    },
    {
        "fieldName": "region",
        "type": "string",
        "role": "dimension"
    },
    {
        "fieldName": "Sales",
        "type": "int",
        "role": "measure"
    }
]
```
dataset和fieldInfo可直接用于VMind中的图表生成、数据聚合。

由于该函数未将数据传递给大语言模型，无法获得fieldInfo中的字段描述description。你也可以对其进行补充，以获得更好的图表生成效果。


## parseCSVDataWithLLM
VMind中的parseCSVDataWithLLM函数会将csv数据取前5行传递给大语言模型，结合用户的图表展示意图，获得dataset和fieldInfo。
使用示例如下：
```ts
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

const describe=`展示各商品在不同区域销售额`
const vmind = new VMind(options)
const { fieldInfo, dataset } = vmind.parseCSVData(parseCSVDataWithLLM, describe);
```

关于VMind实例的创建以及options中的详细配置，可以参见[创建VMind实例](./Create_VMind_Instance.md)


在这个例子中，返回的dataset和fieldInfo均与上一章的商品销售数据集dataset相同。
