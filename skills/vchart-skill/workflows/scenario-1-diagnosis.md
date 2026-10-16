# 场景一处理流程：问题诊断

## 适用情况

**识别信号**：

- 用户提供了现有代码并描述"不工作"、"报错"、"显示异常"
- 用户询问"有没有更好的方式"、"如何优化"
- 用户遇到性能问题或渲染问题
- 用户描述问题现象（可能有截图，可能无配置）

> **注意**：如用户使用 `@visactor/react-vchart` 库，请直接参考 [scenario-1-react.md](scenario-1-react.md)

## 模式分类

先读取已有上下文和当前源文件，不向用户索要已经提供的数据。纯解释可以只回答；一旦实际修改作品，必须按 [校验与交付](artifact-delivery.md) 返回本轮文件。诊断页不是修复后的图表，不能用诊断页代替用户要求修复的作品。

诊断以当前源码、校验错误和运行证据为依据，不能把猜测写成已确认原因。按 SOP 路由表读取对应数据契约，再决定修复。

```
if (用户提供了现有 spec 配置) {
  → 配置诊断模式：基于用户配置分析问题并修复
} else {
  → 描述诊断模式：根据用户描述/截图生成解决方案配置
}
```

## P0 执行约束

- 禁止使用 `find`、`grep`、`ls`
- 本地知识访问统一遵循 [直达路径路由与工具约束](../references/DIRECT_PATH_ROUTING.md)
- 诊断场景优先读取：
  1. `../references/chart/common-issues.md`
  2. `../references/sops/SOP_INDEX.md`
  3. `../references/type-meta/[type].json`
  4. 命中的固定 SOP
  5. 需要时再读取 1 个固定 example
- 如果图表类型已知，不允许再为 example 或配置文件做目录扫描

---

## 配置诊断模式（用户提供了 spec）

### 步骤 1a：收集信息

请用户提供：

1. 完整的 VChart spec 配置代码
2. 数据样本（至少 3-5 条）
3. 错误信息或异常表现描述
4. 期望的正确效果

### 快速错误匹配（优先于通用诊断流程）

在进入通用诊断前，先检查用户的错误信息是否命中以下已知模式。命中则直接给出修复方案，无需完整诊断流程。

