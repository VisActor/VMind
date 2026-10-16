# SOP：VChart 文本格式化（formatter & formatMethod）

> **⚠️ 关键提醒**：如涉及 **Tooltip** 格式化，必须注意字段名差异——Tooltip 使用 `keyFormatter`/`valueFormatter` 专用字段（不是 `key`/`value`）。详见 Step 3.5 和 Step 4 组件支持矩阵。

## 适用场景

当用户需要对图表中的文本进行格式化时使用本 SOP，包括但不限于：

- 标签（label）的数值格式化（千分位、百分比、货币、单位等）
- 坐标轴（axis label）的刻度文本格式化
- 图例（legend label）的文本格式化
- Tooltip 内容的文本格式化
- Crosshair 标签的格式化
- 富文本标签（多样式混排）

---

## Step 1：理解两种格式化 API

VChart 提供两种**并列且独立**的文本格式化 API：`formatter` 和 `formatMethod`。它们各有明确的设计定位和适用场景，**不是主次关系**。

### 1.1 对比总览

| 维度 | `formatter`（模板字符串） | `formatMethod`（回调函数） |
|------|--------------------------|---------------------------|
| **类型** | `string` | `(value, datum, ctx) => string \| RichText` |
| **设计定位** | 声明式、可序列化的文本模板 | 命令式、灵活的函数逻辑 |
| **核心优势** | 配置值为字符串，**可被 JSON 序列化**，适合远程下发/存储/跨端传输 | 支持任意 JS 逻辑，条件判断、多字段计算、富文本返回 |
| **典型场景** | 服务端下发图表配置、低代码平台、需要持久化的 spec | 前端动态计算、复杂条件分支、富文本混排 |
| **内置能力** | 数值格式化（d3-format）、时间格式化（d3-time-format）、数据变量替换 | 无内置，完全由用户函数控制 |
| **版本要求** | `v1.10.0+`（需注册格式化插件） | 所有版本 |
| **优先级** | 低（当两者同时配置时，`formatMethod` 优先） | 高 |

### 1.2 选择决策

```
用户需求 → 配置值能否用字符串表达？
  ├─ 是 → 是否需要序列化/远程下发/JSON存储？
  │    ├─ 是 → 使用 formatter ✅
  │    └─ 否 → formatter 或 formatMethod 均可，formatter 更简洁
  └─ 否（需要条件判断/计算/富文本）→ 使用 formatMethod ✅
```

---

## Step 2：formatter 详解（模板字符串 API）

> 官方文档：https://www.visactor.com/vchart/guide/tutorial_docs/Chart_Plugins/Formatter

### 2.1 基础语法

formatter 使用 `{}` 包裹变量名实现数据替换：

```javascript
// 数据项: { year: 2016, population: 899447 }
formatter: 'The population in {year} is {population}'
// 输出: "The population in 2016 is 899447"
```

### 2.2 数值格式化（d3-format 语法）

在变量名后用冒号 `:` 接格式化表达式：

```javascript
formatter: '{value:.2f}'     // 小数点后两位: "12.39"
formatter: '{value:,.0f}'    // 千分位无小数: "1,234,568"
formatter: '{value:,.1f}'    // 千分位一位小数: "1,234,567.9"
formatter: '{value:s}'       // SI 前缀: "1.50000k"
formatter: '{value:~s}'      // SI 前缀去尾零: "1.5k"
```

**常用格式化类型速查**：

| 类型 | 说明 | 示例 |
|------|------|------|
| `f` | 浮点数 | `{value:.2f}` → `"12.39"` |
| `d` | 十进制整数 | `{value:d}` → `"12"` |
| `s` | SI 前缀 | `{value:s}` → `"1.5k"` |
| `%` | 百分比（乘100） | `{value:.1%}` → `"45.6%"` |
| `e` | 指数 | `{value:.2e}` → `"1.23e+4"` |
| `t` | 保留小数位（不四舍五入） | `{value:.2t}` → `"12.38"`（原值12.3893） |
| `z` | 智能小数（整数无小数，小数四舍五入） | `{100:.2z}` → `"100"`，`{12.389:.2z}` → `"12.39"` |
| `~` | 修饰符：去除尾随零 | `{value:~s}` → `"1.5k"` |

### 2.3 时间格式化（d3-time-format 语法）

```javascript
formatter: '{date:%Y-%m-%d}'    // "2024-05-01"
formatter: '{date:%m月%d日}'     // "05月01日"
formatter: '{date:%H:%M:%S}'    // "14:30:00"
```

**常用时间格式速查**：

