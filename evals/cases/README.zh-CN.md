# Skill 评测用例

[English](README.md) | [简体中文](README.zh-CN.md)

用例按 Skill 分目录维护，每个目录包含任务、输入、验收条件和用例说明。

| Skill | 用例数 | 分组 | 用例说明 |
| --- | --- | --- | --- |
| `vchart-skill` | 32 | core（8）、extended（24） | [VChart](vchart-skill/README.zh-CN.md) |
| `vtable-skill` | 4 | core（4） | [VTable](vtable-skill/README.zh-CN.md) |

## 目录结构

```text
cases/
  <skill-name>/
    README.md / README.zh-CN.md
    tasks.json
    expectations.json
    fixtures.json
    inputs/
```

- `tasks.json`：case ID、所属 Skill、group、prompt 和输入文件名。多轮任务使用 `steps`。
- `inputs/`：该 Skill 的输入数据、待修复代码和参考图片；各目录独立维护，同名文件互不影响。
- `expectations.json`：按 case ID 定义自动检查配置和人工复核清单，不提供给被测 Agent。
- `fixtures.json`：输入文件的来源说明和 SHA-256。

## 选择与运行

先按 [评测指南](../README.zh-CN.md) 配置环境和模型，在仓库根目录执行：

```bash
# 列出所有 Skill 的全部用例，不调用模型
uv run python evals/scripts/run.py --group all --list

# 选择 Skill，再选择该 Skill 内的分组
uv run python evals/scripts/run.py --skill vchart-skill --group core --browser
uv run python evals/scripts/run.py --skill vchart-skill --group extended --list
uv run python evals/scripts/run.py --skill vtable-skill --group core --browser

# 单独运行一个用例
uv run python evals/scripts/run.py --skill vtable-skill --case vtable-list --browser
```

`--skill` 选择用例目录，`--group` 选择该 Skill 内的分组。`--group all` 在指定 Skill 时选择该 Skill 的全部用例，未指定 Skill 时选择所有用例。默认仍为 VChart 的 core 组；仅指定 Skill 时选择其 core 组。当前 VTable 没有 extended 组，选择空分组会报错。

现有 case ID 在所有 Skill 间保持唯一，因此也可直接用 `--case vtable-list`；重复传入 `--case` 可选择多个任务。显式指定 case 时优先于 group，但仍受 `--skill` 限制。自定义任务继续使用 `--skill` 搭配 `--prompt-file`，详见评测指南。

## 新增用例

在对应 Skill 目录下添加输入，更新 `tasks.json`、`expectations.json`、`fixtures.json` 和中英文说明。新增 Skill 的用例目录名应与 `skills/<skill-name>/` 一致；runner 会自动发现其中的 `tasks.json`。case ID 使用 Skill 相关前缀，避免跨目录重名。

按任务的必要行为制定验收条件，允许不同的正确实现。保留失败用例和日志；用例数量不代表已经执行或通过的数量。自动检查通过后仍需按各 Skill 的清单复核，未执行项标记为 `not-run`。
