# Web-PPT Build Module

## 构建目标

本模块在 Phase 4 目标为 PPT / slides 时加载，产物是 web-ppt 形式的单个 HTML deck：`runtime/output-ppt.html`。它不是 `.pptx`，也不是普通 HTML story report。

输入：
- `runtime/plan.md`
- `runtime/dataset_map.json`
- plan 声明的 Asset Registry 与 Charts

输出：
- `runtime/story-head.html`
- `runtime/spec_map.json`
- `runtime/resolved_asset_bindings.json`
- `runtime/output-ppt.html`

Build 只把已确认的 plan 编译成演示稿。不要重新发现洞察、改写 chapter 顺序、重排故事弧线或改变 plan pattern。

下方命令中的 `$SKILL_DIR` 表示当前 data-storytelling skill 根目录。

## Fail Fast 红线

- Web-PPT 使用固定 `scripts/compose_story.py --target ppt` 组装；Agent 只写 `runtime/slides.html` 和 `runtime/page.json`，不生成 Python 脚本或最终 HTML shell。
- 如果 plan 声明了 `Charts`，最终输出必须包含对应 `data-chart-id` 的 `chart-frame`。
- 缺少 `story-head.html`、`spec_map.json`、`resolved_asset_bindings.json`、`slides.html`、`page.json` 或 `output-ppt.html` 时停止。
- `validate_js.py runtime/output-ppt.html` 未通过时不交付。

## 读取边界

- `Chapter Outline` 决定内容顺序、证据来源和每章主旨。
- `Story Breaks` 是 PPT-only 节奏标记，可渲染为独立过渡页；它不是 chapter，不承载 `Evidence / Claim / Charts`。合法 `type` 为 `divider / pivot / pause / recap`。
- 未显式提供 `Story Breaks` 时，不自动发明独立过渡页。
- chapter `Transition` 是章节内 handoff 文案，不自动等于过渡页。
- `Style Preset` 只传给 head helper；`### Style Overrides` 只由 head helper 解析并映射为 Web-PPT theme layer。Build 不自行解释颜色、图表色板、`--story-*` 字段或 preset 内部实现，也不要发明新 preset。
- `scrollytelling` 在 Web-PPT 中映射为单张 `scroll-scene` slide。Build 只在 plan 明确选择 `scrollytelling` 时使用它；不要把普通 `chart-narrative` 临时升级成 scrolling。
- `Charts` 使用共享 [references/chart-contract.md](../references/chart-contract.md)。PPT 没有第二套 chart schema，不接受 `chartId:` / `fields:` / 自由 `chartType` 写法。

PPT Build 参考文件：

- `slide-recipes.md`：plan pattern / Story Breaks 到 slide type sequence，以及每种 slide type 的阅读任务；顶层 Methodology 仅在需要展示口径时生成系统页
- `layout-recipes.md`：合法 `data-layout` 与整页结构选择；不改变 slide type、证据边界或文案含义
- `slide-markup.md`：固定 slide shell、primitive 和 canonical markup；内容选择按 plan 与 `slide-recipes.md` 处理
- `asset-handling.md`：SVG / image / 用户素材的合法来源、角色与缺失策略
- `build-ppt/scripts/prepare_story_head.py`：生成 `runtime/story-head.html`
- [page-composition.md](../references/page-composition.md)：共享固定组装输入与素材引用合同

## 可执行脚本

PPT Build 可调用的 shared workflow 入口只限：

- `scripts/assemble_story_specs.py`：将 Agent 生成的配置与 plan / 数据本地组装为 `spec_map.json`
- `build-ppt/scripts/prepare_story_head.py`：根据 `Style Preset` 和 plan-level `Style Overrides` 生成 `story-head.html`
- `scripts/normalize_story_assets.py`：生成 `resolved_asset_bindings.json`
- `scripts/compose_story.py`：固定组装与素材绑定
- `scripts/validate_js.py`：校验 `runtime/output-ppt.html`

## Generated Image Asset Rule

如果 `plan.md` 声明被章节引用的 generated image asset，读取并执行共享 [image-generation.md](../references/image-generation.md)，使用当前宿主 Agent 的生图能力，将真实图片落盘后再归一化。素材角色与 slide 落位规则见 `asset-handling.md`。

## 构建流程

固定顺序：

