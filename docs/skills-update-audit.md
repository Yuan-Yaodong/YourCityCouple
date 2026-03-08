# Skills Update Audit (2026-03-08)

## Scope
- 本机 Cursor 内置技能目录：`C:\Users\yyd\.cursor\skills-cursor`
- 本机 Claude 技能目录：`C:\Users\yyd\.claude\skills`
- 重点核查：`create-skill`（Cursor）与 `skill-creator`（Claude）

## Findings
- `skills-cursor` 下当前有 5 个内置技能（含 `create-skill`）。
- `~/.claude/skills` 下有 58 个技能，包含 `skill-creator`。
- 两套技能文件普遍没有明确 `version` 字段，无法仅靠本地文件精确判断“是否最新版本”。
- `skill-creator` 内容更完整（覆盖脚本初始化、打包、迭代流程）。
- `create-skill` 更偏 Cursor 使用场景，并明确提示不要写入 `~/.cursor/skills-cursor/`（该目录由系统管理）。

## Practical Recommendation
- 对 Cursor 内置技能（`~/.cursor/skills-cursor/`）：
  - 不建议手工改写。
  - 通过升级 Cursor 客户端获取内置技能更新。
- 对 Claude 技能（`~/.claude/skills/`）：
  - 可手工维护与升级。
  - 若你主要在 Claude Code 内使用 MiniMax 接力，优先参考 `skill-creator` 的流程与格式。

## Suggested Next Step
- 保持“兼容优先”的 frontmatter：
  - 必填：`name`, `description`
  - 可选：`license`, `compatibility`, `metadata`（按需）
- 新建自定义技能时，放在项目级目录（如 `.claude/skills/` 或 `.cursor/skills/`），不要放到系统内置目录。
