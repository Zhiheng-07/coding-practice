# 调研笔记 C：平台官方方法论

> 调研时间：2026-08-04。四家平台的官方文档均已读取原文。

## C1 Claude Code

**平台的方法论主张**：官方把 Claude Code 定位为"agentic coding environment"——你描述目标，Claude 自己探索、计划、实现；核心约束是上下文窗口，几乎所有最佳实践都围绕"管理上下文"和"给 Claude 一个可自动运行的验证信号"展开，目标是把人从逐步监工变成结果验收者。[1]

**关键机制与推荐用法**

- **CLAUDE.md**：每次会话自动加载的项目记忆文件；`/init` 生成初稿，只写"删掉就会出错"的内容（构建命令、风格差异、仓库规矩），过长反而导致规则被忽略；支持 `@path` 导入、home/项目/父子目录多级放置，`CLAUDE.local.md` 存个人配置。[1]
- **Plan mode（先探索→计划→实现→提交）**：只读不改的探索模式；官方四阶段工作流 Explore/Plan/Implement/Commit；小改动明确时应跳过计划直接做。[1]
- **可验证性（最核心主张）**：给 Claude 一个能跑的 check（测试/构建/截图对比），从一次性 prompt → /goal 持续条件 → Stop hook 硬闸 → 独立 subagent 复核，逐级加码；要求 Claude 出示证据而非口头宣布完成。[1]
- **Subagents**：`.claude/agents/` 定义专职助手，独立上下文+受限工具；官方推荐用于调研（不污染主上下文）和对抗式 review（fresh context 不偏袒自己写的代码）。[1]
- **Hooks**：确定性脚本，用于"必须每次发生、零例外"的动作（如每次编辑后跑 lint），与 CLAUDE.md 的"建议性"形成对照。[1]
- **权限模型**：默认逐项审批；三条减负路径——auto mode（分类器模型拦截危险操作）、/permissions 允许清单、/sandbox OS 级隔离。[1]
- **Headless / 横向扩展**：`claude -p` 非交互跑 CI/脚本；fan-out 循环批量迁移文件配 `--allowedTools` 限权；worktree/云端并行多会话，Writer/Reviewer 双会话模式。[1]
- **Skills**：`.claude/skills/` 存按需加载的领域知识和可复用工作流，避免塞爆 CLAUDE.md。[1]
- **会话管理**：/clear 分隔无关任务；纠正两次仍错就 clear 重开更好的 prompt；/rewind 检查点回滚支持"大胆试错"。[1]
- **需求访谈**：大功能先让 Claude 逐项访谈你、写成 SPEC.md，再开干净新会话执行。[1]

## C2 OpenAI Codex

**平台的方法论主张**：Codex 是"可配置的工程队友"，形态覆盖 CLI/IDE 扩展/ChatGPT 云端/GitHub code review/SDK；官方主张把可复用规则沉淀到 AGENTS.md 和分层配置，任务像写 GitHub issue 一样描述，云端异步委派+本地实时迭代双轨并行，review 由 Codex 常态化承担（OpenAI 内部 100% PR 由 Codex review）。[2][3][4]

**关键机制与推荐用法**

- **AGENTS.md 规范**：开放格式的 agent 指导文件；层级为 `~/.codex/AGENTS.md`（全局）→ Git 根到当前目录逐级覆盖，越近越优先；写仓库布局、构建/测试命令、lint 与文档标准、review 规则；默认 32KiB 上限。[3]
- **Prompt 四要素**：目标、上下文、约束、完成标准；按任务难度选推理级别。[4]
- **计划先行**：复杂任务先让 Codex 出计划——计划模式、让它提澄清问题、或 PLANS.md 模板。[4]
- **配置分层**：个人默认 `~/.codex/config.toml`，仓库级 `.codex/config.toml`，命令行仅一次性覆盖——"持久规则写进配置而非每次 prompt"。[4]
- **云端 vs 本地**：cloud 为每个任务开隔离容器、跑 setup、循环执行并返回 diff，适合异步委派；本地 CLI 适合实时迭代；本地并行任务官方建议用 git worktree。[2][4]
- **Review 机制**：/review 命令做 PR 式审查；GitHub 上可自动 review 或 @mention 触发；官方口径是"委派清晰任务、盯过程、你自己拥有 review 责任"，测试/lint/类型检查跑过才接受。[2][4]
- **权限与沙箱**：从默认权限起步、按需放宽；"过早给完全权限"列为常见陷阱。[4]
- **Skills 与定时任务**：重复工作流封装为 skill（`.agents/skills` 团队共享）；稳定后可设为后台定时任务。[4]

## C3 Cursor

**平台的方法论主张**："规划先于编码"——Plan Mode 让 agent 先研究、提澄清问题、产出可编辑的 Markdown 计划再执行；出错时"回到计划重跑"优于逐步修补；rules 提供持久上下文，云/本地 agent 分工异步与实时。[6][7]

**关键机制与推荐用法**

