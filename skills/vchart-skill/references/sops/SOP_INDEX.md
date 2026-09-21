# SOP 排查指南索引

## 目录说明

所有 SOP 文件均存放在本文件所在的 `sops/` 目录下。加载 SOP 时，**仅读取本目录下的文件，不要跨目录读取 `workflows/`、`references/`、`scripts/` 等其他目录中的文件**。

```
sops/
├── SOP_INDEX.md                    ← 本文件（索引 + 路由表）
├── cdn-script-adaption.md          ← CDN 环境适配 SOP（HTML Script 引入）
├── tooltip-crosshair-sync.md       ← 多图表联动 SOP
├── tooltip-usage.md                ← Tooltip 配置与使用 SOP
├── format-method.md                ← 文本格式化 SOP
└── ...                             ← 后续新增的 SOP 文件
```

若无匹配 SOP，走 `workflows/` 下的通用场景流程。

---

## SOP 路由表

> **本路由表由 Workflow 内部按需调用，也由 SOP 内部的语义锚点触发。** 当 Workflow 执行到 `🔍 SOP 检索点` 标记的步骤，或 SOP 内部遇到 `🔍 深入排查` 标记时，将当前子问题的关键词与下表匹配。命中则加载对应 SOP 获取精准方案；未命中则继续当前流程自身逻辑。

**匹配规则**：
1. **关键词匹配**：当前子问题涉及"触发关键词"列中的任一词
2. **意图匹配**：当前子问题的场景与"适用场景"描述吻合
3. **优先级**：同时匹配多个 SOP 时，按表中顺序优先匹配第一个
4. **特殊规则**：`cdn-script-adaption.md` 在输出 HTML 文件时**自动触发**，无需等待检索点
5. **SOP 独立性**：每个 SOP 只负责自身的固定流程。当流程中某个步骤可被其他 SOP 细化时，通过本路由表索引，而非硬编码引用

### 诊断类

| SOP 文件 | 适用场景 | 触发关键词 |
|----------|---------|-----------|
| `tooltip-crosshair-sync.md` | 多图表之间 Tooltip / Crosshair 联动不生效、只显示一个 Tooltip、setDimensionIndex 不工作 | tooltip联动、crosshair不显示、setDimensionIndex、uniqueTooltip、dimensionHover、多图联动、tooltip只显示一个、多图表同步、联动不生效 |
| `tooltip-usage.md` | Tooltip 不显示、内容错误、样式自定义、触发方式配置、mark/dimension 类型选择、自定义渲染、tooltip 内容异常 | tooltip配置、tooltip不显示、tooltip内容、tooltip样式、tooltip自定义、mark tooltip、dimension tooltip、activeType、trigger、tooltip位置、tooltip格式、提示框、悬浮提示、keyFormatter、valueFormatter、tooltip 内容异常、tooltip 内容不正确 |

### 格式与配置类

| SOP 文件 | 适用场景 | 触发关键词 |
|----------|---------|-----------|
| `format-method.md` | 文本格式化：formatter 模板与 formatMethod 回调、标签/坐标轴/图例/tooltip 格式化、数值千分位/百分比/时间格式、富文本标签、datum.value vs datum.label 陷阱 | formatMethod、formatter、格式化、格式化方法、百分比显示、数值格式、千分位、toLocaleString、富文本、rich text、标签显示格式、文本模板、标签内容自定义、序列化、d3-format、时间格式化、datum.value、datum.label、registerFormatPlugin、keyFormatter、valueFormatter、格式化不生效 |

### 环境适配类

| SOP 文件 | 适用场景 | 触发关键词 |
|----------|---------|-----------|
| `cdn-script-adaption.md` | CDN 环境适配：输出 HTML 时将 npm 示例代码转换为 CDN 兼容写法（构造函数、静态方法、globalConfig、ThemeManager、注册函数） | CDN、HTML、script标签、VChart.default、VChart is not a constructor、useRegisters is not a function、globalConfig、ThemeManager、UMD |

<!-- 新增 SOP 时：1.确定分类  2.在对应分类表格追加一行  3.SOP 文件放在本目录下，文件名使用小写+连字符 -->

---

## SOP 嵌套机制

```
用户问题
  ↓
SKILL.md 统一路由：场景识别 → 分发到对应 Workflow
  ↓
Workflow 执行到 🔍 SOP 检索点
  ↓
扫描本路由表 → 命中父 SOP
  ↓
父 SOP 按自身流程执行
  ↓ 遇到 "🔍 深入排查" 语义锚点
  ├─ 锚点描述问题现象 + 语义关键词
  ├─ Agent 携带关键词回查本路由表
  ├─ 命中子 SOP → 加载并执行
  ├─ 子 SOP 完成后返回父 SOP 继续下一步
  └─ 未命中 → 父 SOP 自行处理或使用 references 知识库
```

**语义锚点规范**：

父 SOP 中的语义锚点使用以下固定格式：

```markdown
> 🔍 **深入排查**：若 [问题现象描述]，
> 此问题超出本 SOP 范围。应从 SOP 路由（SOP_INDEX.md）中检索
> **[语义关键词1]** 或 **[语义关键词2]** 相关的 SOP 继续排查。
```

**关键原则**：
- 锚点描述的是**问题现象**，不是子 SOP 文件名
- 语义关键词应能命中 SOP_INDEX 路由表中的触发关键词
- 父 SOP 不感知子 SOP 的存在，子 SOP 增删不影响父 SOP