1. 读 `plan.md`，确认目标为 PPT，且任何 `scrollytelling` 章节都同时具备 `Charts` 主图和 step progression。
2. 先读取参考文件的总览部分：`slide-recipes.md` 的全局规则、`Source Map`、`Ending Output` 和 `System Slides`，`layout-recipes.md` 的 `Layout Map` 和选择规则，`slide-markup.md` 的组合边界和 `Slide Type Primitive Map`；有 assets 时再读 `asset-handling.md` 的输入来源、Asset 角色和缺失策略。
3. 列出 slide 清单，为每页记录 `source`、`slideType`、`layout`、chart id、asset role 和 plan 来源；显式 `Story Breaks` 与最终 `Role: ending` 必须进入清单，顶层 `Methodology` 必须用于口径边界判断，但不默认生成 slide。
4. 对每张 slide，读取对应局部小节：`slide-recipes.md` 的 `### {slideType}`、`layout-recipes.md` 的 `### {layout}`、`slide-markup.md` 的对应 canonical markup 示例或 primitive map；有素材时读取 `asset-handling.md` 中对应 role、SVG / Image 使用和缺失策略。若小节定位失败、规则冲突或需要新增结构，回退读取对应 reference 全文；仍无法解决则停止。
5. 若 plan 有 `Charts`，先确认它们使用 canonical chart contract。没有 parseable chart id 时停止并回到 plan 修正。
6. 有 Charts 时读取 [vseed-generation.md](../references/vseed-generation.md)，由当前 Agent 写 `runtime/chart_specs.json`，再按该 reference 的命令执行 `assemble_story_specs.py --specs-json ...` 本地组装 `spec_map.json`。缺图或硬校验失败时修正配置，不用基础骨架兜底；标注缺失的 `ANNOTATION_MISSING` 是非阻塞 warning，按 reference 决定修正或记录未实现项。无 Charts 时省略 `--specs-json`，仍生成空 `spec_map.json`。
7. 执行素材生成和 `normalize_story_assets.py`，写出空或非空的 `resolved_asset_bindings.json`。
8. 执行 `build-ppt/scripts/prepare_story_head.py`，写出 `runtime/story-head.html`。
9. 按 [page-composition.md](../references/page-composition.md) 写 `runtime/slides.html` 和 `runtime/page.json`。
10. 执行固定 `scripts/compose_story.py --target ppt --runtime-dir ... --body-file .../slides.html --config-file .../page.json --output .../output-ppt.html`。
11. 执行 `validate_js.py runtime/output-ppt.html`，失败后按 stderr 修复并重跑。

Story head 固定命令形态：

```bash
python3 "$SKILL_DIR/build-ppt/scripts/prepare_story_head.py" \
  --skill-dir "$SKILL_DIR" \
  --preset "Swiss Modern" \
  --plan-file /path/to/runtime/plan.md \
  --head-output /path/to/runtime/story-head.html
```

`--preset` 使用 `Story Meta.Style Preset` 的值；不要省略 `--skill-dir` 或 `--plan-file`。

Deck 顺序：

1. Opening slide：来自 `Story Meta` + Ch1 hook，必须 title-led；只使用 `cover`、`hero-stat` 或 `hero-image`。若使用 `hero-stat`，必须是 `monolith`，且保留 headline，不能做裸数字首页。
2. Chapter slides：每个 chapter 生成 1 张或多张 slide；拆页只能解决密度，不改变章节主旨。
3. Break slides：显式 `Story Breaks` 插入到 `after` 指定 chapter 后。
4. Methodology slide：可选系统页，来自 plan 顶层 `Methodology`，放在收束前。
5. Ending slide：最后一个 `Role: ending` 输出收束表达。

## Slide 合同

每张 slide 必须同时声明：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="{layout}" data-slide-label="{short label}">
  <div class="slide-inner">
    ...
  </div>
