# 快速上手

@VisActor/VChart 提供从数据到展现的全流程解决方案，以“可视化叙事”及“智能化”为核心竞争力。大语言模型强大的生成能力为 VChart 提供了一个自然语言的交互接口，允许我们通过自然语言直接调用 VChart 的各项能力，简单、快速、高质量地完成图表生成与编辑。
@VisActor/VMind 是基于 VChart 和大语言模型的图表智能模块，提供图表智能推荐、智能配色、对话式图表编辑等能力，能够极大地降低 VChart 的使用门槛，提高用户创作数据可视化作品的效率。
在本教程中，我们将介绍如何使用 VMind 组件 生成一个简单的图表。

## 获取 VMind

### 使用 NPM 包

首先，你需要在项目根目录下使用以下命令安装 VMind

```sh
# 使用 npm 安装
npm install @visactor/vmind

# 使用 yarn 安装
yarn add @visactor/vmind
```

VMind 需要配合 VChart 一起使用。为了进行图表绘制，你还需要在项目中引入 VChart。具体教程详见 [快速上手](http://www.visactor.io/vchart/guide/tutorial_docs/Getting_Started)

## 引入 VMind

### 通过 NPM 包引入

在 JavaScript 文件顶部使用 `import` 引入 VMind

```js
import VMind from '@visactor/vmind';
```

## 初始化 VMind 实例

首先我们需要初始化一个 VMind 实例，并用它完成后续操作。VMind 目前支持所有主流模型，包括 OpenAI GPT系列，字节豆包系列以及 DeepSeek 等模型，只要提供对应的模型API接口，所有模型均可以直接调用。
使用以下代码初始化一个 VMind 实例：

```js
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  url, //指定你的大模型服务url。default is https://api.openai.com/v1/chat/completions
  model: Model.GPT4o, //指定你指定的模型
  headers: { //指定调用大模型服务时的header
    'api-key': apiKey //Your LLM API Key
  }
})
```

在初始化VMind实例时，你可以指定大模型服务的url，模型种类，自定义模型请求方法等参数。详细教程请前往[创建VMind实例](./Basic_Tutorial/Create_VMind_Instance)章节

## 图表智能生成模块

在传统的图表生成步骤中，为了制作一个完整的图表，你需要完成以下步骤：

1. 首先准备一份想要进行展示的数据
2. 指定一个图表类型（图表推荐）
3. 描述数据中的字段如何映射到图表的视觉通道上（字段映射）
4. 对各个元素进行样式修改，并设置图表色板（智能配色）

而使用 VMind 生成一张图表，你仅需要：

1. 提供一份想要展示的数据（csv 或JSON格式）
2. 描述你对图表的要求，例如想在图表中展示哪些信息，使用何种风格的配色等等

例如，我们想使用下面的商品销售额数据，展示不同区域各商品销售额：

| 商品名称 | region | 销售额 |
| -------- | ------ | ------ |
| 可乐     | south  | 2350   |
| 可乐     | east   | 1027   |
| 可乐     | west   | 1027   |
| 可乐     | north  | 1027   |
| 雪碧     | south  | 215    |
| 雪碧     | east   | 654    |
| 雪碧     | west   | 159    |
| 雪碧     | north  | 28     |
| 芬达     | south  | 345    |
| 芬达     | east   | 654    |
| 芬达     | west   | 2100   |
| 芬达     | north  | 1679   |
| 醒目     | south  | 1476   |
| 醒目     | east   | 830    |
| 醒目     | west   | 532    |
| 醒目     | north  | 498    |

为了在后续流程中使用csv或JSON格式的数据，需要调用数据处理方法，将CSV数据转换为JSON格式的数据集dataset，并获取字段信息fieldInfo，或者直接从JSON格式的数据中获取fieldInfo。VMind提供了基于规则的方法来获取这些信息。这些方法都不会把明细数据传给大模型。

我们可以调用parseCSVData，从CSV数据获取JSON格式的dataset和fieldInfo，用于图表智能生成和数据聚合：

```ts
const csvData = `商品名称,region,销售额
可乐,south,2350
可乐,east,1027
可乐,west,1027
可乐,north,1027
雪碧,south,215
雪碧,east,654
雪碧,west,159
雪碧,north,28
芬达,south,345
芬达,east,654
芬达,west,2100
芬达,north,1679
醒目,south,1476
醒目,east,830
醒目,west,532
醒目,north,498`;
//传入csv字符串，获得fieldInfo和dataset用于图表生成
const { fieldInfo, dataset } = vmind.parseCSVData(csvData);
```

如果你已经有了一份JSON格式的数据，我们也可以调用getFieldInfo方法，从数据中获取fieldInfo：
```ts
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
    },
    ...
]

const vmind = new VMind(options)
const fieldInfo  = vmind.getFieldInfo(dataset);
```

我们想要展示的内容为“各品牌汽车销量排行的变化”。调用generateChart方法，将数据和展示内容描述直接传递给VMind：
```typescript
const userPrompt='show me the changes in sales rankings of various car brand'
//调用图表生成接口，获得spec和图表动画时长
 const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

接下来，我们就可以使用 VChart 绘制生成的图表。
在绘图前我们需要为 VChart 准备一个具备高宽的 DOM 容器。

```html
<body>
  <!-- 为 vchart 准备一个具备大小（宽高）的 DOM，当然你也可以在 spec 配置中指定 -->
  <div id="chart" style="width: 600px;height:400px;"></div>
</body>
```

接下来，我们创建一个 `VChart` 实例，传入刚刚生成的 spec 和 DOM 容器的 ID：

```ts
// 创建 vchart 实例
const vchart = new VChart(spec, { dom: 'chart' });
// 绘制
vchart.renderSync();
```

生成的图表如下：

![柱状图](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/bar.gif)

我们还可对图表提更多的要求，例如：

```typescript
const userPrompt = '帮我展示不同区域各商品销售额，使用折线图，region做x轴';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

生成的图表如下：

![折线图](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/line.gif)

## 导出 GIF 和视频

VMind 支持将生成的图表导出为 GIF 格式的动画和视频，随时随地进行分享。
为了实现视频导出功能，你需要在项目中额外引入`VChart, FFMPEG, canvas`相关内容，并将其作为对象传入VMind。下面将展示如何获得图表 GIF 和视频的 ObjectURL：

首先安装VChart,FFMPEG以及canvas相关内容：
```bash
# 使用 npm 安装
npm install @visactor/vchart
npm install @visactor/vrender-core
npm install @ffmpeg/ffmpeg^0.11.6
npm install canvas^2.11.2
```
同时确保vrender-core版本与vchart依赖版本一致，如：`"@visactor/vchart": "1.12.7"`对应的版本应该为，`"@visactor/vrender-core": "0.20.7"`
具体使用如下：

```typescript
import VChart from "@visactor/vchart";
import { ManualTicker, defaultTimeline } from "@visactor/vrender-core";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg/dist/ffmpeg.min.js'
import { createCanvas } from "canvas";
import VMind from "@visactor/vmind";

// 初始化vmind和ffmpeg
const vmind = new VMind({});
const ffmpeg = createFFmpeg({
  log: true,
});
const loadFFmpeg = async () => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
};
// 确保在使用导出功能前已经加载了ffmpeg
await loadFFmpeg();
//导出视频
//传入图表spec，视频时长和视频化必要参数，返回ObjectURL
const videoSrc = await vmind.exportVideo(spec, time, {
      VChart,
      FFmpeg: ffmpeg,
      fetchFile,
      ManualTicker,
      defaultTimeline,
      createCanvas,
    });
//导出GIF图片
const gifSrc = await vmind.exportGIF(spec, time, {
      VChart,
      FFmpeg: ffmpeg,
      fetchFile,
      ManualTicker,
      defaultTimeline,
      createCanvas
    });
```

一旦获得图表的 ObjectURL，我们可以将其保存为文件。以保存视频文件为例：

```typescript
//创建dom元素，实现文件下载
const a = document.createElement('a');
a.href = videoSrc;
a.download = `${filename}.mp4`; //设置保存的文件名
a.dispatchEvent(new MouseEvent('click')); //保存文件
```

## 总结

本章介绍了如何安装并使用 VMind 进行图表生成，并演示了如何将生成的图表保存为 GIF 和视频。VMind 目前支持柱状图、饼图、折线图、散点图、词云、动态条形图，更多图表类型正在开发中。VMind 能够根据用户数据和展示意图，推荐合适的图表类型，并将字段映射到合适的视觉通道上，自动生成符合用户需求的色板，降低用户进行数据可视化的门槛，帮助您轻松完成数据叙事。
