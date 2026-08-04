# 调研笔记 A：Boris Cherny 与 Claude Code 官方最佳实践

> 调研时间：2026-08-04。所有必查来源均读到原文（VentureBeat 返回 403，改用 Slashdot 对同一 X 帖的转述替代，已标注）。

## A1 Boris Cherny 个人工作流

**核心理念**：把 Claude 当作「可委派的工程师」而非「需要牵着走的结对程序员」；人类的杠杆在于并行开多个实例、给每个实例可自动运行的验证闭环、并把纠错沉淀进 CLAUDE.md 形成复利。他称验证闭环是拿到好结果的第一要素，团队知识沉淀让「Claude 可以一直跑下去」。[2][3]

**具体工作法**

1. 终端并行开 5 个 Claude，标签页编号 1-5，开系统通知提醒哪个实例需要输入；浏览器 claude.ai 上再跑 5-10 个，用 teleport 命令在云端和本地之间交接会话 [4]
2. 每个标签页用独立 git checkout/worktree，并行改动互不冲突；团队多数人偏好 worktree（`claude --worktree`）[2][4]
3. 早期习惯：会话从 plan mode 开始，先迭代计划再放手实现，「几乎每次都能一次成型」；靠此节奏日产 20-30 个 PR [3]
4. 2026 年更新：Opus 4.6+ 后他认为「新模型不再需要显式规划步骤」，同步任务直接用 auto mode [2]
5. 第一法则是给 Claude 可自行运行的验证手段（前端用浏览器截图、后端用测试套、移动端用模拟器），他称这能让最终质量提升 2-3 倍 [2]
6. CLAUDE.md 全队共用一份、进 git、每周更新多次；Claude 出错时不重复口头纠正，而是把规则写进 CLAUDE.md [2]
7. 常用流程封装成 subagents 存 `.claude/agents/`：code-simplifier、verify-app、code-architect、oncall-guide 等 [2]
8. 重复提示封装成 slash commands 存 `.claude/commands/` 并进 git，如 /commit-push-pr、/techdebt、/batch [2]
9. 不跳过权限确认，而是用 /permissions 预放行安全命令（通配符如 `Bash(bun run *)`），allowlist 存进团队 settings.json [2]
10. 中途走偏时用 /rewind 回滚重新下 prompt，而不是在被失败尝试污染的上下文里继续纠正 [2]
11. 上下文极简主义：只告诉模型必需信息 + 获取更多上下文的途径，让它自己查 [2]
12. 全程用 Opus 最强档（"I use Opus 4.5 with thinking for everything"），难题和长时异步任务开最高推理档；接受约 10-20% 的会话废弃率 [4][2]
13. 长时任务用 /loop（本地循环至 3 天）、/schedule（云端定时）、/goal（直到条件满足，如「所有测试通过」）[2]
14. 大型迁移/重构用 dynamic workflows + /batch 扇出到几十个 worktree agent 并行执行 [2]
15. 何时人工接管：系统性错误→写入 CLAUDE.md；中途跑偏→/rewind；验证失败→挂 /goal 让它继续；用 agent 总览视图统一监控所有会话 [2]

**可引用原话**

- "I run 5 Claudes in parallel in my terminal… I number my tabs 1-5, and use system notifications to know when a Claude needs input." ——「我在终端并行跑 5 个 Claude……标签页编号 1-5，用系统通知知道哪个 Claude 需要我输入。」（X 帖，经 [4] 转述引用）
- "Probably the most important thing to get great results out of Claude Code — give Claude a way to verify its work." ——「要从 Claude Code 拿到好结果，最重要的一件事：给它一个验证自己工作的方式。」[2]
- "Anytime we see Claude do something incorrectly we add it to the CLAUDE.md… If you can do this, then Claude can just run forever." ——「每次看到 Claude 做错，我们就写进 CLAUDE.md……做到这点，Claude 就能一直跑下去。」[2]
- "Treat it like an engineer you're delegating to, not a pair programmer you're guiding." ——「把它当作你委派任务的工程师，而不是你手把手带的结对程序员。」[2]