| 格式 | 含义 | 示例 |
|------|------|------|
| `%Y` | 四位年 | `2024` |
| `%m` | 两位月 | `05` |
| `%d` | 两位日 | `01` |
| `%b` | 月缩写 | `Jul` |
| `%B` | 月全称 | `July` |
| `%a` | 周缩写 | `Wed` |
| `%H` | 24h 小时 | `14` |
| `%I` | 12h 小时 | `02` |
| `%M` | 分钟 | `30` |
| `%S` | 秒 | `00` |
| `%L` | 毫秒 | `001` |

### 2.4 注册格式化插件

> 使用完整包引入（CDN 或 `import VChart from '@visactor/vchart'`）时，格式化插件**已自动注册**，无需额外操作。

**按需加载**时必须手动注册：

```javascript
import { VChart } from '@visactor/vchart';
import { registerFormatPlugin } from '@visactor/vchart';

VChart.useRegisters([registerFormatPlugin]);
```

### ⚠️ 2.5 关键陷阱：坐标轴 formatter 的 datum 问题

> **这是最常见的 formatter 使用错误，必须重点提醒用户。**

当 `formatter` 用于**坐标轴标签**（`axes[].label.formatter`）时，datum 中的字段含义与数据源不同：

| datum 字段 | 含义 | 说明 |
|-----------|------|------|
| `datum.value` | **比例尺映射值**（scale value） | 这是 VChart/VUtils 内部根据比例尺计算出的值，**不是用户数据的原始值** |
| `datum.label` | **用户实际数值** | 这才是用户数据中对应的真实值 |

**错误示例**：

```javascript
// ❌ 错误：在坐标轴 formatter 中用 {value} 想获取用户数据
axes: [{
  orient: 'left',
  label: {
    formatter: '{value:.2f}'  // 获取到的是比例尺值（如 0.5），不是用户数据（如 5000）
  }
}]
```

**正确示例**：

```javascript
// ✅ 正确：使用 {label} 获取用户实际数值
axes: [{
  orient: 'left',
  label: {
    formatter: '{label:,.0f}'  // 正确获取用户数据并千分位格式化
  }
}]
```

**对比**：如果用 `formatMethod`，则不存在这个问题，因为 formatMethod 的第一个参数直接就是显示值：

```javascript
axes: [{
  orient: 'left',
  label: {
    formatMethod: (value, datum, index) => {
      // value 就是要显示的刻度值，直接使用即可
      return Number(value).toLocaleString();
    }
  }
}]
```

> **助手规则**：当用户要用 formatter 格式化坐标轴标签时，**必须主动提醒** datum.value 与 datum.label 的区别，避免用户踩坑。

---

## Step 3：formatMethod 详解（回调函数 API）

### 3.1 各组件签名速查

| 组件 | 配置路径 | formatMethod 签名 |
|------|---------|-------------------|
| 数据标签 | `label.formatMethod` | `(value: string, datum: Datum, ctx: ILabelFormatMethodContext) => string \| ReturnType<rich>` |
| 坐标轴标签 | `axes[].label.formatMethod` | `(value: string \| number, datum: Datum, index: number) => string` |
| 图例标签 | `legends[].item.label.formatMethod` | `(label: string, datum: Datum, index: number) => string` |
| Crosshair 标签 | `crosshair.xField.label.formatMethod` | `(value: string) => string` |

> **注意**：Tooltip 没有 `formatMethod`，它在 `title.value` 和 `content[].value` 中直接使用函数。Tooltip 使用 formatter 模板字符串时，需用 `keyFormatter` / `valueFormatter` 专用字段（见 Step 3.5）。

### 3.2 Label 格式化

**基础格式化**：

```javascript
label: {
  visible: true,
  formatMethod: (value, datum, ctx) => {
    // value: 原始文本值（string）
    // datum: 当前数据项对象
    // ctx: 上下文，包含 series 等信息
    return `${Number(value).toLocaleString()} 元`;
  }
}
```

**常见格式化模式**：

| 需求 | formatMethod 实现 |
|------|------------------|
| 千分位 | `(v) => Number(v).toLocaleString()` |
| 百分比 | `(v) => (Number(v) * 100).toFixed(1) + '%'` |
| 保留 N 位小数 | `(v) => Number(v).toFixed(2)` |
| 货币格式 | `(v) => '¥' + Number(v).toLocaleString()` |
| 条件显示 | `(v, d) => d.value > 50 ? v : ''` |
| 多字段拼接 | `(v, d) => d.name + ': ' + v` |
| K/M 缩写 | `(v) => { const n = Number(v); return n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : String(n); }` |

**富文本标签**（多样式混排）：

