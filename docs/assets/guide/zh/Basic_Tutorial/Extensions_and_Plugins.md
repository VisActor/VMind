# 扩展和插件

VRender 支持注册扩展和插件，并且内置的某些功能就是通过扩展和插件进行支持的，下面通过几个例子介绍如何编写扩展和插件

## 自定义渲染扩展

用户可以通过编写自己的渲染扩展，来实现自己想要的效果，如果我们想将现有的 rect 渲染替换成手绘风格的渲染，那么需要：

1. 编写 RoughCanvasRectRender 类，该类实现了`IGraphicRender`接口

```ts
import type {
  IGraphicRender,
  IRenderService,
  IRect,
  IGraphicAttribute,
  IContext2d,
  IGraphic,
  IMarkAttribute,
  IThemeAttribute,
  IDrawContext,
  IGraphicRenderDrawParams
} from '@visactor/vrender';
import { RECT_NUMBER_TYPE, DefaultCanvasRectRender, getTheme, inject, injectable } from '@visactor/vrender';
import rough from 'roughjs';
import { defaultRouthThemeSpec } from './config';

@injectable()
export class RoughCanvasRectRender implements IGraphicRender {
  type: 'rect';
  numberType: number;
  style: 'rough' = 'rough';

  constructor(
    @inject(DefaultCanvasRectRender)
    public readonly canvasRenderer: IGraphicRender
  ) {
    this.type = 'rect';
    this.numberType = RECT_NUMBER_TYPE;
  }

  draw(rect: IRect, renderService: IRenderService, drawContext: IDrawContext, params?: IGraphicRenderDrawParams) {
    const { context } = drawContext;
    if (!context) {
      return;
    }
    // 获取到原生canvas
    const canvas = context.canvas.nativeCanvas;
    const rc = rough.canvas(canvas);

    context.highPerformanceSave();

    // const rectAttribute = graphicService.themeService.getCurrentTheme().rectAttribute;
    const rectAttribute = getTheme(rect).rect;
    let { x = rectAttribute.x, y = rectAttribute.y } = rect.attribute;
    if (!rect.transMatrix.onlyTranslate()) {
      // 性能较差
      x = 0;
      y = 0;
      context.transformFromMatrix(rect.transMatrix, true);
    } else {
      const { dx = rectAttribute.dx, dy = rectAttribute.dy } = rect.attribute;
      x += dx;
      y += dy;
      // 当前context有rotate/scale，重置matrix
      context.setTransformForCurrent();
    }

    const {
      fill = rectAttribute.fill,
      stroke = rectAttribute.stroke,
      fillColor = rectAttribute.fill,
      strokeColor = rectAttribute.stroke,
      width = rectAttribute.width,
      height = rectAttribute.height,
      lineWidth = rectAttribute.lineWidth,
      maxRandomnessOffset = defaultRouthThemeSpec.maxRandomnessOffset,
      roughness = defaultRouthThemeSpec.roughness,
      bowing = defaultRouthThemeSpec.bowing,
      curveFitting = defaultRouthThemeSpec.curveFitting,
      curveTightness = defaultRouthThemeSpec.curveTightness,
      curveStepCount = defaultRouthThemeSpec.curveStepCount,
      fillStyle = defaultRouthThemeSpec.fillStyle,
      fillWeight = defaultRouthThemeSpec.fillWeight,
      hachureAngle = defaultRouthThemeSpec.hachureAngle,
      hachureGap = defaultRouthThemeSpec.hachureGap,
      simplification = defaultRouthThemeSpec.simplification,
      dashOffset = defaultRouthThemeSpec.dashOffset,
      dashGap = defaultRouthThemeSpec.dashGap,
      zigzagOffset = defaultRouthThemeSpec.zigzagOffset,
      seed = defaultRouthThemeSpec.seed,
      fillLineDash = defaultRouthThemeSpec.fillLineDash,
      fillLineDashOffset = defaultRouthThemeSpec.fillLineDashOffset,
      disableMultiStroke = defaultRouthThemeSpec.disableMultiStroke,
      disableMultiStrokeFill = defaultRouthThemeSpec.disableMultiStrokeFill,
      preserveVertices = defaultRouthThemeSpec.preserveVertices,
      fixedDecimalPlaceDigits = defaultRouthThemeSpec.fixedDecimalPlaceDigits
    } = rect.attribute as any;
    rc.rectangle(x, y, width, height, {
      fill: fill ? (fillColor as string) : undefined,
      stroke: stroke ? (strokeColor as string) : undefined,
      strokeWidth: lineWidth,
      maxRandomnessOffset,
      roughness,
      bowing,
      curveFitting,
      curveTightness,
      curveStepCount,
      fillStyle,
      fillWeight,
      hachureAngle,
      hachureGap,
      simplification,
      dashOffset,
      dashGap,
      zigzagOffset,
      seed,
      fillLineDash,
      fillLineDashOffset,
      disableMultiStroke,
      disableMultiStrokeFill,
      preserveVertices,
      fixedDecimalPlaceDigits
    });

    context.highPerformanceRestore();
  }

  drawShape(
    graphic: IGraphic,
    ctx: IContext2d,
    x: number,
    y: number,
    drawContext: IDrawContext,
    params?: IGraphicRenderDrawParams,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ): void {
    if (this.canvasRenderer.drawShape) {
      return this.canvasRenderer.drawShape(graphic, ctx, x, y, drawContext, params, fillCb, strokeCb);
    }
  }
}
```

