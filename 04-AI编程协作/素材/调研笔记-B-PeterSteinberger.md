# 调研笔记 B：Peter Steinberger（OpenClaw/小龙虾）

> 调研时间：2026-08-04。[1][2][4][5][6] 均实际抓取原文，[7] 为搜索结果转述。

## B1 核心理念

他把这套方法称为 **agentic engineering**，与「prompt 完就祈祷」的 vibe coding 划清界限。根本主张：模型已经够强，**别搭花架子（RAG、subagent 框架、spec 驱动），直接跟它说话、靠高频交互练出直觉**；工程师的角色从写代码/读代码转为**设计闭环、并行调度、验证行为**——"我不再读代码，我看代码流过，验证的是行为而不是文本" [1][2]。模型选择是实用主义：2025 年 8 月主力还是 Claude Code，10 月已换成 GPT-5-Codex，谁好用换谁 [1]。

## B2 具体工作法

1. 同时开 **3–8 个 agent**，3×3 终端网格里跑 CLI，**大多在同一个文件夹**，不搞 worktree/分支隔离 [1][2]
2. 指令极短（常 1–2 句），约一半 prompt 附截图给视觉上下文；像对一个内向工程师说话，不用「激励话术」 [1]
3. 用**消息队列**批量排任务，而不是实时盯着微操；中途不满意直接打断，从断点继续，几乎不整体回滚 [1][2]
4. **直接 commit 到 main**，靠 agent 做原子提交；「开发像绕山上行，不走直线」，错了让模型改，而不是 revert [2]
5. 验证靠**行为闭环**：一个 dev server 常驻，浏览器实时看 UI 变化；出 bug 不记 issue，**立刻 prompt 修** [1][2]
6. 测试分层对待：逻辑密集的功能要求 agent 写完立刻补测试（能挖出实现 bug）；UI 微调不写测试；人工 code review 极少，靠 CI 和 GitHub bot 评论闭环 [1]
7. 上下文管理：维护约 **800 行 Agents.md**（产品模式、API 约定、AST-grep 规则），并预期它随模型知识更新而变短；「上下文是稀缺资源」 [1][4]
8. **拒绝 RAG/向量库**（模型自己搜代码库够快）、**拒绝 subagent**（不透明，宁要多个可见终端）、**大部分 MCP 该做成 CLI**——GitHub MCP 吃 2.3 万 token，`gh` CLI 免费；「Agent 调用 CLI 的能力比调 MCP 强多了」 [1][4]
9. 约 20% 时间做重构，全部由 agent 执行；用 jscpd 查重复、knip 查死代码、ESLint 插件守质量——这是高速迭代背后的纪律 [1]
10. 速度来自**前置设计清晰**：先定框架、docs/*.md 承载文档式上下文、跨项目让 agent 搬运已验证模式、把难解释的领域知识沉淀成 skills [2]
11. 订阅制堆算力：多个订阅（约 $1k/月）换近乎无限 token，远便宜于 API 计费 [1]
12. 进阶主张：「你不该再给 coding agent 写 prompt，你该设计会自动 prompt agent 的循环」（推文，转引） [7]
13. OpenClaw 起点即此法：约一小时把 WhatsApp + Claude Code 胶水拼成原型；此前已用同法做了 43 个项目 [4][5]

## B3 可引用原话

- "Don't waste your time on stuff like RAG, subagents, Agents 2.0 or other things that are mostly just charade. Just talk to it."——别把时间浪费在 RAG、subagent、Agents 2.0 这类多半是表演的东西上，直接跟它说话。 [1]
- "These days I don't read much code anymore."——这些天我基本不读代码了（改为看流式输出、验证行为）。 [2]
- "I simply commit to main."——我就直接提交到 main。 [2]
- 「AI 带来的生产力提升是 20–30%，不是很多人鼓吹的 10x 或 100x」；「我们正在用深度理解换取快速方案，当下感觉很好，但以后会付出代价」。 [4]

## B4 争议与边界（教学材料的重要部分）

1. **「不读代码、直推 main、少测试」是高信任高风险打法**：适合单人自有项目，他本人也承认深夜 vibe coding「第二天后悔」，且初级开发者照搬会跳过「挣扎学习」、封死技能天花板 [4][5]
2. **安全边界靠用户自觉**：OpenClaw 早期「没有沙盒也没安全措施」，提示注入未解决（他自设金丝雀文件监测），用户把调试端口暴露公网屡禁不止；他的立场是「拦不住滥用，只劝别玩火」，后补容器沙盒——教学上应反向强调最小权限 [6]
3. **AI 辅助写作诚信争议**：其博客曾被 lobste.rs 以「startup slop」封禁；他的回应是问题在「是否诚实标注」而非工具本身 [4]

## 出处清单

- [1] Just Talk To It – the no-bs Way of Agentic Engineering — https://steipete.me/posts/just-talk-to-it — 博客（一手） — 2025-10-14
- [2] Shipping at Inference-Speed — https://steipete.me/posts/2025/shipping-at-inference-speed — 博客（一手） — 2025-12-28
- [3] OpenClaw, OpenAI and the future — https://steipete.me/posts/2026/openclaw — 博客（一手，加入 OpenAI 及基金会安排） — 2026-02-14
- [4] 龙虾、倦怠与重燃：Peter Steinberger 和他带给世界的 OpenClaw — https://www.infoq.cn/article/e0gyUzRvzU263FTBePdw — InfoQ 深度报道/访谈（中文） — 2026
- [5] OpenClaw 之父加入 OpenAI 前最后的访谈 — https://www.ifanr.com/1655353 — 爱范儿访谈（中文） — 2026-02
- [6] 龙虾之父新访谈：拦不住滥用，只劝大家别玩火 — https://www.qbitai.com/2026/02/382040.html — 量子位访谈编译（二手） — 2026-02
- [7] @steipete 推文 — https://x.com/steipete/status/2063697162748260627 、https://x.com/steipete/status/2005451576971043097 — X 推文（转引） — 2025-12
