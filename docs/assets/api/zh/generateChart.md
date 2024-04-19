
# generateChart

## 接口描述：
generateChart函数用于图表智能生成。

## 支持模型：
- GPT-3.5
- GPT-4
- [skylark2-pro](https://www.volcengine.com/product/yunque)
- [chart-advisor](../guide/Basic_Tutorial/Chart_Advisor)

## 接口参数：

```typescript
interface GenerateChartParams {
  userPrompt: string;
  fieldInfo: Array<{
    fieldName: string;
    type: string;
    role: string;
  }>;
  dataset: Array<Record<string, any>>;
  enableDataQuery?: boolean;
  colorPalette?: Array<string>;
  animationDuration?: number;
}
```

- userPrompt (string): 用户的可视化意图（你想用图表展示什么信息）
- fieldInfo (Array): 数据集中字段的信息，包括字段名称，类型等
- dataset (Array): 用于图表的数据集
- enableDataQuery (boolean, 可选): 决定是否在图表生成过程中开启数据聚合
- colorPalette (Array<string>, 可选): 用于设置图表的调色板
- animationDuration (number, 可选): 用于设置图表动画的播放持续时间

## 返回值类型：

```typescript
interface GenerateChartResult {
  spec: Record<string, any>;
  time: {
    totalTime : number;
    frameArr: number[];
  };
}
```

- spec (Object): 生成的VChart图表spec
- time (number): 图表动画的时长信息，可用于导出GIF和视频

## 使用示例：

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset, true, colorPalette);
```

## 注意事项：

- generateChart方法会将userPrompt和fieldInfo传递给大语言模型用于生成图表，但是dataset中的详细数据并不会被传递。
- 在生成图表的过程中，VMind首先会利用大语言模型，根据userPrompt和fieldInfo，推荐一个适合的图表类型。然后，它会将fieldInfo中的字段映射到图表的x轴、y轴、颜色、尺寸等视觉通道上。
- VMind默认会为生成的图表添加入场动画，因此它还会返回图表动画的时长time。如果你想关闭图表动画，可以将spec.animation设为false。
- 当设定模型类型为chart-advisor时，将不需调用大型语言模型生成图表，产生的结果将包括多种图表，详情可参见[基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)。

## 相关教程
- [图表智能生成](../guide/Basic_Tutorial/Chart_Generation)
- [基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)
