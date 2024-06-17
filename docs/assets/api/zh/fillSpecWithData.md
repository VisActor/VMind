
# fillSpecWithData

## 接口描述：
fillSpecWithData用于向spec模板中填入数据，以生成一个完整的spec。根据图表类型的不同，将采取不同的填充策略。

## 接口参数：

```typescript
fillSpecWithData(
  spec: any,
  dataset: Array<Record<string, any>>,
  totalTime?: number
  )
```

- spec (any): spec模板，包含除data之外的所有属性。可通过[generateChart](./generateChart)生成
- dataset (Array): 图表中使用的数据集，会被填充到spec模板中。
- totalTime (number): 可选项，图表动画时长（ms）

## 返回值：
返回填充后的spec，可直接用于图表渲染

## 使用示例：
某些情况下我们可能在仅有数据字段，没有具体的数据集的情况下生成图表（例如在查询前根据数据集中的字段生成一个图表，再根据生成的图表类型、图表中的字段完成相关查询），此时可在调用generateChart方法时不传入dataset，生成spec模板，随后再调用fillSpecWithData方法，获得最终的spec用于图表渲染：

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)

const userPrompt = '展示不同地区商品销售额';
const fieldInfo = [
    {
        "fieldName": "商品名称",
        "type": "string",
        "role": "dimension",
        "domain": [
            "可乐",
            "雪碧",
            "芬达",
            "醒目"
        ]
    },
    {
        "fieldName": "region",
        "type": "string",
        "role": "dimension",
        "domain": [
            "south",
            "east",
            "west",
            "north"
        ]
    },
    {
        "fieldName": "销售额",
        "type": "int",
        "role": "measure",
        "domain": [
            28,
            2350
        ]
    }
]
//不传入dataset，生成spec模板
const { spec } = await vmind.generateChart(userPrompt, fieldInfo);

//向模板中填入数据
const dataset = [
    {
        "商品名称": "Coke",
        "region": "south",
        "销售额": 2350
    },
    {
        "商品名称": "Coke",
        "region": "east",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "west",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "north",
        "销售额": 1027
    }
]

const spec = vmind.fillSpecWithData(spec, dataset)
```

## 相关教程
- [图表智能生成](../guide/Basic_Tutorial/Chart_Generation)