</section>
```

- `data-slide-type` 必须来自 `slide-recipes.md`。
- `data-layout` 必须来自 `layout-recipes.md`。
- `data-stat-stage` 是 Build-only 内部属性，只允许用于 `data-slide-type="hero-stat"`；它不写入 plan，也不作为用户可配字段。合法值以 `slide-markup.md` 和 validator 为准。
- 不要输出未定义的 slide type、layout、slot 或 wrapper。
- 不要选择 page-level treatment；视觉气质由 slide type、layout 和 Style Preset 派生。

## 文字与容量

PPT 的可见标题不是 HTML section heading 的等比例放大。进入 `slides.html` 前先做 Text Pass：

- 每页 `headline` 只保留一个判断、问题或行动方向。
- 中文 cover / transition headline 建议 18-24 个汉字以内；普通内容页建议 12-18 个汉字以内。
- 解释放到 `cue`、`reading-caption`、`takeaway` 或下一张 slide。
- 如果压缩标题会改变含义，拆页或回到 plan 的 Title Pass；不要在 Build 阶段发明新结论。
- 需要强调单个数字或关键词时，可选使用 `.tone-accent`；只允许用于 `cover / transition / closing / hero-stat`，且只给真正的锚点上色，不要把整句 headline、整组 KPI 或整页正文都染成 accent。

进入 `slides.html` 前再做 Capacity Pass：

- 先按 slide type 估算标题、主证据、列表项和辅助文案的数量；超出上限时拆页，不用临时样式或隐藏内容来过关。
- `headline` 允许 1-2 行；超过 2 行优先改写或拆页。
- `rowline-board` 总行数建议 3-5 行，硬上限 6 行；一页如果有两组 rowline，每组最多 3 行。超过上限拆成 “已准备好 / 需治理” 两页。
- `comparison` 一页只承载一个主对照维度；如果对照两侧各有长清单，使用 `rowline-board` 并按规则拆页；如果携带 chart evidence，只允许 1 张主图 + 1 句图表读法，并把图表读法连回差异结论。
- action 页默认 3 个行动项，硬上限 5 个；每个行动项标题是一句短动词短语，原因解释只保留一句。
- cover / hero / transition 使用背景素材时，标题必须仍是第一阅读对象；如果背景和标题抢注意力，换用更低存在感素材或拆成证据页。

密度硬上限：

| Slide type | 上限 |
|---|---|
| `cover` / `transition` | 1 个主标题 + 1 个辅助 cue |
| `hero-stat` | 1 个标题 + 1 个主数字 + 1 个读法 |
| `hero-image` | 1 张背景图 + 1 个主标题 + 1 个 cue |
| `chart-read` | 1 个主图 + 1 个标题 + 1 个读法 |
| `scroll-scene` | 1 个主图 + 2 个以上 steps；每次只激活 1 个 step |
| `metric-board` | 2-4 个 KPI + 1 个短 takeaway |
| `comparison` | 2 个对照面板或 1 个差异表述；chart-backed 时可加 1 个主图 + 1 句图表读法 |
| `quote` | 1 条 quote / excerpt + attribution + 1 个读法 |
| `quote-pair` | 2 条 quote + attribution + 1 个共同读法 |
| `image-grid` | 2-6 张图片 / 截图 + caption + 1 个读法 |
| `text-image` | 1 个主图或 artifact + 1 个读法 |
| `process-flow` | 3-6 个步骤 + 1 个 takeaway |
| `action` | 2-5 个行动项 |
| `methodology` | Data Source + Time Range + Caveats |
| `closing` | 1 个最终 headline + 可选 1 个 cue / meta |

## Deck 边界

每张 slide 必须满足：

- 使用本模块定义的 slide type、layout、slot 和固定 composer。
- 不输出自定义 shell、单页样式补丁、临时 wrapper 或未登记 class。
- `scroll-scene` 只使用内置 step scene；内容放不下时拆页。
- 图表、图片、artifact 和列表只通过合法 slot 进入页面。

## 交互边界

Build 不配置页面效果，不输出效果相关的 `data-*` 属性、class、逐页脚本或操作控件。

## Compose 合同

按 [page-composition.md](../references/page-composition.md) 生成 slides.html 与 page.json，并调用固定 composer。脚本负责 deck shell、依赖与初始化；Agent 不复制、改写 Python，不拼接 data URI 或属性转义。

## 交付检查

交付前执行以下检查：

- [ ] 固定流程已执行，`story-head.html`、`spec_map.json`、`resolved_asset_bindings.json`、`slides.html`、`page.json` 和 `output-ppt.html` 都存在
- [ ] 由固定 compose_story.py 组装，没有重写 deck shell 或 runtime
- [ ] slides.html 是正文片段，素材由声明式引用绑定，背景图片实际可见
- [ ] 每张 slide 都有合法 `data-slide-type`、`data-layout` 和固定 shell；没有未登记 wrapper、slot、class 或 page-level treatment
- [ ] 图表来自 `spec_map.json`；plan 声明 Charts 时，`spec_map.json` 非空，最终 HTML 包含对应 `data-chart-id` 的 `chart-frame`
- [ ] deck 保持 plan 的 chapter 顺序、Role、Pattern、Claim、Story Breaks 和顶层 Methodology 边界；可见数字、单位、时间范围与 `plan.md` / Key Numbers 精确匹配
- [ ] 证据和素材只来自 plan、`spec_map.json` 与 `resolved_asset_bindings.json`；没有新增 quote、临时图片、流程步骤、asset prompt / brief、素材缺失说明、空 asset 容器或坏图片引用
- [ ] 最后一章有明确收束表达；`closing` 如存在，只出现一次且位于最后，`Story Breaks` 只出现在指定 chapter 之后且不新增数据结论
- [ ] 已执行 `validate_js.py runtime/output-ppt.html` 且通过
