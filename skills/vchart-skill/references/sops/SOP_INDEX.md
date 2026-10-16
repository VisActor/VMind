# 本地诊断与数据契约入口

本地关键词检索没有结果或结果不相关时，读取这里的参考，不把未命中当成没有知识。已知图表类型时先核对其数据契约，再查可选样式。

| 任务 | 参考 |
| --- | --- |
| Treemap / sunburst：数据、回调、配色、完整标签 | [hierarchy-data.md](hierarchy-data.md) |
| Sankey：平铺边、图数据、节点键、路径高亮 | [graph-data.md](graph-data.md) |
| 空数据、清空、居中提示、恢复数据 | [empty-state.md](empty-state.md) |
| 模板字符串与函数格式化 | [format-method.md](format-method.md) |
| HTML / UMD 构造与运行版本 | [cdn-script-adaption.md](cdn-script-adaption.md) |
| 多图 Tooltip / Crosshair 联动 | [tooltip-crosshair-sync.md](tooltip-crosshair-sync.md) |
| Tooltip 使用与排查 | [tooltip-usage.md](tooltip-usage.md) |
| Tooltip 配置与回调 | [ITooltipSpec](../type-details/ITooltipSpec-Type-Definition.md) |
| 跨图交互 | [interaction API](../api/interaction-api.md) |
| 文件校验与修改后的交付 | [交付流程](../../workflows/artifact-delivery.md) |

图块为空时不只检查 `values` 拼写：数据源描述、图/树容器、原始记录是不同层级。标题、canvas、脚本退出 0 和 ready 均不证明有数据图形。
