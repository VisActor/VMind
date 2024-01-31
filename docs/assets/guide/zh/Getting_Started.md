# 快速上手

在本教程中，我们将介绍如何使用 VRender 绘制一个圆形。VRender 是一款简单易用、跨平台、高性能的前端可视化渲染库。

## 获取 VRender

你可以通过以下几种方式获取 VRender。

### 使用 NPM 包

首先，你需要在项目根目录下使用以下命令安装 VRender：

```sh
# 使用 npm 安装
npm install @visactor/vrender

# 使用 yarn 安装
yarn add @visactor/vrender
```

### 使用 CDN

你还可以通过 CDN 获取构建好的 VRender 文件。将以下代码添加到 HTML 文件的 `<head>` 标签中：

```html
<script src="https://unpkg.com/@visactor/vrender/build/index.min.js"></script>
```

## 引入 VRender

### 通过 NPM 包引入

在 JavaScript 文件顶部使用 `import` 引入 VRender：

```js
import VRender from '@visactor/vrender';
```

### 使用 script 标签引入

通过直接在 HTML 文件中添加 `<script>` 标签，引入构建好的 vchart 文件：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <!-- 引入 vchart 文件 -->
    <script src="https://unpkg.com/@visactor/vrender/build/index.min.js"></script>
  </head>
</html>
```

## 绘制一个圆形

在绘图前我们可以为 VRender 准备一个具备高宽的 DOM 容器。

```html
<body>
  <!-- 为 vchart 准备一个具备大小（宽高）的 DOM，当然你也可以在 spec 配置中指定 -->
  <div id="main" style="width: 600px;height:400px;"></div>
</body>
```

接下来，我们基于这个Canvas创建一个 `Stage` 实例，创建一个圆形并添加到`Stage`中：

```ts
// 创建一个stage
const stage = createStage({
    canvas: 'main',
    autoRender: true // 开启自动渲染
});
// 创建一个circle图元
const circle = createCircle({
    radius: 60,
    x: 200,
    y: 200,
    fill: 'red',
});
// 添加到stage中
stage.defaultLayer.add(circle);
```

至此，你已经成功绘制出了一个红色的圆形！

```javascript
// 创建一个stage
const stage = createStage({
    canvas: 'main',
    autoRender: true // 开启自动渲染
});
// 创建一个circle图元
const circle = createCircle({
    radius: 60,
    x: 200,
    y: 200,
    fill: 'red',
});
// 监听点击事件，然后填充色变成绿色
circle.addEventListener('click', () => {
    circle.setAttribute('fill', 'green');
});
// 添加到stage中
stage.defaultLayer.add(circle);
```

希望这篇教程对你学习如何使用 VChart 有所帮助。现在，你可以尝试绘制不同类型的图表，并通过深入了解 VChart 的各种配置选项，定制出更加丰富多样的图表效果。勇敢开始你的 VChart 之旅吧！