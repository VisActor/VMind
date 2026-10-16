# 场景二处理流程：配置生成

## 适用情况

**识别信号**：

- 用户希望从 0 到 1 创建图表（提供描述/数据结构）
- 用户已有 spec，希望添加/修改某个功能点
- 用户问"如何配置 xxx"、"怎么实现 xxx 效果"

## 模式分类

- **完整生成模式**：用户无现有 spec，需要生成完整配置
- **增量生成模式**：用户有现有 spec，需要生成增量配置

## P0 执行约束

- 禁止使用 `find`、`grep`、`ls`
- 本地知识访问统一遵循 [直达路径路由与工具约束](../references/DIRECT_PATH_ROUTING.md)
- 生成场景推荐读取顺序：
  1. `../references/chart/chart-type-guide.md`
  2. `../references/topkey/all_common.json`
  3. `../references/topkey/[type].json`
  4. `../references/type-meta/[type].json`
  5. 只在固定 example 路径表里选择 1 个本地 example
  6. 如有复杂属性，再读取 1 个 `type-details`
- 如果本地 example 精确路径不明确：
  - 优先本地 Example 检索
  - 或直接基于 `topkey + type-meta` 生成
  - 不要做本地目录扫描

## 通用步骤

创建或更新产物均遵循 [校验与交付](artifact-delivery.md)。按 SOP 路由表核对数据契约，再设置可选配置。

### 步骤 1：意图识别

**使用 `topkey/*.json` 将用户自然语言映射到配置项**：

| 用户表达                    | 匹配的配置项                  | 来源                              |
| --------------------------- | ----------------------------- | --------------------------------- |
| "加个标签" / "显示数值"     | `label`                       | references/topkey/[type].json     |
| "加条参考线" / "画条基准线" | `markLine`                    | references/topkey/[type].json     |
| "堆叠起来" / "累加显示"     | `stack: true`                 | references/topkey/[type].json     |
| "分组对比"                  | `seriesField` + `xField` 数组 | references/topkey/[type].json     |
| "加个图例"                  | `legends`                     | references/topkey/all_common.json |
| "鼠标悬浮提示"              | `tooltip`                     | references/topkey/all_common.json |
| "坐标轴标题"                | `axes[].title`                | references/topkey/all_common.json |

### 步骤 2：确定生成模式

```
if (用户提供了现有 spec) {
  → 增量生成模式
} else {
  → 完整生成模式
}
```

---

## 完整生成模式

### 步骤 2a-1：图表类型推断

基于用户描述和数据特征，参考 `../references/chart/chart-type-guide.md` 推断：

| 数据特征        | 可视化目的  | 推荐类型                     |
| --------------- | ----------- | ---------------------------- |
| 类目 + 数值     | 比较大小    | `bar`                        |
| 类目 + 数值     | 占比分布    | `pie`                        |
| 时间序列 + 数值 | 趋势变化    | `line`                       |
| 时间序列 + 数值 | 累积量感    | `area`                       |
| 两个数值维度    | 相关性/分布 | `scatter`                    |
| 多维度评分      | 综合对比    | `radar`                      |
| 层级数据        | 占比构成    | `treemap` / `sunburst`       |
| 流向数据        | 流量分配    | `sankey`                     |
| 流程阶段        | 转化漏斗    | `funnel`                     |
| 进度数据        | 完成度      | `gauge` / `circularProgress` |

### 步骤 2a-2：与用户确认

```markdown
## 图表类型推荐

基于您的需求，我推荐使用 **[图表类型中文名]**（`type: '[类型标识]'`）

**推荐理由**：[简要说明]

**是否确认？** 如需调整请告诉我。
```

### 步骤 2a-3：构建完整 Spec

> **🔍 SOP 检索点**：在构建 Spec 前，直接读取 `references/sops/SOP_INDEX.md` 路由表。将用户需求中涉及的具体功能关键词（如"百分比"、"formatter"、"tooltip格式化"等）与路由表匹配。命中则加载对应 SOP，按 SOP 指导生成该部分配置；未命中则使用 type-meta + type-details 常规流程。

