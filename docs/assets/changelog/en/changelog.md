# v0.17.18

2024-01-24


**🆕 New feature**

- **@visactor/vrender-components**: adjust the timing for label customLayoutFunc invocation
- **@visactor/vrender-components**: label component will sync maxLineWidth to maxWidth in richText
- **@visactor/vrender-kits**: compatible canvas in lynx env
- **@visactor/vrender-core**: support backgroundCornerRadius

**🐛 Bug fix**

- **@visactor/vrender-components**: event pos error when interactive in site
- **@visactor/vrender-kits**: fix issue with interface
- **@visactor/vrender-core**: fix issue with multiline text textBaseline, closed [#886](https://github.com/VisActor/VRender/issues/886)
- **@visactor/vrender-core**: fix issue with union empty bounds
- **@visactor/vrender-core**: richtext.textConfig supports number type text



[more detail about v0.17.18](https://github.com/VisActor/VRender/releases/tag/v0.17.18)

# v0.17.17

2024-01-22


**🆕 New feature**

- **@visactor/vrender-core**: html only append dom inside body
- **@visactor/vrender-core**: color support str gradient color
- **@visactor/vrender**: color support str gradient color

**🐛 Bug fix**

- **@visactor/vrender-components**: title support multiline
- **@visactor/vrender-kits**: fix issue with loaded tree-shaking
- **@visactor/vrender-core**: fix issue with rerun getTextBounds
- **@visactor/vrender-core**: fix issue with set image
- **@visactor/vrender-core**: fix issue with loaded tree-shaking



[more detail about v0.17.17](https://github.com/VisActor/VRender/releases/tag/v0.17.17)

# v0.17.16

2024-01-18


**🆕 New feature**

- **@visactor/vrender-core**: enable pass supportsPointerEvents and supportsTouchEvents

**🐛 Bug fix**

- **@visactor/vrender-components**: when no brush is active, brush should not call stopPropagation()

[more detail about v0.17.16](https://github.com/VisActor/VRender/releases/tag/v0.17.16)

# v0.17.15

2024-01-17


**🆕 New feature**

- **@visactor/vrender-components**: support boolean config in label
- **@visactor/vrender-core**: add supportsTouchEvents and supportsPointerEvents params

**🐛 Bug fix**

- **@visactor/vrender-components**: fix the flush of axis when axis label has rotate angle
- **@visactor/vrender-components**: arc label line not shown
- **@visactor/vrender-components**: error happens in line-label when line has no points
- **@visactor/vrender-core**: fix issue with html attribute
- **@visactor/vrender-core**: fix issue with env-check
- **@visactor/vrender-core**: fix issue with text background opacity



[more detail about v0.17.15](https://github.com/VisActor/VRender/releases/tag/v0.17.15)

# v0.17.14

2024-01-12

**🐛 Bug fix**
- **@visactor/vrender-core**: fix `splitRect` when rect has `x1` or `y1`
- **@visactor/vrender**: fix `splitRect` when rect has `x1` or `y1`


[more detail about v0.17.14](https://github.com/VisActor/VRender/releases/tag/v0.17.14)

# v0.17.13

2024-01-10

**🆕 New feature**
- **@visactor/vrender-core**: background support opacity
**🐛 Bug fix**
- **@visactor/vrender-components**: filter out invisible indicator spec
- **@visactor/vrender-components**: `measureTextSize` needs to take into account the fonts configured on the stage theme
- **@visactor/vrender-core**: fix issue with incremental draw
- **@visactor/vrender-core**: supply the `getTheme()` api for `IStage`



[more detail about v0.17.13](https://github.com/VisActor/VRender/releases/tag/v0.17.13)

# v0.17.12

2024-01-10

**🆕 New feature**
- **@visactor/vrender-components**: support fit strategy for indicator
- **marker**: mark point support confine. fix @Visactor/VChart[#1573](https://github.com/VisActor/VRender/issues/1573)
**🐛 Bug fix**
- **marker**: fix problem of no render when set visible attr and add valid judgment logic. fix@Visactor/Vchart[#1901](https://github.com/VisActor/VRender/issues/1901)
- **datazoom**: adaptive handler text layout. fix@Visactor/VChart[#1809](https://github.com/VisActor/VRender/issues/1809)
- **datazoom**: set pickable false when zoomLock. fix @Visactor/VChart[#1565](https://github.com/VisActor/VRender/issues/1565)
- **datazoom**: handler not follow mouse after resize. fix@Visactor/Vchart[#1490](https://github.com/VisActor/VRender/issues/1490)
- **@visactor/vrender-components**: arc outside label invisible with visible label line



[more detail about v0.17.12](https://github.com/VisActor/VRender/releases/tag/v0.17.12)

# v0.17.11

2024-01-05

**🆕 New feature**
- **@visactor/vrender-core**: add backgroundFit attribute
**🐛 Bug fix**
- **@visactor/vrender-core**: fix issue with position in html attribute
- fix: label invisible when baseMark visible is false

**Full Changelog**: https://github.com/VisActor/VRender/compare/v0.17.10...v0.17.11

[more detail about v0.17.11](https://github.com/VisActor/VRender/releases/tag/v0.17.11)

# v0.17.10

2024-01-03

**🆕 New feature**
- **@visactor/vrender-components**: support `lastVisible` of LineAxis label
- **@visactor/vrender-kits**: support fillPickable and strokePickable for area, closed [#792](https://github.com/VisActor/VRender/issues/792)
- **@visactor/vrender-core**: support fillPickable and strokePickable for area, closed [#792](https://github.com/VisActor/VRender/issues/792)
- **@visactor/vrender-core**: support `lastVisible` of LineAxis label
- **@visactor/vrender**: support `lastVisible` of LineAxis label
**🐛 Bug fix**
- **@visactor/vrender-components**: fix the auto limit width of label when the label has vertical `direction` in orient top or bottom
- **@visactor/vrender-components**: fix issue with legend symbol size
- **@visactor/vrender-components**: fixed height calculation issue after multi-layer axis text rotation
- **@visactor/vrender-core**: fix issue with area-line highperformance draw
- **@visactor/vrender-core**: fix the auto limit width of label when the label has vertical `direction` in orient top or bottom
- **@visactor/vrender-core**: disable layer picker in interactive layer
- **@visactor/vrender**: fix the auto limit width of label when the label has vertical `direction` in orient top or bottom
**🔖 other**
- **@visactor/vrender-components**: 'feat: support label line in label component'



[more detail about v0.17.10](https://github.com/VisActor/VRender/releases/tag/v0.17.10)

# v0.17.9

2024-01-03

**🐛 Bug fix**
- **@visactor/vrender-components**: fix label position when offset is 0
- **@visactor/vrender-core**: fix issue with conical cache not work as expect



[more detail about v0.17.9](https://github.com/VisActor/VRender/releases/tag/v0.17.9)

# v0.17.8

2023-12-29

**🆕 New feature**
- **@visactor/vrender-components**: optimize outer label layout in tangential direction
- **@visactor/vrender-core**: support drawGraphicToCanvas
- **@visactor/vrender**: support drawGraphicToCanvas
**🐛 Bug fix**
- **@visactor/vrender-components**: when axis label space is 0, and axis tick' inside is true, the axis label's position is not correct
- **@visactor/vrender-components**: fix morphing of rect
- **@visactor/vrender-kits**: fix issue with mapToCanvasPoint in miniapp, closed [#828](https://github.com/VisActor/VRender/issues/828)
- **@visactor/vrender-core**: fix issue with rect.toCustomPath
- **@visactor/vrender-core**: fix issue with area segment with single point, closed [#801](https://github.com/VisActor/VRender/issues/801)
- **@visactor/vrender-core**: fix issue with new Function in miniapp
- **@visactor/vrender-core**: fix morphing of rect
- **@visactor/vrender-core**: fix issue with side-effect in some env
- **@visactor/vrender-core**: fix issue with check tt env
- **@visactor/vrender-core**: fix issue with cliped attribute in vertical text, closed [#827](https://github.com/VisActor/VRender/issues/827)
- **@visactor/vrender**: fix issue with area segment with single point, closed [#801](https://github.com/VisActor/VRender/issues/801)
- **@visactor/vrender**: fix morphing of rect
- **@visactor/vrender**: fix issue with side-effect in some env



[more detail about v0.17.8](https://github.com/VisActor/VRender/releases/tag/v0.17.8)

# v0.17.7

2023-12-21

**🐛 Bug fix**
- **@visactor/vrender-kits**: fix issue with create layer in miniapp env
- **@visactor/vrender-core**: fix issue with create layer in miniapp env



[more detail about v0.17.7](https://github.com/VisActor/VRender/releases/tag/v0.17.7)

# v0.17.6

2023-12-20

**What's Changed**
* Main by @neuqzxy in https://github.com/VisActor/VRender/pull/813
* fix: fix issue with rect stroke contribution by @neuqzxy in https://github.com/VisActor/VRender/pull/814
* [Auto release] release 0.17.6 by @github-actions in https://github.com/VisActor/VRender/pull/815


**Full Changelog**: https://github.com/VisActor/VRender/compare/v0.17.5...v0.17.6

[more detail about v0.17.6](https://github.com/VisActor/VRender/releases/tag/v0.17.6)

# v0.17.5

2023-12-19

**🆕 New feature**
- **scrollbar**: dispatch scrollDown event
- **@visactor/vrender-components**: labelLine support animate
- **@visactor/vrender-components**: label don't create enter animate animationEnter while duration less than 0
- **@visactor/vrender**: add disableAutoClipedPoptip attribute in text graphic
**🐛 Bug fix**
- **@visactor/vrender-components**: fix issue with arc animate with delayafter
- **@visactor/vrender-components**: fix issue with poptip circular dependencies
- **@visactor/vrender-core**: fix issue with plugin unregister
- **@visactor/vrender-core**: fix issue with text while whitespace is normal
- **@visactor/vrender**: fix cursor update error in multi-stage



[more detail about v0.17.5](https://github.com/VisActor/VRender/releases/tag/v0.17.5)

# v0.17.4

2023-12-15

**🐛 Bug fix**
- **datazoom**: symbol size problem
- **@visactor/vrender-core**: fix issue with arc imprecise bounds, closed [#728](https://github.com/VisActor/VRender/issues/728)



[more detail about v0.17.4](https://github.com/VisActor/VRender/releases/tag/v0.17.4)

# v0.17.3

2023-12-14

**🐛 Bug fix**
- **datazoom**: handler zindex to interaction error



[more detail about v0.17.3](https://github.com/VisActor/VRender/releases/tag/v0.17.3)

# v0.17.2

2023-12-14

**🆕 New feature**
- **dataZoom**: add mask to modify hot zone. feat @visactor/vchart[#1415](https://github.com/VisActor/VRender/issues/1415)'
- **dataZoom**: add mask to modify hot zone. feat @visactor/vchart[#1415](https://github.com/VisActor/VRender/issues/1415)'
- **dataZoom**: add mask to modify hot zone. feat @visactor/vchart[#1415](https://github.com/VisActor/VRender/issues/1415)'
- **dataZoom**: add mask to modify hot zone. feat @visactor/vchart[#1415](https://github.com/VisActor/VRender/issues/1415)'
- **dataZoom**: add mask to modify hot zone. feat @visactor/vchart[#1415](https://github.com/VisActor/VRender/issues/1415)'
- **@visactor/vrender-core**: rect3d support x1y1, fix -radius issue with rect
- **dataZoom**: add mask to modify hot zone. feat @visactor/vchart[#1415](https://github.com/VisActor/VRender/issues/1415)'
**🐛 Bug fix**
- **@visactor/vrender-components**: scrollbar slider width/height should not be negative
- **@visactor/vrender-components**: datazoom event block window event. fix @visactor/vchart[#1686](https://github.com/VisActor/VRender/issues/1686)
- **@visactor/vrender-components**: fix the issue of brushEnd trigger multiple times, related https://github.com/VisActor/VChart/issues/1694
- **@visactor/vrender-core**: fix shadow pick issue
**⚡ Performance optimization**
- **@visactor/vrender-components**: optimize the `_handleStyle()` in legend



[more detail about v0.17.2](https://github.com/VisActor/VRender/releases/tag/v0.17.2)

# v0.17.1

2023-12-06

**🆕 New feature**
- **@visactor/vrender-kits**: support pickStrokeBuffer, closed [#758](https://github.com/VisActor/VRender/issues/758)
- **@visactor/vrender-core**: support pickStrokeBuffer, closed [#758](https://github.com/VisActor/VRender/issues/758)
**🐛 Bug fix**
- **@visactor/vrender-kits**: fix issue with rebind pick-contribution
- **@visactor/vrender-core**: fix issue in area chart with special points
- **@visactor/vrender-core**: fix issue with rebind pick-contribution
- **@visactor/vrender-core**: fix error with wrap text and normal whiteSpace text



[more detail about v0.17.1](https://github.com/VisActor/VRender/releases/tag/v0.17.1)

# v0.17.0

2023-11-30

**🆕 New feature**
- **@visactor/vrender-components**: optmize bounds performance
- **@visactor/vrender-kits**: rect support x1 and y1
- **@visactor/vrender-kits**: optmize bounds performance
- **@visactor/vrender-core**: support disableCheckGraphicWidthOutRange to skip check if graphic out of range
- **@visactor/vrender-core**: rect support x1 and y1
- **@visactor/vrender-core**: don't rewrite global reflect
- **@visactor/vrender-core**: text support background, closed [#711](https://github.com/VisActor/VRender/issues/711)
- **@visactor/vrender-core**: optmize bounds performance
- **@visactor/vrender**: don't rewrite global reflect
- **@visactor/vrender**: skip update bounds while render small node-tree, closed [#660](https://github.com/VisActor/VRender/issues/660)
- **@visactor/vrender**: optmize bounds performance
**🔨 Refactor**
- **@visactor/vrender-kits**: refact inversify completely, closed [#657](https://github.com/VisActor/VRender/issues/657)
- **@visactor/vrender-core**: refact inversify completely, closed [#657](https://github.com/VisActor/VRender/issues/657)
- **@visactor/vrender**: refact inversify completely, closed [#657](https://github.com/VisActor/VRender/issues/657)
**⚡ Performance optimization**
- **@visactor/vrender-components**: add option `skipDefault` to vrender-components
- **@visactor/vrender-core**: area support drawLinearAreaHighPerformance, closed [#672](https://github.com/VisActor/VRender/issues/672)



[more detail about v0.17.0](https://github.com/VisActor/VRender/releases/tag/v0.17.0)

# v0.16.18

2023-11-30

**🆕 New feature**
- **@visactor/vrender-components**: discrete legend's pager support position property
- **@visactor/vrender-core**: support suffixPosition, closed [#625](https://github.com/VisActor/VRender/issues/625)
- **@visactor/vrender**: support suffixPosition, closed [#625](https://github.com/VisActor/VRender/issues/625)
**🐛 Bug fix**
- **@visactor/vrender-kits**: doubletap should not be triggered when the target is different twice before and after
- **@visactor/vrender-core**: fix issue with attribute interpolate, closed [#741](https://github.com/VisActor/VRender/issues/741)
- **@visactor/vrender-core**: fix issue about calcuate bounds with shadow, closed [#474](https://github.com/VisActor/VRender/issues/474)
- **@visactor/vrender-core**: fix issue with white line in some dpr device, closed [#666](https://github.com/VisActor/VRender/issues/666)
**🔨 Refactor**
- **@visactor/vrender-components**: move getSizeHandlerPath out of sizlegend
- **@visactor/vrender-core**: event-related coordinate points do not require complex Point classes



[more detail about v0.16.18](https://github.com/VisActor/VRender/releases/tag/v0.16.18)

# v0.16.17

2023-11-23

**🆕 New feature**
- **@visactor/vrender-components**: support rich text for label, axis, marker,tooltip, indicator and title
- **@visactor/vrender-components**: add mode type of smartInvert
- **@visactor/vrender-components**: place more label for overlapPadding case
- **@visactor/vrender-kits**: support 'tap' gesture for Gesture plugin
- **@visactor/vrender-core**: add `event` config for Stage params, which can configure `clickInterval` and some other options in eventSystem
- **@visactor/vrender-core**: support fill and stroke while svg don't support, closed [#710](https://github.com/VisActor/VRender/issues/710)
**🐛 Bug fix**
- **@visactor/vrender-kits**: \`pickMode: 'imprecise'\` not work in polygon
- **@visactor/vrender-core**: richtext may throw error when textConfig is null
- **@visactor/vrender-core**: fix issue with image repeat, closed [#712](https://github.com/VisActor/VRender/issues/712)
- **@visactor/vrender-core**: fix issue with restore and save count not equal
**⚡ Performance optimization**
- **@visactor/vrender-core**: not setAttribute while background is not url, closed [#696](https://github.com/VisActor/VRender/issues/696)



[more detail about v0.16.17](https://github.com/VisActor/VRender/releases/tag/v0.16.17)

# v0.16.16

2023-11-17

**🐛 Bug fix**
- **@visactor/vrender-components**: fix the issue of legend item.shape can not set visible, related https://github.com/VisActor/VChart/issues/1508
- **@visactor/vrender-core**: assign symbol rect function to old



[more detail about v0.16.16](https://github.com/VisActor/VRender/releases/tag/v0.16.16)

# v0.16.15

2023-11-16

**🐛 Bug fix**
- **@visactor/vrender-compoments**: legendItemHover and legendItemUnHover should trigger once



[more detail about v0.16.15](https://github.com/VisActor/VRender/releases/tag/v0.16.15)

# v0.16.14

2023-11-15

**🆕 New feature**
- **@visactor/vrender-components**: datazoom update callback supports new trigger tag param
- **@visactor/vrender-components**: support line/area label
- **@visactor/vrender-components**: lineHeight support string, which means percent
- **@visactor/vrender-core**: add round line symbol, closed [#1458](https://github.com/VisActor/VRender/issues/1458)
- **@visactor/vrender-core**: lineHeight support string, which means percent
**🐛 Bug fix**
- **@visactor/vrender-core**: fix issue with render while in scale transform



[more detail about v0.16.14](https://github.com/VisActor/VRender/releases/tag/v0.16.14)

# v0.16.13

2023-11-15

**🆕 New feature**
- **@visactor/vrender-core**: add preventRender function
- **@visactor/vrender-core**: merge wrap text function to text
**🐛 Bug fix**
- **@visactor/vrender-kits**: temp fix issue with lynx measuretext



[more detail about v0.16.13](https://github.com/VisActor/VRender/releases/tag/v0.16.13)

# v0.16.12

2023-11-07

**🆕 New feature**
- **@visactor/vrender-core**: optimize text increase animation
**🐛 Bug fix**
- **@visactor/vrender-components**: padding of title component
- **@visactor/vrender-components**: padding offset of AABBbounds
- **@visactor/vrender-kits**: fix node-canvas max count issue
- **@visactor/vrender-core**: fix node-canvas max count issue



[more detail about v0.16.12](https://github.com/VisActor/VRender/releases/tag/v0.16.12)

# v0.16.11

2023-11-07

**🐛 Bug fix**
- **@visactor/vrender-components**: optimize the auto-overlap of axis label, which use rotateBounds when text rotated, relate https://github.com/VisActor/VChart/issues/133
- **@visactor/vrender-components**: flush should not sue width height
- **@visactor/vrender-components**: fix the lastvisible logic of axis's auto-hide
- **@visactor/vrender-kits**: fix issue with xul and html attribute, closed [#634](https://github.com/VisActor/VRender/issues/634)
- **@visactor/vrender-core**: fix issue with xul and html attribute, closed [#634](https://github.com/VisActor/VRender/issues/634)



[more detail about v0.16.11](https://github.com/VisActor/VRender/releases/tag/v0.16.11)

# v0.16.10

2023-11-02

**What's Changed**
* Sync main by @neuqzxy in https://github.com/VisActor/VRender/pull/640
* fix: fix issue with xul and html attribute, closed [#634](https://github.com/VisActor/VRender/issues/634) by @neuqzxy in https://github.com/VisActor/VRender/pull/635
* Echance/axis auto rotate by @kkxxkk2019 in https://github.com/VisActor/VRender/pull/633
* [Auto release] release 0.16.9 by @github-actions in https://github.com/VisActor/VRender/pull/641


**Full Changelog**: https://github.com/VisActor/VRender/compare/v0.16.9...v0.16.10

[more detail about v0.16.10](https://github.com/VisActor/VRender/releases/tag/v0.16.10)

# v0.16.9

2023-10-27

**🆕 New feature**
- **@visactor/vrender-components**: add checkbox indeterminate state
- **label**: rect label support position `top-right`|`top-left`|`bottom-righ`|`bottom-left`
- **@visactor/vrender-core**: stage background support image
**🐛 Bug fix**
- **@visactor/vrender-components**: all the group container of marker do not trigger event
- **datazoom**: text bounds when visible is false. fix VisActor/VChart[#1281](https://github.com/VisActor/VRender/issues/1281)



[more detail about v0.16.9](https://github.com/VisActor/VRender/releases/tag/v0.16.9)

# v0.16.8

2023-10-23

**🐛 Bug fix**
- **@visactor/vrender-components**: fix the issue of error position of focus when legend item just has label



[more detail about v0.16.8](https://github.com/VisActor/VRender/releases/tag/v0.16.8)

# v0.16.7

2023-10-23

**🐛 Bug fix**
- **label**: fix the issue that `clampForce` does not work when`overlapPadding` is configured
- **@visactor/vrender-core**: fix issue with creating multi chart in miniapp



[more detail about v0.16.7](https://github.com/VisActor/VRender/releases/tag/v0.16.7)

# v0.16.6

2023-10-23

**🆕 New feature**
- **@visactor/vrender-components**: optimize the layout method of circle axis label
**🐛 Bug fix**
- **@visactor/vrender-components**: fix the layout issue of legend item because of the error logic of `focusStartX`



[more detail about v0.16.6](https://github.com/VisActor/VRender/releases/tag/v0.16.6)