2. 将你的类注册到容器中

```ts
export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // rect
  bind(RoughCanvasRectRender).toSelf().inSingletonScope();
  bind(GraphicRender).to(RoughCanvasRectRender);
});
```

3. 在代码运行之前，加载你的 module

```ts
container.load(your module);
```

## 渲染流程注入自定义修改

如果你并不想修改整个渲染逻辑，而只是想在渲染前后进行一些操作，比如你需要在 rect 的渲染前绘制一次背景，那么流程如下：

1. 编写 contribution，实现 IBaseRenderContribution 接口

```ts
@injectable()
export class RectBackgroundRenderContribution implements IBaseRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    graphic: IGraphic,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    graphicAttribute: Required<IGraphicAttribute>,
    fillCb?: (ctx: IContext2d, markAttribute: Partial<IGraphicAttribute>, themeAttribute: IThemeAttribute) => boolean,
    strokeCb?: (ctx: IContext2d, markAttribute: Partial<IGraphicAttribute>, themeAttribute: IThemeAttribute) => boolean,
    options?: any
  ) {
    const { background } = graphic.attribute;
    if (!background) {
      return;
    }

    if (graphic.backgroundImg && graphic.resources) {
      const res = graphic.resources.get(background);
      if (res.state !== 'success' || !res.data) {
        return;
      }

      context.save();

      if (graphic.parent && !graphic.transMatrix.onlyTranslate()) {
        const groupAttribute = getTheme(graphic.parent).group;
        const { scrollX = groupAttribute.scrollX, scrollY = groupAttribute.scrollY } = graphic.parent.attribute;
        context.setTransformFromMatrix(graphic.parent.globalTransMatrix, true);
        context.translate(scrollX, scrollY);
      }
      context.clip();
      const b = graphic.AABBBounds;
      context.setCommonStyle(graphic, graphic.attribute, x, y, graphicAttribute);
      context.drawImage(res.data, b.x1, b.y1, b.width(), b.height());
      context.restore();
      if (!graphic.transMatrix.onlyTranslate()) {
        context.setTransformForCurrent();
      }
    } else {
      context.highPerformanceSave();
      context.setCommonStyle(graphic, graphic.attribute, x, y, graphicAttribute);
      context.fillStyle = background as string;
      context.fill();
      context.highPerformanceRestore();
    }
  }
}
```

2. 将你的类注册到容器中

```ts
export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // rect
  bind(DefaultRectBackgroundRenderContribution).toSelf().inSingletonScope();
  bind(RectRenderContribution).toService(DefaultRectBackgroundRenderContribution);
});
```

3. 在代码运行之前，加载你的 module

```ts
container.load(your module);
```

## 开发插件

有时候我们仅仅需要使用一些钩子开发想要的插件，比如如果想要做自动渲染，插件应该这么开发：

1. 编写插件逻辑

```ts
export class AutoRenderPlugin implements IPlugin {
  name: 'AutoRenderPlugin' = 'AutoRenderPlugin';
  activeEvent: 'onRegister' = 'onRegister';
  pluginService: IPluginService;
  _uid: number = Generator.GenAutoIncrementId();
  key: string = this.name + this._uid;

  activate(context: IPluginService): void {
    this.pluginService = context;
    application.graphicService.hooks.onAttributeUpdate.tap(this.key, graphic => {
      if (graphic.glyphHost) {
        graphic = graphic.glyphHost;
      }
      if (graphic.stage === context.stage && graphic.stage != null) {
        graphic.stage.renderNextFrame();
      }
    });
    application.graphicService.hooks.onSetStage.tap(this.key, graphic => {
      if (graphic.glyphHost) {
        graphic = graphic.glyphHost;
      }
      if (graphic.stage === context.stage && graphic.stage != null) {
        graphic.stage.renderNextFrame();
      }
    });
  }
  deactivate(context: IPluginService): void {
    application.graphicService.hooks.onAttributeUpdate.taps =
      application.graphicService.hooks.onAttributeUpdate.taps.filter(item => {
        return item.name !== this.key;
      });
    application.graphicService.hooks.onSetStage.taps = application.graphicService.hooks.onSetStage.taps.filter(item => {
      return item.name !== this.key;
    });
  }
}
```

2. 将插件注册到 plugin-service 中

```ts
stage.pluginService.register(new AutoRenderPlugin());
```

3. 如果要卸载插件，调用插件的`plugin.deactivate`即可

```ts
stage.pluginService.findPluginsByName('AutoRenderPlugin').forEach(plugin => {
  plugin.deactivate(this.pluginService);
});
```
