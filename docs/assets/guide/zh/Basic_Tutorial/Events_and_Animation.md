# 事件和动画快速入门

在本节中，我们将学习如何使用`场景树`描述场景，以及如何在跨端场景中使用。

我们的场景十分简单，包含一个圆形的“鼓”，当“鼓”被点击的时候，会触发动画，发射许多小圆

## 创建画布

```TypeScript
import { creator, Global } from '@dp/canopus'

// 浏览器环境不需要设置env
Global.setEnv('tt');

// 创建一个stage，默认有一个初始图层（layer）
const stage = createStage({
    canvas: 'main',
    autoRender: true
  });
```

## 创建节点

```TypeScript
import { createCircle, createGroup } from '@dp/canopus';

const c1 = createCircle({
    radius: 60,
    x: 300,
    y: 300,
    fill: 'orange',
    stroke: '#ccc',
    lineWidth: 6,
    innerBorder: {
      distance: 10,
      lineWidth: 2,
      stroke: '#eee'
    }
 });

const group = createGroup({});

group.add(c1);

// 开启动画ticker，ticker需要手动开启，方便应用程序在合适的时候统一开始执行动画
defaultTicker.start();

stage.defaultLayer.add(group);
```

## 添加事件和动画

```TypeScript
// 监听click事件
c1.addEventListener('click', () => {
    c1.animate()
      .to({radius: 70}, 300, 'elasticOut')
      .to({radius: 60}, 600, 'linear');
    // 创建60个circle然后进行动画，完成后销毁
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dir = [Math.cos(angle), Math.sin(angle)];
      const c = createCircle({
        x: 300,
        y: 300,
        radius: 8,
        fill: colors[Math.floor(Math.random() * colors.length)]
      });
      group.add(c);
      c.animate({
        onEnd() {
          // 动画结束后从将节点场景树中删除
          group.removeChild(c);
        }
      }).to({ dx: dir[0] * 200, dy: dir[1] * 200, opacity: 0 }, 2000, 'cubicOut');
    }
  });
```