| 错误信息 / 症状                                                                 | 根因                                                                                                           | 修复方案                                                                                                                                 |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot read properties of undefined (reading 'transformerConstructor')`        | spec 中存在联合类型属性（如 gauge 背景系列），缺少 `type` 字段导致 VChart 无法查找对应的 SeriesSpecTransformer | 在联合类型配置对象中添加 `type` 字段。如 gauge 背景：添加 `type: 'gauge'`。详见 `references/examples/gauge/basic-gauge.md`               |
| Tooltip 中 formatter 模板字符串无效果（显示为原始文本如 `{value:,.0f}`）        | 模板写在了 `key`/`value` 字段中，应使用 `keyFormatter`/`valueFormatter` 专用字段                               | 将 `key: '{...}'` 改为 `keyFormatter: '{...}'`，将 `value: '{...}'` 改为 `valueFormatter: '{...}'`。详见 SOP `format-method.md` Step 3.5 |
| `VChart is not a constructor` 或 `VChart.bindbindbindbindCtx is not a function` | CDN 环境下直接使用 `new VChart()` 而不是 `new VChart.default()`                                                | CDN/HTML 环境中构造函数在 `VChart.default`：`new VChart.default(spec, { dom })`                                                          |
| 图表渲染但数据为空 / 数据不显示                                                 | xField/yField 与 data.values 中的字段名不一致（大小写、拼写）                                                  | 检查字段映射一致性。详见 `references/chart/common-issues.md` #1                                                                          |
| `registerFormatPlugin` / formatter 无效果                                       | 使用 formatter 模板但未注册格式化插件                                                                          | CDN：`VChart.default.useRegisters([VChart.registerFormatPlugin])`；npm：`VChart.useRegisters([registerFormatPlugin])`                    |

> 如果未命中上表，继续下方通用诊断流程。

### 步骤 2a：诊断分析

> **🔍 SOP 检索点**：在开始诊断分析前，先调用 `python3 scripts/search_knowledge.py --kind sops --query "<用户问题描述>" --limit 2` 进行关键词检索；同时直接读取 `references/sops/SOP_INDEX.md` 路由表做关键词匹配。优先使用最相关的结果，未命中则使用下方通用诊断流程。

使用 `type-meta/[图表类型].json` 检查配置完整性：

```
1. **类型检查**：spec.type 是否为有效图表类型
2. **必填字段**：对照 type-meta 检查 required: true 的字段
3. **字段映射**：xField/yField/valueField 等是否与数据字段匹配
4. **数据格式**：data 配置是否符合 IData 规范
5. **类型约束**：属性值是否符合 type-details 中的类型定义
6. **版本兼容**：确认 API 是否适用于 2.0.0+ 版本
```

---

## 描述诊断模式（用户未提供 spec）

### 步骤 1b：理解问题

根据用户描述/截图识别：

1. **问题类型**：布局、样式、交互、性能、数据显示等
2. **图表类型**：推断用户使用的图表类型
3. **期望效果**：用户想要达到的目标

### 步骤 2b：构建解决方案

> **🔍 SOP 检索点**：在构建解决方案前，先调用 `python3 scripts/search_knowledge.py --kind sops --query "<用户描述的问题>" --limit 2` 进行关键词检索；同时直接读取 `references/sops/SOP_INDEX.md` 路由表做关键词匹配。命中则加载对应 SOP 获取精准解决方案，未命中则使用通用知识库构建方案。

1. **Mock 数据**：根据问题场景构建合理的模拟数据（至少 5 条）
2. **生成 spec**：创建能体现解决方案的完整配置
3. **对比方案**：如适用，提供问题现象 vs 修复后的对比

---

## 输出诊断结果

根据用户需求和对话上下文，灵活选择输出格式：

### 输出格式选择

**判断依据**：

```
if (用户明确要求"可运行的demo" || "能直接打开的文件" || "完整的HTML") {
  → 输出完整 HTML 文件
} else if (用户询问"配置怎么写" || "代码示例" || 在讨论具体配置) {
  → 输出 JavaScript spec 代码
} else {
  → 默认输出 JavaScript spec 代码（更简洁、易于集成）
}
```

### 格式一：输出 JavaScript 代码（推荐）

直接输出可用的 VChart spec 配置代码，便于用户复制到项目中。

**配置诊断模式输出示例**：

````markdown
## 问题诊断

**问题**：图表 Y 轴没有数据显示，柱状图高度为 0

**原因**：yField 配置值为 "values"，但数据字段名为 "value"，字段名不匹配

**修复建议**：确保 xField/yField 与数据字段名严格一致

## 用户原始代码

```javascript
const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
    ],
  },
  xField: "category",
  yField: "values", // ❌ 错误：字段名不匹配
  label: {
    visible: true,
  },
};

const vchart = new VChart(spec, { dom: "chart" });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderAsync();
```

## 修复方案

```javascript
const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
    ],
  },
  xField: "category",
  yField: "value", // ✅ 修正：与数据字段名一致
  label: {
    visible: true,
  },
};

const vchart = new VChart(spec, { dom: "chart" });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderAsync();
```
````

**描述诊断模式输出示例**：

````markdown
## 问题诊断

**问题**：需要在柱状图上显示数据标签

**解决方案**：通过配置 `label` 属性实现数据标签显示

## 完整代码示例

```javascript
const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
      { category: "C", value: 15 },
    ],
  },
  xField: "category",
  yField: "value",
  label: {
    visible: true,
    position: "top",
    style: {
      fill: "#333",
    },
  },
};

const vchart = new VChart(spec, { dom: "chart" });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderAsync();
```
````

### 格式二：输出完整 HTML（按需）

> **🚨 CDN 环境适配**：输出 HTML 时，必须按 `references/sops/cdn-script-adaption.md` 执行全部转换规则（构造函数、静态方法、globalConfig、ThemeManager、注册函数）。

当用户需要完整的可运行演示时，使用 `template/diagnosis.html` 模板，通过 Python 脚本生成诊断 HTML。

#### 使用 Python 脚本生成诊断 HTML

推荐使用 `scripts/generate_diagnosis_html.py` 脚本，通过配置文件生成交互式诊断 HTML。

**脚本使用示例**：

```bash
# 最小示例
python3 skills/vchart-skill/scripts/generate_diagnosis_html.py --config-file config.js --output-dir ./chart-output

# 完整示例
python3 scripts/generate_diagnosis_html.py \
  --title "VChart 问题诊断报告" \
  --desc "基于用户配置的诊断与修复结果" \
  --config-file config.js \
  --output-dir ./chart-output
