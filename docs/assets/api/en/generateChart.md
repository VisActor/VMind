
# generateChart

## Interface Description:
The generateChart function is used for intelligent chart generation.

## Supported Models:
- GPT-3.5
- GPT-4
- [skylark2-pro](https://www.volcengine.com/product/yunque)
- [chart-advisor](../guide/Basic_tutorial/Chart_Advisor)

## Interface Parameters:

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

- userPrompt (string): The visualization intent of the user (what information you want to display with the chart)
- fieldInfo (Array): Information about the fields in the dataset, including field names, types, etc.
- dataset (Array): The dataset used for the chart
- enableDataQuery (boolean, optional): Determines whether to enable data aggregation during chart generation
- colorPalette (Array<string>, optional): Used to set the color palette of the chart
- animationDuration (number, optional): Used to set the duration of the chart animation

## Return Value Type:

```typescript
interface GenerateChartResult {
spec: Record<string, any>;
time: {
totalTime : number;
frameArr: number[];
};
}
```

- spec (Object): The generated VChart chart spec
- time (number): Duration information of the chart animation, which can be used to export GIFs and videos

## Usage Example:

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset, true, colorPalette);
```

## Notes:

- The generateChart method will pass the userPrompt and fieldInfo to the large language model for chart generation, but the detailed data in the dataset will not be passed.
- In the process of generating the chart, VMind will first use the large language model, according to the userPrompt and fieldInfo, to recommend a suitable chart type. Then, it will map the fields in the fieldInfo to the x-axis, y-axis, color, size and other visual channels of the chart.
- VMind will add an entrance animation to the generated chart by default, so it will also return the duration of the chart animation time. If you want to turn off the chart animation, you can set spec.animation to false.
- When the model type is set to chart-advisor, it will not call a large language model to generate charts. The results generated will include multiple types of charts. For details, please refer to [Rule-based Chart Generation](../guide/Basic_Tutorial/Chart_Advisor).

## Related Tutorials
- [Intelligent Chart Generation](../guide/Basic_Tutorial/Chart_Generation)
- [Rule-based Chart Generation](../guide/Basic_Tutorial/Chart_Advisor)

