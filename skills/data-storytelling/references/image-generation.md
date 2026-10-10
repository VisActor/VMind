# 宿主 Agent 图片生成

HTML 与 Web-PPT 共用本约定。图片生成由当前宿主 Agent 的生图能力完成；Skill 只约定素材输入、落盘与消费，不提供生图客户端，也不安装或调用指定服务的 SDK。

## 何时生成

- 仅处理 Plan 的 Asset Registry 中已声明、被章节引用、`media_hint: image` 且 `source: generated`（或省略 source）的素材。
- `source: user-provided` 的素材不生成、不改写，交给 normalize 从 `runtime/user-assets/` 读取。
- `media_hint: svg` 沿用 SVG 编写流程；不要将 SVG 或图表截图伪装成生成图片。

## 输入与调用

1. 读取当前宿主暴露的生图工具或能力说明，并遵守其调用规则。不要假设固定工具名、参数、响应字段或自动落盘行为；不可用时直接进入缺失策略。
2. 将 `Style Preset` 的 asset prompt context、`Story Visual Identity`、`presentation_mode`、asset 的 `purpose / visual_brief` 和章节 placement / usage 合成生成需求。尺寸、比例、透明背景按实际用途与宿主支持选择；保留背景标题安全区。
3. 调用宿主生图能力。图片不承担精确图表读数，不生成伪造数据、来源证明或可读正文；短标签也优先在 HTML 中呈现。
4. 以工具的真实结果为准，将图片保存到 `runtime/generated-assets/{asset_id}.png`、`.jpg`、`.jpeg` 或 `.webp`。ID 必须与 Registry 一致，扩展名必须对应真实格式。同一 ID 保留一个供 normalize 消费的图片文件，避免重试后读到旧版本。
   - 返回本地文件时，复用或复制真实文件到上述路径；不要把工具返回路径当成固定路径约定。
   - 返回图片字节或 base64 时，只解码真实返回内容；返回 URL 时，仅在宿主允许下载且能取得真实图片时落盘。无法取得文件按失败处理，不将临时 URL 直接嵌入最终产物。
   - 不需要为归一化伪造某种服务的 metadata、`status` 或 prompt 文件。
5. 确认文件存在、非空、可读取为图片，并查看图片是否满足用途与安全区要求。工具成功提示不等于图片已经可用。

## 归一化与消费

生图完成后执行 `scripts/normalize_story_assets.py`，输入 Plan、generated-assets 和（如有）user-assets；消费其 `resolved_asset_bindings.json`，并检查 `asset_resolution_report.json`。只有 resolved 素材才能放入页面，HTML 与 PPT 都使用相同的素材 ID 和 data URI 边界。

normalize 和 compose 都不触发生图。脚本成功退出也不代表所有素材齐全：Agent 必须检查缺失项、调整相应页面结构并验证最终页面。

## 不可用与失败

- 宿主没有生图能力、拒绝调用或无法落盘时，不尝试安装 SDK 或自行接入其他服务。可恢复的生成失败可按宿主规则有限重试，仍失败则执行 Plan 已声明的 fallback。
- hero 或其他结构依赖图片的页面，必须先改为 fallback 对应的 composition，不能保留声称图片存在的空框。证据必需且无有效 fallback 时停止，报告 partial/error；弱装饰可按 Plan 移除。
- 不用 matplotlib、PIL、CSS gradient、canvas screenshot、SVG placeholder、base64 stub 或手工绘图冒充 `source: generated` 的 image。Plan 允许的 gradient 是页面结构降级，不是成功生成的图片。
- 交付说明必须列出未生成的 asset ID、实际原因、采用的 fallback 及影响。不要将内部 prompt、brief、错误或 fallback 说明放进故事正文，也不能留下坏 `<img>`。
