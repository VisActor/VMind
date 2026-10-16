# SOP：CDN 环境适配（HTML Script 引入 VChart）

> **⚠️ 本 SOP 优先级最高。** 当 Skill 输出为 HTML 文件（通过 `<script>` 标签引入 VChart）时，必须执行本 SOP 的所有转换规则。

## 适用场景

- 输出格式为 `.html` 文件
- 代码中包含 `<script src="...vchart...">` 标签
- 用户要求"生成可运行的 HTML"或"在浏览器中运行"

**不适用**：输出为 `.js`/`.ts`/`.jsx`/`.tsx`（npm/ES Module 环境），保持原始写法不变。

---

## 背景：UMD 包装对象结构

通过 CDN `<script>` 引入 VChart 时，全局变量 `window.VChart` 是一个 **UMD 包装对象**，而不是构造函数本身。其内部结构为：

```
window.VChart = {
  default: [VChart 构造函数],       // npm 中 import VChart from '...' 得到的就是这个
  VChart: {                         // 内部命名空间
    globalConfig: {...},            // 全局配置
    ThemeManager: {...},            // 主题管理器
    ...
  },
  registerFormatPlugin: [Function], // 顶层导出：注册函数
  registerBarChart: [Function],
  registerTooltip: [Function],
  ...其他 register 函数
}
```

因此 npm 示例代码中的 `VChart` 需要按规则映射到 CDN 对应路径。

---

## 转换规则总表

### 规则 1：构造函数实例化

```javascript
// ❌ npm 写法（CDN 中不可用，VChart 不是构造函数）
const vchart = new VChart(spec, { dom: 'container' });

// ✅ CDN 正确写法
const vchart = new VChart.default(spec, { dom: 'container' });
```

**规则**：`new VChart(` → `new VChart.default(`

---

### 规则 2：静态方法调用

```javascript
// ❌ npm 写法
VChart.useRegisters([registerFormatPlugin]);

// ✅ CDN 正确写法
VChart.default.useRegisters([VChart.registerFormatPlugin]);
```

**规则**：
- `VChart.useRegisters(` → `VChart.default.useRegisters(`
- 按需导入的注册函数（如 `registerFormatPlugin`）→ `VChart.registerFormatPlugin`（UMD 顶层属性）

---

### 规则 3：全局配置（globalConfig）

```javascript
// ❌ npm 写法
VChart.globalConfig.uniqueTooltip = false;

// ✅ CDN 正确写法
VChart.default.globalConfig.uniqueTooltip = false;
```

**规则**：`VChart.globalConfig` → `VChart.default.globalConfig`

> 注意双重 `VChart`：第一个 `VChart` 是全局 UMD 对象，`.default` 取到构造函数，`.VChart` 是构造函数上的内部命名空间。

---

### 规则 4：ThemeManager

```javascript
// ❌ npm 写法
VChart.ThemeManager.registerTheme('dark', { ... });
VChart.ThemeManager.setCurrentTheme('dark');

// ✅ CDN 正确写法
VChart.default.ThemeManager.registerTheme('dark', { ... });
VChart.default.ThemeManager.setCurrentTheme('dark');
```

**规则**：`VChart.ThemeManager` → `VChart.default.ThemeManager`

---

### 规则 5：按需导入的注册函数

npm 中按需导入的函数，在 CDN 中是 UMD 包装对象的顶层属性：

```javascript
// ❌ npm 写法
import { registerBarChart, registerTooltip } from '@visactor/vchart';
VChart.useRegisters([registerBarChart, registerTooltip]);

// ✅ CDN 正确写法（无需 import，直接从全局 VChart 取）
VChart.default.useRegisters([VChart.registerBarChart, VChart.registerTooltip]);
```

**规则**：`import { registerXxx }` 的变量 → `VChart.registerXxx`

---

## 快速转换速查表

| npm 写法 | CDN 写法 | 说明 |
|----------|---------|------|
| `new VChart(spec, opts)` | `new VChart.default(spec, opts)` | 构造函数 |
| `VChart.useRegisters([...])` | `VChart.default.useRegisters([...])` | 静态方法 |
| `VChart.globalConfig` | `VChart.default.globalConfig` | 全局配置 |
| `VChart.ThemeManager` | `VChart.default.ThemeManager` | 主题管理器 |
| `registerXxx`（按需导入） | `VChart.registerXxx` | 注册函数 |

---

## 自检清单

生成 HTML 代码后，逐项检查：

- [ ] 所有 `new VChart(` 已改为 `new VChart.default(`
- [ ] 所有 `VChart.useRegisters(` 已改为 `VChart.default.useRegisters(`
- [ ] 所有 `VChart.globalConfig` 已改为 `VChart.default.globalConfig`
- [ ] 所有 `VChart.ThemeManager` 已改为 `VChart.default.ThemeManager`
- [ ] 按需导入的注册函数已改为 `VChart.registerXxx` 形式
- [ ] 不存在任何裸 `new VChart(` 调用（不含 `.default`）

---

## 常见错误与报错对照

| 报错信息 | 原因 | 修复 |
|---------|------|------|
| `VChart is not a constructor` | 直接 `new VChart()` | 改为 `new VChart.default()` |
| `VChart.useRegisters is not a function` | 直接调用静态方法 | 改为 `VChart.default.useRegisters()` |
| `Cannot read properties of undefined (reading 'uniqueTooltip')` | `VChart.globalConfig` 不存在 | 改为 `VChart.default.globalConfig` |
| `VChart.ThemeManager is undefined` | 直接访问 ThemeManager | 改为 `VChart.default.ThemeManager` |
| `registerFormatPlugin is not defined` | 在 CDN 中使用了 import 变量名 | 改为 `VChart.registerFormatPlugin` |


## 配置与交付边界

纯浏览器 HTML 使用已加载的 UMD 命名空间，构造器是 `window.VChart.default || window.VChart`。npm 示例的 import 不可直接放进普通 script。完整 UMD 已包含常规图表；按需构建才需核对图表注册。报空白不能直接归因于注册：先核对当前源码的数据结构和真实错误。

保持模板/宿主指定的版本，不为试错擅自升级 CDN。配置脚本提供 `spec` 对象，交给宿主或模板构造图表；不要在配置里重复创建实例。构造和 `renderSync()` 完成不等于有数据图形，须检查实际结果。

如确实使用额外插件，先核对该版本的导出及注册方式；不要假设 UMD 命名空间与 npm 默认导出完全相同。生成标准演示使用 Skill 生成器，独立 HTML 也执行配置校验。