```javascript
label: {
  visible: true,
  formatMethod: (value, datum) => {
    return {
      type: 'rich',
      text: [
        { text: datum.category, fill: '#666', fontSize: 10 },
        { text: '\n' },
        { text: String(value), fill: '#333', fontSize: 14, fontWeight: 'bold' }
      ]
    };
  }
}
```

### 3.3 Axis Label 格式化

```javascript
axes: [
  {
    orient: 'left',
    type: 'linear',
    label: {
      formatMethod: (value, datum, index) => {
        // value: 刻度值（number 或 string）
        return value >= 1000 ? `${value / 1000}k` : String(value);
      }
    }
  },
  {
    orient: 'bottom',
    type: 'time',
    label: {
      formatMethod: (value) => {
        const date = new Date(value);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    }
  }
]
```

### 3.4 Legend Label 格式化

```javascript
legends: {
  visible: true,
  item: {
    label: {
      formatMethod: (label, datum, index) => {
        // label: 图例项文本
        // datum: 图例项数据
        return `${label} (${datum.value})`;
      }
    }
  }
}
```

### 3.5 Tooltip 格式化

> **⚠️ 关键：Tooltip 的 formatter 字段名与其他组件不同！**

Tooltip 有两种格式化方式：

#### 方式 A：函数方式（所有版本）

在 `title.value` 和 `content[].value` 中直接使用函数：

```javascript
tooltip: {
  mark: {
    title: {
      value: (datum) => datum.category  // datum 是单条数据
    },
    content: [
      {
        key: '数值',
        value: (datum) => `${datum.value.toLocaleString()} 元`
      }
    ]
  },
  dimension: {
    title: {
      value: (data) => data?.[0]?.datum?.category  // data 是数据数组
    },
    content: [
      {
        key: (datum) => datum.type,
        value: (datum) => `${datum.value.toLocaleString()} 元`
      }
    ]
  }
}
```

#### 方式 B：formatter 模板方式（v1.10.0+）

> **必须使用 `keyFormatter` 和 `valueFormatter` 专用字段，不能在 `key` / `value` 字段中写模板字符串。**

```javascript
// ✅ 正确：使用 valueFormatter 字段
tooltip: {
  dimension: {
    content: [
      {
        hasShape: true,
        valueFormatter: '{value:,.0f}'      // 千分位整数
      }
    ]
  }
}

// ✅ 正确：百分比格式化
tooltip: {
  mark: {
    content: [
      {
        key: '完成率',
        valueFormatter: '{value:.1%}'       // 百分比
      }
    ]
  }
}

// ✅ 正确：key 和 value 同时使用 formatter
tooltip: {
  dimension: {
    title: {
      valueFormatter: '{value:%Y-%m-%d}'    // 时间格式化
    },
    content: [
      {
        hasShape: true,
        valueFormatter: '{value:,.2f}'      // 千分位+两位小数
      }
    ]
  }
}
```

**❌ 错误用法**：

```javascript
// ❌ 错误：不能在 value 字段中写 formatter 模板
tooltip: {
  mark: {
    content: [
      {
        key: '数值',
        value: '{value:,.0f}'    // ❌ 被当作普通字符串，不会格式化
      }
    ]
  }
}
```

**Tooltip formatter 字段完整列表**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `keyFormatter` | `string` | 对 tooltip 内容行的 key 进行 formatter 模板格式化 |
| `valueFormatter` | `string` | 对 tooltip 内容行的 value 进行 formatter 模板格式化 |
| `keyTimeFormat` | `string` | key 的时间格式化字符串 |
| `keyTimeFormatMode` | `'utc' \| 'local'` | key 时间格式化模式 |
| `valueTimeFormat` | `string` | value 的时间格式化字符串 |
| `valueTimeFormatMode` | `'utc' \| 'local'` | value 时间格式化模式 |

---

## Step 4：formatter vs formatMethod 各组件支持情况

| 组件 | formatter 支持 | formatMethod 支持 | 推荐 |
|------|---------------|-------------------|------|
| Label（数据标签） | ✅ `label.formatter` | ✅ `label.formatMethod` | 简单用 formatter，复杂/富文本用 formatMethod |
| Axis Label（坐标轴） | ✅ `axes[].label.formatter` | ✅ `axes[].label.formatMethod` | ⚠️ formatter 注意 datum.value vs datum.label 陷阱 |
| Legend Label（图例） | ✅ `legends[].item.label.formatter` | ✅ `legends[].item.label.formatMethod` | 简单用 formatter |
| Crosshair Label | ❌ 不支持 | ✅ `crosshair.xField.label.formatMethod` | 仅 formatMethod |
| Tooltip | ✅ **使用 `keyFormatter` / `valueFormatter` 字段**（⚠️ 不是 `key` / `value`） | ❌ 使用 `key` / `value` 函数代替 | formatter: 用 `valueFormatter`；函数: 用 `value: (datum) => ...` |

