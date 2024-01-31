# Extensions and Plugins

VRender supports the registration of extensions and plugins, and some built-in functions are supported by extensions and plugins. The following examples show how to write extensions and plugins.

## Custom Rendering Extension

Users can write their own rendering extensions to achieve the desired effects. If we want to replace the existing rect rendering with a hand-drawn style rendering, we need to:

1. Write the RoughCanvasRectRender class, which implements the `IGraphicRender` interface

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
    // Get the native canvas
    const canvas = context.canvas.nativeCanvas;
    const rc = rough.canvas(canvas);

    context.highPerformanceSave();

    // const rectAttribute = graphicService.themeService.getCurrentTheme().rectAttribute;
    const rectAttribute = getTheme(rect).rect;
    let { x = rectAttribute.x, y = rectAttribute.y } = rect.attribute;
    if (!rect.transMatrix.onlyTranslate()) {
      // Poor performance
      x = 0;
      y = 0;
      context.transformFromMatrix(rect.transMatrix, true);
    } else {
      const { dx = rectAttribute.dx, dy = rectAttribute.dy } = rect.attribute;
      x += dx;
      y += dy;
      // The current context has rotate/scale, reset matrix
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

2. Register your class in the container

```ts
export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // rect
  bind(RoughCanvasRectRender).toSelf().inSingletonScope();
  bind(GraphicRender).to(RoughCanvasRectRender);
});
```

3. Before the code runs, load your module

```ts
container.load(your module);
```

## Custom Modification of Render Flow Injection

If you don't want to modify the entire rendering logic but just want to do some operations before and after rendering, such as drawing the background before rect rendering, the process is as follows:

1. Write a contribution, which implements the IBaseRenderContribution interface

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

2. Register your class in the container

```ts
export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // rect
  bind(DefaultRectBackgroundRenderContribution).toSelf().inSingletonScope();
  bind(RectRenderContribution).toService(DefaultRectBackgroundRenderContribution);
});
```

3. Before the code runs, load your module

```ts
container.load(your module);
```

## Developing Plugins

Sometimes we only need to use some hooks to develop the desired plugins. For example, if you want to do automatic rendering, the plugin should be developed as follows:

1. Write the plugin logic

```ts
export class AutoRenderPlugin implements IPlugin {
  name: 'AutoRenderPlugin' = 'AutoRenderPlugin';
  activeEvent: 'onRegister' = 'onRegister';
  pluginService: IPluginService;
  _uid: number = Generator.GenAutoIncrementId();
  key: string
```