在构建 Spec 前，先调用 `python3 scripts/search_knowledge.py --kind examples --query "<图表类型和需求描述>" --limit 3` 检索最相近的 Example；如无结果或相关性不足，再回退到本地固定 example 路径，具体见 [直达路径路由与工具约束](../references/DIRECT_PATH_ROUTING.md)。


**使用 `type-meta/[图表类型].json` 构建配置结构**：

1. 从 `inheritanceTree` 获取完整的可用属性列表
2. 填充 `required: true` 的必填字段
3. 根据用户需求添加可选配置
4. 对于复杂类型（`isSimple: false`），查阅 `type-details/[类型名].md`

```javascript
const spec = {
  type: '[图表类型]',
  data: [
    {
      id: 'dataId',
      values: [
        /* 用户数据 */
      ]
    }
  ],
  // 必填字段（从 type-meta 获取）
  [requiredField]: [value],

  // 用户需求的配置项
  [配置项]: {
    // 从 type-details 获取类型定义
  }
};

const vchart = new VChart(spec, { dom: 'container' });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderSync();
```

### 步骤 2a-4：输出配置结果

根据用户需求和对话上下文，灵活选择输出格式：

#### 输出格式选择

```
if (用户明确要求"可运行的demo" || "能直接打开的文件" || "完整的HTML") {
  → 输出完整 HTML 文件（使用 Python 脚本生成）
} else if (用户询问"配置怎么写" || "代码示例" || 在讨论具体配置) {
  → 输出 JavaScript spec 代码
} else {
  → 默认输出 JavaScript spec 代码（更简洁、易于集成）
}
```

#### 格式一：输出 JavaScript 代码（推荐）

直接输出可用的 VChart spec 配置代码。

**输出示例**：

````markdown
## 图表生成结果

基于您的需求，生成了以下 [图表类型] 配置。

**配置说明**：

- [关键配置点说明]

**完整代码**：

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 }
    ]
  },
  xField: 'category',
  yField: 'value',
  label: {
    visible: true,
    position: 'top'
  }
};

const vchart = new VChart(spec, { dom: 'chart' });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderAsync();
```
````

#### 格式二：输出完整 HTML（按需）

> **🚨 CDN 环境适配**：输出 HTML 时，必须按 `references/sops/cdn-script-adaption.md` 执行全部转换规则（构造函数、静态方法、globalConfig、ThemeManager、注册函数）。


当用户需要完整的可运行演示时，使用 `template/demo.html` + Python 脚本生成。

````

---

## 增量生成模式

### 步骤 2b-1：定位配置项

**根据用户意图，使用 topkey 定位配置项名称**：

```javascript
// 用户说："我想给柱子加个标签"
// references/topkey/bar.json 中找到：
{
  "label": {
    "key": "label",
    "oneDesc": "标签相关配置,包括跟标签相关的引导线配置"
  }
}
// → 配置项为 label
````

### 步骤 2b-2：查询类型定义

> **🔍 SOP 检索点**：在查询类型定义时，同步直接读取 `references/sops/SOP_INDEX.md` 路由表。如果用户的增量修改需求涉及 SOP 覆盖的领域（如格式化、tooltip 配置、多图联动），优先加载 SOP 获取精准配置方案。

如用户的增量修改需求与现有图表示例高度相关，也可先调用 `python3 scripts/search_knowledge.py --kind examples --query "<图表类型和增量需求>" --limit 3` 检索相似 Example，再结合 `type-details` 完成增量配置。本地回退时只允许读取固定 example 路径。


**使用 `type-details/[类型名]-Type-Definition.md` 获取详细配置**：

```javascript
// 查询 type-details/ILabelSpec-Type-Definition.md
// 获取完整的 ILabelSpec 接口定义
```

### 步骤 2b-3：输出配置结果

根据用户需求和对话上下文，灵活选择输出格式（同完整生成模式）。

**情况 A：用户提供了完整 spec**

- 输出增量配置的代码片段
- 或输出整合后的完整 spec（按需使用 HTML 格式）

**情况 B：用户只描述功能需求，未提供 spec**