> **⚠️ Tooltip 的 formatter 陷阱**：Tooltip 不像其他组件使用 `formatter` 字段名。Tooltip 使用的是 `keyFormatter` 和 `valueFormatter`，直接放在 content 行配置对象中。如果错误地在 `key` 或 `value` 中写模板字符串，它会被当作普通字符串原样显示。

---

## Step 5：常见问题排查

### 问题 5.1：formatter 不生效

**排查清单**：

1. **版本不够**：`formatter` 需要 VChart `v1.10.0+`
2. **插件未注册**：按需加载时需手动调用 `VChart.useRegisters([registerFormatPlugin])`
3. **语法错误**：变量名用单花括号 `{value}`，不是双花括号 `{{value}}`
4. **坐标轴变量名错误**：在坐标轴上用 `{value}` 获取到的是比例尺值，应该用 `{label}` 获取用户数据

### 问题 5.2：formatMethod 不生效

**排查清单**：

1. **函数签名错误**：确认参数顺序。Label 是 `(value, datum, ctx)`，Axis 是 `(value, datum, index)`
2. **返回值类型**：必须返回 `string`（或富文本对象），不能返回 `undefined` / `null` / `number`
3. **配置层级错误**：`formatMethod` 必须放在正确的层级下
   - ✅ `label.formatMethod`
   - ❌ `label.style.formatMethod`（style 下没有此属性）
4. **formatter 共存**：当同时配置 `formatter` 和 `formatMethod` 时，`formatMethod` 优先。如果 formatMethod 内部报错导致静默失败，可能会看到 formatter 的效果或无效果

### 问题 5.3：富文本标签不显示

**排查清单**：

1. **返回格式**：必须返回 `{ type: 'rich', text: [...] }` 格式
2. **text 数组**：每个元素必须包含 `text` 字段
3. **换行符**：使用 `{ text: '\n' }` 对象而不是 `'\n'` 字符串

### 问题 5.4：坐标轴 formatter 显示比例尺值而非数据值

**原因**：坐标轴 formatter 的 datum 中 `datum.value` 是比例尺映射值，不是原始数据。

**解决**：

```javascript
// 方案 1：formatter 中使用 {label} 而非 {value}
axes: [{ label: { formatter: '{label:,.0f}' } }]

// 方案 2：改用 formatMethod，第一个参数 value 就是显示值
axes: [{ label: { formatMethod: (value) => Number(value).toLocaleString() } }]
```

### 问题 5.5：Tooltip formatter 模板不生效，显示原始字符串

**原因**：Tooltip 的 formatter 模板需要使用 `keyFormatter` / `valueFormatter` 专用字段，不能写在 `key` / `value` 中。

**解决**：

```javascript
// ❌ 错误写法
tooltip: { mark: { content: [{ value: '{value:.1%}' }] } }

// ✅ 正确写法
tooltip: { mark: { content: [{ valueFormatter: '{value:.1%}' }] } }
```

---

## Step 6：输出

根据当前对话上下文选择输出格式：

- 用户在讨论配置 → 输出 JavaScript 代码片段
- 用户需要可运行 demo → 参考 `workflows/scenario-2-generation.md` 的输出规范生成完整 HTML
- 用户有现有代码需要修复 → 参考 `workflows/scenario-1-diagnosis.md` 的输出规范


## 配置与交付边界

`label.formatter` / `nonLeafLabel.formatter` 是模板字符串（或字符串数组），不能传函数。函数使用 `formatMethod: (text, datum) => ...`。类型以 [ILabelSpec](../type-details/ILabelSpec-Type-Definition.md) 为准，不把其他库的 `formatter` 约定搬来。

Tooltip 的 `mark.title.value` 和 `mark.content[].value` 可以是函数；字符串格式化使用其专属 `keyFormatter` / `valueFormatter`。不要把所有叫 formatter 的字段或所有函数统一替换。详见 [ITooltipSpec](../type-details/ITooltipSpec-Type-Definition.md)。

Treemap 的布局 datum 与原始记录不同，颜色、文字、tooltip 需要统一解包，参见 [层级数据](hierarchy-data.md)。需要占比时从实际输入求和；多行文本使用字符串数组。用户要求完整文本时，空间不足应隐藏或换行、保留 tooltip，不能以省略号冒充完整显示；允许省略时可采用相应策略。
