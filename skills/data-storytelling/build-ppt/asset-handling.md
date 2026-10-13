# PPT Asset Handling

本文件定义 Web-PPT 如何使用 SVG、image 和用户提供的视觉素材。资产不是装饰随机池；只有 plan 声明并成功 resolved 的素材才能进入 slide。

## 输入来源

合法来源：

- `plan.md` 的 `Assets / Asset Registry`
- chapter `SectionVisual.assets`
- 用户已经提供并被素材标准化流程接收的图片 / SVG
- `media_hint: svg` 时由当前 skill 生成的本地 SVG
- `media_hint: image` 时由当前宿主 Agent 生图能力生成并落盘的图片

输出来源：

- `runtime/generated-assets/{assetId}.svg`
- `runtime/generated-assets/{assetId}.png`
- `runtime/resolved_asset_bindings.json`

Build 不临时上网找图，不把 asset prompt、visual brief 或 fallback 文案写进 slide。

图片生成、落盘检查与失败披露统一遵循 [image-generation.md](../references/image-generation.md)。本文件只补充 slide 中的素材角色和消费规则。

## Asset 角色

| Asset Director placement | 适合 slide type | 输入 | Markup slot |
|---|---|---|---|
| `hero_background_image` | `hero-image`, `cover`, `transition` | image data uri | `.slide-background` |
| `primary_image` | `text-image` | image data uri | `.primary-image` |
| `evidence_image` | `image-grid` | image data uri | `.evidence-image` |
| `visual_artifact` | `text-image` | inline SVG | `.visual-artifact` |
| `opener_motif_background` | `cover` | SVG data uri 或 low-contrast image | background / motif slot |

Role 必须服务当前 slide 的阅读任务。不要因为素材存在就强行塞进页面。

## 一等证据与轻量符号

先判断素材在这一页承担什么职责，再选 slot。

一等证据：
- `visual-artifact`：机制图、流程图、产品状态拼贴、治理示意等，读者需要看它才能理解本页主判断；它是页内证据对象，不是 slide type。
- `primary-image`：单张截图 / 图片本身就是证据。
- `evidence-image`：多张图片 / 截图共同构成证据组。

轻量符号：
- `opener_motif_background`：封面低存在感主题符号或纹理，只营造入口气质。
- `hero_background_image`：入口、过渡或强场景页的背景氛围。

轻量符号不能放进 `.visual-artifact`。`.visual-artifact` 是页面主证据容器，空容器或弱装饰都会制造大面积空框。
Web-PPT action 页不使用 asset；行动页只保留标题、行动项和 closing cue。

## 背景安全区

背景素材不是证据容器。进入 cover / hero / transition 之前，先判断它会不会抢走标题注意力：

- `opener_motif_background` 只能是低对比主题纹理、符号或轮廓；不要生成大面积深浅强反差、粗线条、可读正文、完整流程图或高显著节点穿过标题区。
- `hero_background_image` 可以更有场景感，但关键人物、产品状态或图表细节不能落在标题和 cue 的安全区。
- 背景素材的主视觉应偏向边缘、角落或留白区域；中部标题区保持低频、低饱和、低对比。
- 如果素材本身承载判断或需要被读者看清，改用 `primary-image`、`evidence-image` 或 `visual-artifact`，不要降级成背景。
- 如果背景和标题打架，Build 的处理顺序是：降低背景显著度、换到非标题安全区、拆成证据页；不要通过进一步缩窄标题或叠更多正文解决。

## 选择规则

- 背景氛围用 `background-image`，只在入口、过渡或极少数强场景页使用；通过 `data-story-background` 引用，由固定 composer 绑定背景。
- 一张图片承担主证据时用 `primary-image`。
- 多张图片共同证明一个观察时用 `evidence-image` 组成 `image-grid`。
- 机制、流程、治理闸门、产品状态拼贴等由生成 SVG / image 表达时用 `visual-artifact`。
- cover 的轻量纹理或主题符号用 `opener-motif-background`，不要压过标题。
- 不要把主图证据写成 `takeaway_accent`；`takeaway_accent` 只用于弱装饰。主图用 `primary_image`，多图用 `evidence_image`，生成 SVG 机制图用 `visual_artifact`。
- 不输出空的 `.visual-artifact` / `.primary-image` / `.evidence-image` 容器；弱装饰缺失时直接移除 slot。

## SVG 使用

`media_hint: svg` 的素材优先作为 inline SVG 使用：

```html
<div class="visual-artifact" data-story-inline="{asset_id}"></div>
```

要求：
- SVG 不包含外链资源。
- SVG 内文字只允许短标签，不承载正文解释。
- SVG 只放主体图形，不在 SVG 内写大段正文或外部说明。
- 不把 SVG prompt、brief、fallback 说明写入画面。

## Image 使用

`media_hint: image` 的素材必须来自 resolved data uri：

```html
<figure class="primary-image">
  <img data-story-image="{asset_id}" alt="{short factual alt}">
</figure>
```

要求：
- `alt` 是事实描述，不写观点。
- 不使用临时远程 URL。
- 不输出破图、空 `src` 或“素材缺失”占位图。
- 不为单页新增图片处理补丁。

## 缺失策略

素材缺失时按重要性处理：

- 证据必需：停止，报告缺少哪个 `asset_id`、对应 slide type 和 role。
- 页面结构依赖该背景图：对可恢复的失败按宿主规则有限重试；仍不可用时停止或回到 plan 执行明确 fallback。
- 弱装饰：移除该 slot，保留页面核心内容。
- 背景氛围：移除该素材并保留 slide type。
- 图片证据：不能用渐变框、占位字或 asset brief 代替。

任何 fallback 都不能成为可见正文，也不能留下伪造图片、坏 `<img>`、asset prompt、visual brief 或 placeholder 文案。

## 素材边界

- 不为了“高级感”给单页新增渐变盒、毛玻璃或大面积发光背景。
- SVG / image 自身可以包含视觉风格，但页面 slot 只负责承载该素材。
- `visual-artifact` 在 `text-image` 页中占主证据面积；如果素材只是 icon、seal、logo、symbol，就不是 `visual-artifact`。
- action 页不使用 icon、seal、logo、symbol 作为装饰；这类素材会削弱决策清单的权重。

## 多素材规则

- `image-grid` 最多 6 张图；超过就拆页。
- `text-image` 只放一个主图或一个 visual artifact。
- `hero-image` 只放一张背景图。
- `visual-artifact` 只放一个主 artifact。
- 同一页不能同时把 chart、quote、primary image 和 visual artifact 都作为主证据。

## Asset Slot Pass

生成 `slides.html` 前做一次 Asset Slot Pass：

1. 读取 `resolved_asset_bindings.json`。
2. 对照 `plan.md` 中每个 `SectionVisual.assets` 引用。
3. 为每个已 resolved asset 分配合法 role。
4. 把素材放入 `slide-markup.md` 定义的 slot。
5. 未使用的 resolved asset 必须在 asset report 中说明是弱装饰移除、证据冲突或 plan 未引用。

检查项：

- [ ] 没有生成后闲置的关键 SVG / image
- [ ] 没有可见 asset prompt / brief / fallback 文案
- [ ] 没有空图、空 asset 容器、破图或远程临时 URL
- [ ] 每个素材 role 都与当前 slide type 匹配
- [ ] 背景图不影响标题和正文可读性