**访谈补充**[3]：Claude Code 的「agentic search」本质就是 glob+grep，实测胜过 RAG/向量库；团队弃用 PRD 和静态 Figma 稿，直接做原型（「如果从 PRD 开始根本不可能按时发布」）；他认为工程师的关键能力正从深度专注转向「快速在多个上下文间切换」。

## A2 Anthropic 官方最佳实践（去重后独有内容）

**核心主张**：一切最佳实践围绕一个约束——上下文窗口填满后性能退化，上下文是最需要管理的资源。[1]

**具体做法**

1. 四段式工作流：Explore（plan mode 下只读探索）→ Plan（直接编辑计划）→ Implement（实现+按计划验证）→ Commit/PR；但一句话能描述的 diff 直接做，不必规划 [1]
2. Prompt 要具体：指明文件、场景、约束、参照的既有模式；bug 报告给症状+可能位置+「修好」的定义，先写复现测试再修 [1]
3. CLAUDE.md 保持精简，逐行自问「删掉这行 Claude 会犯错吗」，过长会导致规则被淹没；只放广泛适用的内容，偶发领域知识改用 skills 按需加载 [1]
4. 验证四档强度：单条 prompt 内自查 → /goal 条件门 → Stop hook 确定性拦截 → 新上下文 subagent 对抗复核；并要求 Claude 出示证据（测试输出/截图）而非口头宣称成功 [1]
5. 必须每次执行的动作用 hooks（确定性）而非 CLAUDE.md（建议性）[1]
6. 大功能先让 Claude 反向面试你（逐项提问），产出 SPEC.md 后开新会话干净执行 [1]
7. 会话管理：/clear 分隔无关任务；同一问题纠正超过两次就 /clear 重写更好的初始 prompt；调研类任务交 subagent 隔离上下文 [1]
8. 多会话质量模式：Writer/Reviewer 双会话（新上下文评审不会偏袒自己刚写的代码）、一个写测试另一个写实现 [1]
9. 批量迁移：生成文件清单 → 脚本循环 `claude -p` 逐个处理（`--allowedTools` 限权），先试 2-3 个文件调好 prompt 再全量跑 [1]
10. 对抗性评审要限定「只报影响正确性的缺口」，否则评审者为完成任务会过度报告，导致过度工程 [1]
11. 团队案例：安全工程团队从「设计文档→烂代码→放弃写测试」转为「要伪代码→引导 TDD→定期检查」，事故诊断提速 3 倍；产品设计直接喂 Figma 文件建自主循环（写码-测试-迭代）[5]

## 出处清单

- [1] Claude Code: Best practices — https://code.claude.com/docs/en/best-practices （原 anthropic.com/engineering/claude-code-best-practices，308 重定向至此）— 官方文档 — 2025 年 4 月首发，持续更新
- [2] Claude Code Tips by Boris Cherny — https://howborisusesclaudecode.com — 本人 X 帖系列（2026-01-02 起，Part 1-15）的第三方整理合集 — 2026 年
- [3] Building Claude Code with Boris Cherny — https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny — 访谈 — 2026-03-04
- [4] Creator of Claude Code Reveals His Workflow — https://developers.slashdot.org/story/26/01/06/2239243/creator-of-claude-code-reveals-his-workflow — 二手（转述 X 原帖，含直接引语；VentureBeat 原报道 403 无法抓取）— 2026-01-06
- [5] How Anthropic teams use Claude Code — https://claude.com/blog/how-anthropic-teams-use-claude-code — 官方案例合集 — 2025 年

> 备注：[2] 为粉丝整理站但逐条对应 Boris 本人 X 帖原文，视为准一手；[4] 中「员工不受 API 计费约束、普通用户成本高」是社区评论观点，非 Boris 主张。
