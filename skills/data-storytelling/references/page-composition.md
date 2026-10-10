# 固定页面组装

HTML / Web-PPT 共用 `scripts/compose_story.py`。Agent 只生成正文片段和页面配置，直接执行此脚本；不要复制、改写或生成 Python 组装脚本。页面外壳、素材转义、依赖版本和初始化由固定实现负责。

## Agent 输入

- HTML：`runtime/body.html`，包含章节与 footer / Methodology。
- PPT：`runtime/slides.html`，包含按 slide-markup 约定编写的 slide 节点，不包含 deck shell。
- 两者都写 `runtime/page.json`。正文是自由 HTML，不需要转成章节 JSON；不包含 html/head/body、script/style、外部样式链接或文档声明。按对应 Build 的 class / pattern / slot 组织布局。

HTML 配置：

```json
{"title": "故事标题", "lang": "zh-CN", "presentation_mode": "editorial"}
```

PPT 配置：

```json
{"title": "演示标题", "lang": "zh-CN", "deck_axis": "horizontal"}
```

title 必填；lang 默认 zh-CN；HTML 的 presentation_mode 默认 editorial，也支持 feature；PPT 的 deck_axis 默认 horizontal，也支持 vertical。未知字段报错；preset 与主题只来自 story-head.html，不在配置中新增脚本或 CSS。

## 素材引用

只引用 `resolved_asset_bindings.json` 中的 asset ID，不把图片 base64 读回上下文，不手写 URL 转义或 Python helper。

```html
<section class="hero hero-image with-image overlay-dark"
         data-pattern="hero-impact" data-hero-mode="image"
         data-story-background="hero_bg">
  <div class="hero-inner"><h1>故事标题</h1></div>
</section>
<figure class="primary-image">
  <img data-story-image="product_photo" alt="产品实物">
</figure>
<div class="visual-artifact" data-story-inline="mechanism"></div>
```

- data-story-background：脚本写入 background-image；该节点不要另写 style。位置仍遵守 pattern / slide 的背景节点约定，不新建 overlay。
- data-story-image：只用于 img；不要同时写 src 或 srcset。Agent 负责 alt、class 等语义属性。
- data-story-inline：只用于空 div/span/figure，脚本填入 normalized SVG；不要放占位文字或子节点。
- 每个节点只允许一个素材引用。背景 / image 需要 normalized data_uri，inline 需要 inline_markup。source 与 placement 边界仍由 Asset Registry 和 normalize 管理。
- 缺失或类型不匹配时明确报错。按 Plan fallback 调整正文结构并移除失效引用，或报告无法完成；脚本不猜测 fallback，也不偷偷留空容器。

## 执行

提前准备 `story-head.html`、`spec_map.json`、`resolved_asset_bindings.json`（无图表或素材时也写空对象）。

```bash
python3 "$SKILL_DIR/scripts/compose_story.py" \
  --target html \
  --runtime-dir /path/to/runtime \
  --body-file /path/to/runtime/body.html \
  --config-file /path/to/runtime/page.json \
  --output /path/to/runtime/output.html
python3 "$SKILL_DIR/scripts/validate_js.py" /path/to/runtime/output.html
```

PPT 改为 `--target ppt`、`--body-file .../slides.html`、`--output .../output-ppt.html`。脚本自行定位 Skill 根目录，不需要 Agent 填 SKILL_DIR。

只在输入文件上修复后重跑，不直接修改最终 HTML 或固定 composer。完成组装及 JS 校验后仍需查看页面：图片实际可见、背景不遮挡文字、图表正常；有浏览器能力时检查图片加载及背景 computed style。文件包含 base64 或 JS 通过，不等于视觉验收通过。