- **Mock 数据**：构建合理的模拟数据（至少 5 条）
- **完整 spec**：生成包含该功能的完整图表配置
- 默认输出 JavaScript 代码，按需输出 HTML

#### 使用 Python 脚本生成示例 HTML（按需）

当用户需要完整的可运行演示时：

推荐使用 `scripts/generate_demo_html.py` 脚本，通过 spec 文件生成可运行 HTML。

> 💡 **参数详情**：参见 [脚本参数参考](../references/SCRIPT_PARAMS_REFERENCE.md#generate_demo_htmlpy)

#### 脚本使用示例

**最小示例**（使用默认参数）：

```bash
python3 skills/vchart-skill/scripts/generate_demo_html.py --spec-file spec.js --output-dir ./chart-output
```

**完整示例**（自定义所有参数）：

```bash
python3 scripts/generate_demo_html.py \
  --title "功能实现示例" \
  --desc "基于需求生成的配置方案" \
  --feature "实现了标签展示与 tooltip 交互" \
  --tips "可调整 xField/yField、label、tooltip 与配色方案" \
  --spec-file spec.js \
  --output-dir ./chart-output
```

#### 主要参数

- `--spec-file`：包含完整 VChart spec 配置的 JS 文件
- `--feature`：主要功能说明（描述图表实现的核心特性）
- `--tips`：编辑提示（指导用户可调整的配置项）
- `--output-dir`：调用方输出目录；接受绝对路径或相对于命令当前工作目录的路径

示例中的 `./chart-output` 应替换为调用方指定的目录；文件交付遵循 [校验与交付流程](artifact-delivery.md)。

#### Spec 文件结构

spec 文件应包含完整的 VChart 配置代码（JavaScript 格式）：

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
      { category: 'D', value: 12 },
      { category: 'E', value: 18 }
    ]
  },
  xField: 'category',
  yField: 'value',
  label: {
    visible: true,
    style: { fill: '#333' }
  },
  tooltip: {
    visible: true
  }
};
```

#### 实际使用示例

**步骤 1：创建 spec 文件 `spec.js`**

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
      { category: 'D', value: 12 },
      { category: 'E', value: 18 }
    ]
  },
  xField: 'category',
  yField: 'value',
  label: { visible: true }
};
```

**步骤 2：运行脚本生成 HTML**

```bash
python3 skills/vchart-skill/scripts/generate_demo_html.py \
  --title "柱状图标签功能示例" \
  --desc "展示如何配置数据标签" \
  --feature "在柱子上显示数值标签" \
  --tips "可修改 label.position 或 label.style 调整样式" \
  --spec-file spec.js \
  --output-dir ./chart-output
```

**步骤 3：查看生成结果**

在浏览器中打开 `./chart-output/demo.html` 查看可运行示例。

**输出格式**：

````markdown
## 功能实现：[功能名称]

**配置说明**：

- `[属性1]`：[类型] - [说明]
- `[属性2]`：[类型] - [说明]

**可运行示例**：

将以下内容保存为 `.html`，直接在浏览器打开：

```html
[使用 template/demo.html 填充后的完整 HTML]
```
````

## 生成模式选择指南

### 完整生成模式适用场景

- 用户是新手，没有现有 spec
- 用户提供需求描述和数据，希望从零开始
- 用户说"帮我做一个 xxx 图表"

### 增量生成模式适用场景

- 用户已有基础图表配置
- 用户希望在现有图表上添加特定功能
- 用户提供当前 spec，询问如何修改

---

## React 场景补充

- 若用户明确使用 React-VChart，输出时应提供 React 代码或指向 `template/diagnosis-react.html` 的可运行 HTML，说明依赖安装（`npm i @visactor/react-vchart @visactor/vchart`）。
- 如用户不接受纯 JS 示例，可同时给出 React 版本与 JS 版本，标注差异。

---

## 相关资源

- [配置项索引](../references/topkey/) - 快速查找配置项
- [示例库](../references/examples/) - 常用图表完整示例
- [类型详情](../references/type-details/) - 详细的类型定义
- [图表类型指南](../references/chart/chart-type-guide.md) - 各类图表特性参考
