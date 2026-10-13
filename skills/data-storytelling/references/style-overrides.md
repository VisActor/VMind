# Style Overrides

Style Overrides 是少数强主题、品牌色或领域色场景的 plan-level 主题补丁。默认不要填写；先按 [STYLE_PRESETS.md](STYLE_PRESETS.md) 选择最接近的 `Style Preset`。Preset 接近不等于禁止 overrides；但 overrides 只用于用户明确主题约束必须影响舞台、重点色或图表 palette 的场景。

## Plan 位置

只允许写在 `plan.md` 的 `### Style Overrides` 小节中，位置在 `## Story Meta` 后、`## Evidence Backbone` 前。Build 阶段只通过 head helper 解析该小节；compose 脚本不解析 overrides。

## 使用判断

- 用户用自然语言指定具体场景、主题、IP、活动、城市、赛事或品牌气质，并要求 feature 化呈现时，也可以构成明确主题约束。
- 如果主题只影响素材内容、motif、开场图像主体或 `visual_brief`，不要写 Style Overrides；写入 `Story Visual Identity` / `Asset Registry`。
- 如果主题必须影响整页舞台背景、重点色或图表 palette，才写最小 Style Overrides。
- 需要改变字体、字号、间距、圆角、layout、内部 class 或图表容器尺寸：不要用 Style Overrides，回到 preset / plan / build 结构判断。
- 不要读取具体 preset md 来做“差量修改”。Style Overrides 是明确覆盖值，不是继承体系。

## 覆盖粒度

只写用户明确要求、且 preset 摘要无法表达的部分：

- 明确要求品牌色、重点色或文字色：写 `page_tokens`。
- 明确要求图表色板或领域配色进入图表：写 `chart_palette`。
- 明确要求场景氛围、活动感、舞台感或主视觉背景：写 `theme_tokens.--story-stage-background`。
- 只有用户明确要求面板质感、边框或 glow 与主题一致时，才补 surface / shadow token。

不要为了“完整主题”填满所有字段；不要根据具体 preset 的默认 token 做差量推断。

## 支持内容

`### Style Overrides` 只支持一个 JSON block。所有顶层字段和子字段都可选；只写确实需要覆盖的字段，不要为了完整而填满。

```json
{
  "page_tokens": {
    "--accent": "<6-digit-hex>",
    "--text-primary": "<6-digit-hex>",
    "--text-secondary": "<6-digit-hex>"
  },
  "chart_palette": {
    "categorical": ["<6-digit-hex>", "<6-digit-hex>", "<6-digit-hex>", "<6-digit-hex>"],
    "linearColor": ["<6-digit-hex>", "<6-digit-hex>"]
  },
  "theme_tokens": {
    "--story-stage-background": "<css-background-value>",
    "--story-surface-background": "<css-color-or-background-value>",
    "--story-surface-border-color": "<css-color-value>",
    "--story-surface-shadow": "<css-box-shadow-value>",
    "--story-emphasis-shadow": "<css-text-shadow-value>"
  }
}
```

脚本只识别示例中的顶层字段和子字段；其他字段会 fail fast。`page_tokens` 与 `chart_palette` 只接受 6 位 hex；`chart_palette.categorical` 需要 4-8 个颜色，`linearColor` 固定 2 个颜色。`theme_tokens` 值必须是明确可执行的 CSS value 字符串。

## Theme Token 含义

| Token | 用途 |
|---|---|
| `--story-stage-background` | 开场舞台 / PPT 页面背景氛围 |
| `--story-surface-background` | 卡片、面板、图表外框等 surface 背景 |
| `--story-surface-border-color` | surface 边框颜色 |
| `--story-surface-shadow` | surface 阴影或 glow |
| `--story-emphasis-shadow` | 重点数字、强调文本的 glow |

不要写第二个代码块。Style Overrides 不是自由 CSS API，禁止内部 class、id selector、`stage {}`、`.deck-slide {}` 或任意样式规则；`theme_tokens` 值禁止 `!important`、`url(...)`、`@import`、`expression(...)`、`var(...)`。

## Build 映射

同一份 plan 语法同时适用于 HTML story 和 Web-PPT：

- `scripts/preset_resolver.py` 只解析 `### Style Overrides` 小节，验证 JSON 和 5 个主题 token。
- `build-html/scripts/prepare_story_head.py` 把 `--story-*` 映射到 HTML 的无图片开场舞台、component surface token 和已有重点色文本 glow。
- `build-ppt/scripts/prepare_story_head.py` 把 `--story-*` 映射到 deck stage、deck surface、deck line/shadow 和已有重点色文本 glow。
- `compose_story.py` 只读取已生成的 `runtime/story-head.html`，不重新解释颜色、CSS 或 preset。
