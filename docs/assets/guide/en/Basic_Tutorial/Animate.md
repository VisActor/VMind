# Animation

# Basic Usage

## Graphic.Animate

Graphic.animate creates an animation, providing hooks such as `onStart`, `onEnd`, and `onFrame`.

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

The most common interpolation method, interpolating from the current value to the target value.

```TypeScript
graphic
    .animate()
    // 高度变化到200，耗时2000ms，插值函数是quadIn
    .to({ height: 200 }, 2000, 'quadIn')
```

## Animate.wait

Wait time.

```TypeScript
graphic
    .animate()
    // 等待2000ms
    .wait(2000)
```

## Animate.from

The most common interpolation method, interpolating from the target value to the current value, which has the opposite effect of `to`.

```TypeScript
graphic
    .animate()
    // 高度从200插值到当前值，耗时2000ms，插值函数是quadIn
    .from({ height: 200 }, 2000, 'quadIn')
```

## Animate.reverse

Reverse execution.

```TypeScript
graphic
    .animate()
    // 高度从200插值到当前值，耗时2000ms，插值函数是quadIn
    .from({ height: 200 }, 2000, 'quadIn')
    // 反向执行，将from变成to的效果
    .reverse();
```

## Animate.loop

Looping.

```TypeScript
graphic
    .animate()
    .to({ height: 200 }, 2000, 'quadIn')
    // 再走count次，一共走count+1次
    .loop(count);
```

## Animate.bounce

Round-trip, needs to be used in conjunction with `loop`.

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

Start at the `startAt` moment. This moment is not affected by the loop and will only run once.

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

# Sub-animations (subAnimate)

Sub-animation divides the animation into different stages, each stage has independent loop, bounce, reverse, startAt, and other states, and different stages are executed sequentially.

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

# Animation Arrangement

Animate supports some animation arrangement-related features, allowing users to link different animations without manually calculating the animation execution time.

## Animate.after

Execute after a certain animation has ended.

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

Execute after all animations within the passed animation array have ended.

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

Execute simultaneously with a certain animation in parallel.

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

# Custom Interpolation

## Animate.AddInterpolate

Provides custom interpolation capabilities for a particular key. The registered function takes global effect, and returning true indicates successful interpolation.

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

## Animate parameter interpolate (higher priority)

Pass it in when creating the animate. This function only applies to this animate and returns true if the interpolation is successful.

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

# Custom Animation

## Creation

Extend ACustomAnimate, providing the main methods as follows.

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

## Usage

Pass in the custom animation in the play method.

```TypeScript
text    .animate()    .to({ fillColor: 'red' }, 1000, 'quadIn')    .play(new IncreateCount(0, 0, 1000, 'quartIn'))    .to({ fillColor: 'green' }, 1000, 'quadIn');
```