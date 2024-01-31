# 动画

# 基本使用

## Graphic.Animate

graphic.animate创建一个动画，提供`onStart`,`onEnd`,`onFrame`等钩子

```TypeScript
graphic
    .animate({
          onStart: () => {
            console.log('开始');
          },
          onEnd: () => {
            console.log('结束');
          },
          onFrame: () => {
            console.log('某一帧');
          }
    })
    .to({ height: 200 }, 2000, 'quadIn')
    .to({ x: 600 }, 200, 'quadIn')
    .wait(200)
    .to({ y: 600 }, 200, 'backInOut')
    .to({ fillColor: 'green' }, 2000, 'quadIn');
```

## Animate.to

最通用的插值方法，从当前值插值到目标值

```TypeScript
graphic
    .animate()
    // 高度变化到200，耗时2000ms，插值函数是quadIn
    .to({ height: 200 }, 2000, 'quadIn')
```

## Animate.wait

等待时间

```TypeScript
graphic
    .animate()
    // 等待2000ms
    .wait(2000)
```

## Animate.from

最通用的插值方法，从目标值插值到当前值，和to的效果相反

```TypeScript
graphic
    .animate()
    // 高度从200插值到当前值，耗时2000ms，插值函数是quadIn
    .from({ height: 200 }, 2000, 'quadIn')
```

## Animate.reverse

反向执行

```TypeScript
graphic
    .animate()
    // 高度从200插值到当前值，耗时2000ms，插值函数是quadIn
    .from({ height: 200 }, 2000, 'quadIn')
    // 反向执行，将from变成to的效果
    .reverse();
```

## Animate.loop

循环

```TypeScript
graphic
    .animate()
    .to({ height: 200 }, 2000, 'quadIn')
    // 再走count次，一共走count+1次
    .loop(count);
```

## Animate.bounce

来回，需要配合loop使用

```TypeScript
graphic
    .animate()
    .to({ height: 200 }, 2000, 'quadIn')
    // 执行一个来回，高度从当前变成2000，再从2000变成当前值
    .bounce()
    // 循环count次，一共走count+1个单程
    .loop(count);
```

## Animate.startAt

从startAt时刻开始，这个时刻不受loop的影响，只走一次

```TypeScript
graphic
    .animate()
    .startAt(2000)
    .to({ height: 200 }, 2000, 'quadIn')
    // 执行一个来回，高度从当前变成2000，再从2000变成当前值
    .bounce()
    // 循环count次，一共走count+1个单程
    .loop(count);
```

# 子动画subAnimate

子动画将动画分为不同阶段，每个阶段有独立的loop、bounce、reverse、startAt等状态，同时不同阶段也是按顺序执行

```TypeScript
graphic
    .animate()
    // 第一个动画，bounce再循环两次
    .startAt(2000)
    .to({ height: 200 }, 200, 'quadIn')
    .to({ x: 200 }, 200, 'quadIn')
    .wait(200)
    .to({ y: 200 }, 200, 'backInOut')
    .to({ fillColor: 'green' }, 200, 'quadIn')
    .bounce(true)
    .loop(2)
    // 第二个动画，bounce再循环三次
    .subAnimate()
    .startAt(2000)
    .to({ x: 300 }, 200, 'quadIn')
    .to({ y: 300 }, 2000, 'backIn')
    .bounce(true)
    .loop(3);
```

# 动画编排

animate支持一些动画编排相关的功能，用户不需要手动计算动画的执行时间即可链接不同动画

## Animate.after

在某个动画结束之后执行

```TypeScript
const a1 = graphic.animate()
    .startAt(2000)
    .to({ height: 200 }, 200, 'quadIn');
const a2 = graphic.animate()
    .after(a1) // 在a1结束之后执行
    .startAt(2000)
    .to({ height: 200 }, 200, 'quadIn');
```

## Animate.afterAll

在传递的动画数组内的所有动画结束之后执行

```TypeScript
const a1 = graphic.animate()
    .startAt(2000)
    .to({ height: 200 }, 200, 'quadIn');
const a2 = graphic.animate()
    .to({ height: 200 }, 200, 'quadIn');
const a3 = graphic.animate()
    .afterAll([a1, a2]) // a1和a2都执行完之后再执行
    .to({ height: 200 }, 200, 'quadIn');
```

## Animate.parallel

和某一个动画并行同时执行

```TypeScript
const a1 = graphic.animate()
    .startAt(2000)
    .to({ height: 200 }, 200, 'quadIn');
const a2 = graphic.animate()
    .after(a1) // 在a1结束之后执行
    .startAt(2000)
    .to({ height: 200 }, 200, 'quadIn');
const a3 = graphic.animate()
    .parallel(a2) // 和a2同时执行
    .to({ height: 200 }, 200, 'quadIn');
```

# 自定义插值

## Animate.AddInterpolate

提供对某个key的自定义插值能力，注册函数全局生效，返回true表示插值成功

```TypeScript
Animate.AddInterpolate('text', (key, ratio, from, to, target, ret) => {
    const _from = parseInt(from);
    const _to = parseInt(to);
    ret.text = (_from + (_to - _from) * ratio).toString();
    return true;
  });
 // key传入空字符串，那么所有key都会匹配
 Animate.AddInterpolate('', (key, ratio, from, to, target, ret) => {
    if (key === 'text') {
        const _from = parseInt(from);
        const _to = parseInt(to);
        ret.text = (_from + (_to - _from) * ratio).toString();
        return true;
    }
    return false;
  });
```

## Animate参数interpolate（优先级更高）

在创建animate的时候传入，这个函数只针对这个animate生效，返回true表示插值成功

```TypeScript
text.animate({
    interpolate(key, ratio, from, to, nextAttributes) {
      if (key === 'text') {
        nextAttributes.text = parseFloat(from) + (parseFloat(to + 1000) - parseFloat(from)) * ratio;
        return true;
      }
      return false;
    },
  }).to({ text: '100' }, 1000, 'quartIn');
```

# 自定义动画

## 创建

继承ACustomAnimate，提供主要的方法如下

```TypeScript
export class IncreateCount extends ACustomAnimate {
  // 这些参数都会被保存到this中
  // this.from = from; this.to = to; this.duration = duration; this.ease = ease;
  constructor(from: any, to: any, duration: number, ease: EaseType) {
    super(from, 0, duration, ease);
  }

  // 结束时的属性
  getEndProps(): Record<string, any> {
    return {
      text: this.to
    };
  }

  // 绑定时调用，通常在这里会获取target的最初属性值
  onBind(): void {
    this.to = parseFloat(this.target.getAnimatePropByName('text'));
  }

  // 结束时调用，通常不需要做任何操作
  onEnd(): void {
    return;
  }

  // 插值时调用
  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    out.text = this.from + (this.to - this.from) * ratio;
  }
}
```

## 使用

在play方法中传入自定义动画

```TypeScript
text    .animate()    .to({ fillColor: 'red' }, 1000, 'quadIn')    .play(new IncreateCount(0, 0, 1000, 'quartIn'))    .to({ fillColor: 'green' }, 1000, 'quadIn');
```