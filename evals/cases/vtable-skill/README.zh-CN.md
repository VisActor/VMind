# VTable 评测用例

[English](README.md) | [简体中文](README.zh-CN.md)

[所有 Skill 的用例](../README.zh-CN.md)

4 个固定任务覆盖明细表、透视表、筛选和字段诊断，均属于本 Skill 的 core 组。任务定义在 `tasks.json`，输入在 `inputs/`，检查配置和复核清单在 `expectations.json`。

## 运行

按 [评测指南](../../README.zh-CN.md) 配置环境和模型后，在仓库根目录执行：

```bash
uv run python evals/scripts/run.py --skill vtable-skill --group all --list
uv run python evals/scripts/run.py --skill vtable-skill --case vtable-list --browser
uv run python evals/scripts/run.py --skill vtable-skill --group core --browser
```

## 核心用例（core）

| 用例 | 检查重点 | 验收条件 |
| --- | --- | --- |
| vtable-list | 明细表、记录完整性与排序 | 六条记录完整；点击销售额表头能排序 |
| vtable-pivot | 行列维度与聚合 | East:120/150，West:80/90，North:100/110；地区与季度方向正确 |
| vtable-filter | 筛选后的真实数据更新与恢复 | 实际切换 Q1、Q2、全部，表格记录和数值随之变化 |
| vtable-diagnosis | 字段映射错误的诊断与修复 | 解释列 field 与 record 不匹配，修复后显示 East=120、West=80 |

## 如何验收

自动检查执行状态与产物；启用 `--browser` 后检查浏览器错误、非空白 canvas，并在适用的任务中核对运行时记录。筛选任务会实际切换 Q1、Q2、全部并核对数据。排序、透视维度与聚合结果、诊断解释仍需按上表复核。

截图用于留存证据，不与固定整页图片比较，也没有模型自动整页评分。未指定的布局、配色等可以不同；检查任务要求的数据、行为和可读性。自动检查通过后保留 `needs-review`，复核方式见 [日志说明](../../README.zh-CN.md#日志)。

输入均为合成数据，输入哈希保存在 `fixtures.json`。预期答案不提供给被测 Agent。新增任务应覆盖新的能力或失败模式，并同步更新中英文说明。