```

**主要参数**：

- `--config-file`：包含 `problemReview`/`diagnosis`/`solutions` 的 JS 配置文件
- `--title`：诊断报告标题（可选）
- `--output-dir`：调用方输出目录；接受绝对路径或相对于命令当前工作目录的路径

示例中的 `./chart-output` 应替换为调用方指定的目录；文件交付遵循 [校验与交付流程](artifact-delivery.md)。

#### 配置文件结构

配置文件需要包含三个 JavaScript 对象：

**1. problemReview（问题回顾）**

```javascript
const problemReview = {
  highlightLines: [11], // 可选：需要高亮的行号数组
  specCode: `[用户原始代码]`, // 完整 JS 代码字符串，可包含函数
};
```

**2. diagnosis（诊断分析）**

```javascript
const diagnosis = {
  problem: "[问题简述]",
  cause: "[原因分析]",
  suggestion: "[修复建议]", // 可选
};
```

**3. solutions（解决方案数组）**

```javascript
const solutions = [
  {
    title: "[方案标题]",
    description: "[方案描述]",
    highlightLines: [11], // 可选：需要高亮的行号数组
    specCode: `[修复代码]`, // 完整 JS 代码字符串，可包含函数
  },
  // 更多方案...
];
```

#### 实际使用示例

**步骤 1：创建配置文件 `config.js`**

```javascript
const problemReview = {
  highlightLines: [11],
  specCode: `const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 }
    ]
  },
  xField: "category",
  yField: "values",  // 问题行
  label: {
    visible: true,
    formatter: (d) => d.value + "%"
  }
};`,
};

const diagnosis = {
  problem: "图表 Y 轴没有数据显示，柱状图高度为 0",
  cause: 'yField 配置值为 "values"，但数据字段名为 "value"',
  suggestion: "确保 xField/yField 与数据字段名严格一致",
};

const solutions = [
  {
    title: "修正字段映射",
    description:
      '将 yField 的值从 "values" 修正为 "value"，与数据字段名保持一致。',
    highlightLines: [11],
    specCode: `const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 }
    ]
  },
  xField: "category",
  yField: "value",  // 修复后
  label: { visible: true }
};`,
  },
];
```

**步骤 2：运行脚本生成 HTML**

```bash
python3 skills/vchart-skill/scripts/generate_diagnosis_html.py \
  --title "字段映射错误诊断" \
  --desc "柱状图 Y 轴数据显示问题分析" \
  --config-file config.js \
  --output-dir ./chart-output
```

**步骤 3：查看生成结果**

在浏览器中打开生成的 HTML 文件，可以看到包含问题回顾、诊断分析和可编辑的解决方案的交互式页面。

#### 直接输出 HTML 代码（备选）

如果无法使用脚本，也可以直接输出完整的 HTML 代码：

````markdown
## 诊断方案（可运行）

将以下内容保存为 `.html` 文件，在浏览器中打开即可查看：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>VChart 诊断示例</title>
    <script src="https://unpkg.com/@visactor/vchart@2.0.21/build/index.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 600px; height: 400px;"></div>

    <script>
      // 问题代码示例
      const problemSpec = {
        type: "bar",
        data: {
          values: [
            { category: "A", value: 10 },
            { category: "B", value: 20 },
          ],
        },
        xField: "category",
        yField: "values", // 问题：字段名错误
      };

      // 修复后的代码
      const spec = {
        type: "bar",
        data: {
          values: [
            { category: "A", value: 10 },
            { category: "B", value: 20 },
          ],
        },
        xField: "category",
        yField: "value", // 修复：字段名正确
      };

      const vchart = new VChart.default(spec, { dom: "chart" });
      vchart.renderAsync();
    </script>
  </body>
</html>
```
````

## 常见问题速查

参考：`../references/chart/common-issues.md`

## 诊断清单

### 数据相关问题

| 问题现象     | 可能原因           | 检查项                               |
| ------------ | ------------------ | ------------------------------------ |
| 图表不显示   | 数据为空或格式错误 | `data.values` 是否为数组且非空       |
| 坐标轴无数据 | 字段映射错误       | `xField`/`yField` 是否匹配数据字段名 |
| 数据显示异常 | 数据类型不匹配     | 数值字段是否为 number 类型           |

### 配置相关问题

| 问题现象     | 可能原因           | 检查项                      |
| ------------ | ------------------ | --------------------------- |
| 组件不显示   | visible 设为 false | 检查组件 `visible` 属性     |
| 样式不生效   | 配置路径错误       | 对照 type-meta 检查属性路径 |
| 版本兼容问题 | API 已变更         | 确认使用的是 2.0.0+ API     |

---

## 相关资源

- [配置项索引](../references/topkey/) - 快速查找配置项
- [示例库](../references/examples/) - 常用图表完整示例
- [类型详情](../references/type-details/) - 详细的类型定义
- [图表类型指南](../references/chart/chart-type-guide.md) - 各类图表特性参考