- **.cursor/rules 体系**：版本化 `.mdc` 文件，四种触发方式（Always / Auto Attached 按 glob / Agent Requested 按 description / Manual @提及）；也支持嵌套 AGENTS.md，越具体的目录优先。[5]
- **Rules 最佳实践**：聚焦、可执行、<500 行；不要复制 style guide（交给 linter）或复述代码库文档，改为引用规范文件和示例；发现 AI 重复犯错时才增量加规则。[5]
- **Plan Mode**：计划以 Markdown 打开可直接编辑，可存入 `.cursor/plans/` 作为团队文档和后续 agent 的上下文；小任务跳过计划。[6][7]
- **重跑优于修补**：结果不对时 revert + 改计划 + 重跑，比连环 follow-up prompt 更快更干净。[6]
- **验证与审查**：TDD 效果最好；agent 自审 + 推 PR 后 Bugbot 检查。[7]
- **并行**：多模型同题并跑对比结果，用 git worktree 隔离；云 agent 环境要像给人类开发者一样配好。[7][8]

## C4 GitHub Copilot

**平台的方法论主张**：Copilot coding agent 是"接 issue 的异步队友"——适合清晰、边界明确的中小任务，产出以 PR 形式回来由人 review；官方另以开源 spec-kit 主推 spec-driven development，让规格而非代码成为第一产物。[9][10]

**关键机制与推荐用法**

- **copilot-instructions.md**：`.github/copilot-instructions.md` 仓库级指令，写仓库概述、构建/测试/验证命令、架构与文件布局、CI 流程；要求"非任务特定"、不超两页。[9]
- **Path-specific instructions**：`.github/instructions/*.instructions.md` + frontmatter glob 定向生效；兼容根目录 AGENTS.md/CLAUDE.md。[9]
- **任务分派边界**：适合 bug 修复、UI 微调、测试覆盖、文档、技债；不适合跨仓库重构、生产/安全敏感、需求模糊或你想亲自学的任务；issue 要写清问题、验收标准、涉及文件。[10]
- **PR review 循环**：批量提交 review 评论而非逐条，@copilot 触发迭代，agent 直接推 commit 并更新 PR 描述。[10]
- **环境预配置**：copilot-setup-steps.yml 预装依赖，提高 agent 环境可靠性。[10]
- **Spec-kit（spec-driven）**：constitution → specify → plan → tasks → implement → converge 六步命令流，"规格可执行"，支持 30+ agent。[11]

## C5 跨平台共性观察（精华）

1. **项目级上下文文件已成四家标配且格式趋同**：CLAUDE.md / AGENTS.md / .cursor/rules / copilot-instructions.md 职责一致（命令、规范、架构约定），且 Codex、Cursor、Copilot 三家直接兼容 AGENTS.md，事实标准正在收敛；四家都警告"写短、别写 AI 能自己推断的东西"。
2. **计划先行、且计划是可编辑产物**：四家都推"先探索/计划、人审计划、再执行"，并一致提醒小任务跳过计划——计划不是仪式而是防返工。
3. **Agent 自验证闭环**：共同主张是给 agent 可运行的判定信号（测试/lint/构建/截图），让它自己迭代到通过，人只验收证据。
4. **Review 独立于生成**：都强调用与写代码者不同的上下文做审查——fresh-context subagent、/review、Bugbot、PR 人审。
5. **异步委派 + 环境即代码**：四家都在推"云端隔离容器跑任务、返回 diff/PR"的委派模式，且一致强调 agent 环境要预先声明，配合最小权限/沙箱起步。

## 出处清单

- [1] Best practices for Claude Code — https://code.claude.com/docs/en/best-practices — 官方文档 — 现行版，2026-08 访问
- [2] Codex 文档首页 — https://developers.openai.com/codex/ — 官方文档 — 现行版，2026-08 访问
- [3] AGENTS.md — https://developers.openai.com/codex/guides/agents-md — 官方文档 — 现行版，2026-08 访问
- [4] Codex Best practices — https://developers.openai.com/codex/learn/best-practices — 官方文档 — 现行版，2026-08 访问
- [5] Cursor Rules — https://cursor.com/docs/context/rules — 官方文档 — 现行版，2026-08 访问
- [6] Best practices for coding with agents — https://cursor.com/blog/agent-best-practices — 官方博客 — 2026-08 访问
- [7] Cloud Agent Best Practices / Plan Mode — https://cursor.com/docs/cloud-agent/best-practices 、https://cursor.com/docs/agent/plan-mode — 官方文档 — 现行版
- [8] Cursor Plan Mode 发布文 — https://cursor.com/blog/plan-mode — 官方博客
- [9] Adding repository custom instructions — https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot — 官方文档 — 现行版
- [10] Get the best results from Copilot coding agent — https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results — 官方文档 — 现行版
- [11] github/spec-kit — https://github.com/github/spec-kit — GitHub 官方开源项目 README — 2026-08 访问

> 备注：OpenAI 的 developers.openai.com/codex 路径目前 308 重定向到 learn.chatgpt.com 域名（2026-08 观察），内容仍为 Codex 官方文档；引用时保留原 developers.openai.com URL 更稳妥。
