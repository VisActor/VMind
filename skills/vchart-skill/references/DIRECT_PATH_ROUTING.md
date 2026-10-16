# 直达路径路由与工具约束

## 目标

为了降低 session 中的工具往返、token 消耗和耗时，本 Skill 的本地知识访问改为**固定路径直达**模式：

- **禁止使用**：`find`、`grep`、`ls`
- **优先使用**：`read`
- **必要时使用**：`bash`、`write`、`edit`

## 执行原则

1. 先读取 `SKILL.md` 和当前 Workflow。
2. 本地知识库只按**已知固定路径**读取，不做目录扫描。
3. 如果本地路径不明确：
   - 优先使用本地 Example / SOP 检索结果
   - 或直接基于已知图表类型和 `type-meta` / `topkey` 构建
   - **不要**为了找文件再去调用 `find`、`grep`、`ls`
4. 单个问题的本地读取预算建议：
   - 1 个 Workflow
   - 1 个 `topkey`
   - 1 个 `type-meta`
   - 0-1 个 `type-details`
   - 0-1 个本地 example
   - 0-1 个 SOP

## 必读固定路径

| 用途 | 固定路径 |
| --- | --- |
| 主入口 | `SKILL.md` |
| 诊断 Workflow | `workflows/scenario-1-diagnosis.md` |
| React 诊断 Workflow | `workflows/scenario-1-react.md` |
| 生成 Workflow | `workflows/scenario-2-generation.md` |
| 新建/修复文件校验与交付 | `workflows/artifact-delivery.md` |
| 层级图数据与回调 | `references/sops/hierarchy-data.md` |
| 图片还原 Workflow | `workflows/scenario-3-image-replication.md` |
| 图表类型选择 | `references/chart/chart-type-guide.md` |
| 常见问题 | `references/chart/common-issues.md` |
| SOP 路由表 | `references/sops/SOP_INDEX.md` |
| 脚本参数 | `references/SCRIPT_PARAMS_REFERENCE.md` |
| 脚本排障 | `references/SCRIPTS_TROUBLESHOOTING.md` |
| 文件命名 | `references/FILE_NAMING_CONVENTIONS.md` |
| HTML 模板 | `template/demo.html` / `template/diagnosis.html` / `template/diagnosis-react.html` |

## 配置查询固定路径

### topkey

- 通用配置：`references/topkey/all_common.json`
- 图表专属配置：`references/topkey/[type].json`

常见类型示例：

- `references/topkey/bar.json`
- `references/topkey/line.json`
- `references/topkey/area.json`
- `references/topkey/pie.json`
- `references/topkey/radar.json`
- `references/topkey/sankey.json`
- `references/topkey/funnel.json`
- `references/topkey/gauge.json`
- `references/topkey/scatter.json`
- `references/topkey/waterfall.json`

### type-meta

- 图表结构：`references/type-meta/[type].json`
- 通用结构：`references/type-meta/common.json`

常见类型示例：

- `references/type-meta/bar.json`
- `references/type-meta/line.json`
- `references/type-meta/area.json`
- `references/type-meta/pie.json`
- `references/type-meta/radar.json`
- `references/type-meta/sankey.json`
- `references/type-meta/funnel.json`
- `references/type-meta/gauge.json`
- `references/type-meta/scatter.json`
- `references/type-meta/waterfall.json`

### type-details

- 复杂类型：`references/type-details/[类型名]-Type-Definition.md`

常见场景：

- 标签：`references/type-details/ILabelSpec-Type-Definition.md`
- tooltip：`references/type-details/ITooltipSpec-Type-Definition.md`
- 图例：`references/type-details/ILegendSpec-Type-Definition.md`
- 坐标轴：`references/components/axis.md`

如果无法确定复杂类型名称，优先只使用 `type-meta` 和现有知识生成，不做本地搜索。

## 本地 Example 直达表

只读取下表中的**固定 example 路径**，不要在 `references/examples/` 中做遍历或搜索：

| 图表类型 / 需求 | 固定路径 |
| --- | --- |
| Treemap 层级字段、颜色、标签与 tooltip | `references/examples/treemap/hierarchy-treemap.js`（先读 `references/sops/hierarchy-data.md`） |
| 基础柱状图 | `references/examples/bar/basic-bar.md` |
| 分组柱状图 | `references/examples/bar/grouped-bar.md` |
| 堆叠柱状图 | `references/examples/bar/stacked-bar.md` |
| 折线图 | `references/examples/line/basic-line.md` |
| 面积图 | `references/examples/area/basic-area.md` |
| 饼图 | `references/examples/pie/basic-pie.md` |
| 双轴组合图 | `references/examples/combination/dual-axis.md` |
| 漏斗图 | `references/examples/funnel/basic-funnel.md` |
| 仪表盘 | `references/examples/gauge/basic-gauge.md` |
| 雷达图 | `references/examples/radar/basic-radar.md` |
| 桑基图 | `references/examples/sankey/basic-sankey.md` |
| 层级桑基图 | `references/examples/sankey/hierarchy-sankey.md` |
| 散点图 | `references/examples/scatter/basic-scatter.md` |

说明：

- `waterfall`、复杂交互、多图联动等如果没有固定本地 example，优先本地检索；检索无命中时直接基于 `type-meta`、`topkey` 和现有知识构建。
- 不允许为了找“更像的例子”而扫描本地 example 目录。

## SOP 入口

任务到参考文件的映射统一维护在 [SOP 索引](sops/SOP_INDEX.md)。按图表类型和当前需求读取匹配项。

## API 直达表

| 能力 | 固定路径 |
| --- | --- |
| 事件监听 | `references/api/event-api.md` |
| 数据更新 | `references/api/data-api.md` |
| 状态控制 | `references/api/state-api.md` |
| 交互控制 | `references/api/interaction-api.md` |
| 导出图片 | `references/api/export-api.md` |
| 主题切换 | `references/api/theme-api.md` |
| 总索引 | `references/api/API_INDEX.md` |

## 推荐读取顺序

### 生成场景

1. `workflows/scenario-2-generation.md`
2. `references/chart/chart-type-guide.md`
3. `references/topkey/all_common.json`
4. `references/topkey/[type].json`
5. `references/type-meta/[type].json`
6. 固定 example 路径（最多 1 个）
7. 需要时再读 1 个 `type-details`

### 诊断场景

1. `workflows/scenario-1-diagnosis.md`
2. `references/chart/common-issues.md`
3. `references/sops/SOP_INDEX.md`
4. `references/type-meta/[type].json`
5. 命中的固定 SOP
6. 需要时再读 1 个固定 example

### 图片还原场景

1. `workflows/scenario-3-image-replication.md`
2. `references/chart/chart-type-guide.md`
3. 固定 example 路径（最多 1 个）
4. `references/type-meta/[type].json`
5. `references/topkey/[type].json`
6. 需要时再读 1 个 `type-details`
