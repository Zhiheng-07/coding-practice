# 调研笔记 D：独立实践者（海外 + 中文圈）

> 调研时间：2026-08-04。除标注外均为一手来源直接核读。

## D1 Andrej Karpathy

**一句话定位**：前 Tesla AI 总监、OpenAI 创始成员，"vibe coding" 一词的创造者——他既定义了这个概念，也是最早公开划定其边界的人。

**核心主张**
- Vibe coding = 完全放手给 AI、不看 diff、不读代码，靠对话和语音驱动开发 [1]
- 适用边界从一开始就写在原帖里：适合「随手做的周末项目」，不是生产方法论 [1]
- 后续用亲身实践反证边界：严肃项目他仍手写代码 [3]

**具体工作法**
- 用语音对着 Cursor Composer 说需求，连键盘都少碰 [1]
- 「Accept All」全部接受、不读 diff；报错就原样贴回去，通常能修好 [1]
- 代码超出自己理解范围时，绕过 bug 或反复要求随机修改直到消失 [1]
- 2025-10 发布 nanochat 时明确承认：整个仓库「基本全部手写」，Claude/Codex agent 在偏离训练分布的新颖代码库上「完全不够好、净帮倒忙」[3]
- 2026-02 一周年回顾：承认原帖只是「洗澡时的随手一发」，恰好给当时大家共同的感受起了个名字 [2]

**可引用原话**
- "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists." —— 有一种新的编程方式我称之为 vibe coding：完全交给感觉、拥抱指数增长、忘掉代码本身的存在。[1]
- "It's not too bad for throwaway weekend projects." —— 对于用完即弃的周末项目来说还不赖。[1]

## D2 Simon Willison

**一句话定位**：Django 联合创造者、Datasette 作者，三年多持续在博客记录 LLM 辅助编程实践，是该领域最系统的第一手记录者。

**核心主张**
- 用 LLM 写码并不简单，是需要练习的技能；把它当「数字实习生」而非魔法 [4]
- 测试验证是唯一不可外包给机器的环节 [4]
- Vibe coding ≠ 一切 AI 辅助编程：读过、理解过、能负责的 AI 生成代码不叫 vibe coding [5]

**具体工作法**
- 上下文为王：主动预填已有代码和文档进上下文，精确控制模型看到什么 [4]
- 下「威权式」指令：给出函数签名、技术选型、精确规格，而非开放式提问 [4]
- 必须亲手运行验证：「你绝对不能外包给机器的一件事，就是测试代码真的能跑」[4]
- 首次输出不好不算失败，当作对话式迭代的起点 [4]
- 用 vibe coding 做可抛弃原型来建立对模型能力的直觉，但生产代码必须逐行负责 [4][5]

**可引用原话**
- "If someone tells you that coding with LLMs is easy they are (probably unintentionally) misleading you." —— 如果有人说用 LLM 写码很容易，他（可能无意中）在误导你。[4]
- "The one thing you absolutely cannot outsource to the machine is testing that the code actually works." —— 唯一绝对不能外包给机器的，是验证代码真的能工作。[4]

## D3 Armin Ronacher

**一句话定位**：Flask 作者，2025 年从怀疑者转为重度 agentic coding 实践者，输出了一整个系列的工程化实操文章（含失败复盘）。

**核心主张**
- 技术栈应为 agent 优化选型：生态简单、编译快、测试快的语言（他选 Go）让 agent 循环效率倍增 [6]
- 工具与可观测性是 agent 效率的核心杠杆：快速、防误用、日志可读 [6]
- 诚实记录失败：也专门写了哪些做法没用（如过度工程化的 workflow）[7]

**具体工作法**
- 主力 Claude Code + 便宜模型，几乎全程 hands-off [6][8]
- 后端新项目选 Go：显式 context 传递、测试缓存、低生态波动都利于 agent [6]
- 写「能工作的最笨代码」：简单函数 + 描述性命名，裸 SQL 而非 ORM，权限检查就地可见 [6]
- 关键工具用 Makefile 封装并带日志，让 agent 能自己读 log 诊断 [6]
- 优化 token 效率，尽量避免截图和浏览器交互 [6]

**可引用原话**
- "Quick, clear tool responses are vital… quick compilation and execution significantly boost productivity of the agent." —— 快速清晰的工具响应至关重要……快编译快执行能显著提升 agent 生产力。[6]
- "Agents handle tasks effectively until project complexity surpasses some manageable thresholds." —— 在项目复杂度越过可控阈值之前，agent 都能有效干活。[6]

## D4 Mitchell Hashimoto

**一句话定位**：HashiCorp（Terraform）创始人、终端模拟器 Ghostty 作者，展示了顶尖工程师如何在高质量真实开源项目中使用 AI。

**核心主张**
- AI 擅长原型、填空式任务；架构、复杂调试、最终评审必须留给人 [9]
- 绝不发布自己不理解的代码 [9]
- 要识别 AI 的失效点：连续修不动时「AI 不再是解法，而是负债」[9]

**具体工作法**
- 先自己完成规划、确定大方向，之后才引入 AI 咨询 [9]
- 委派给 AI：UI 原型与样式迭代、带 TODO 的脚手架补全、测试/模拟生成、文档更新、被打断时修构建错误 [9]
- 自己负责：架构决策、view model 结构、AI 反复失败后的复杂调试 [9]
- 发布前必做完整人工评审 + 清理重构，以此强迫自己不盲目接受 AI 代码 [9]

**可引用原话**
- "I'm not shipping code I don't understand." —— 我不会发布我不理解的代码。[9]
- "Please don't ever ship AI-written code without a thorough manual review." —— 请永远不要在没有彻底人工评审的情况下发布 AI 写的代码。[9]

## D5 Thorsten Ball

**一句话定位**：《Writing an Interpreter in Go》作者、Sourcegraph Amp 团队成员，既写了广为流传的「315 行代码构建 agent」教程，也系统输出了自己用 agent 编程的方法。

**核心主张**
- Agent 没有护城河：本质是「一个 LLM、一个循环、足够的 token」，难在反馈回路与集成 [12]
- Agent 是「会编辑你代码的外星智能」，是范式变化而非高级补全 [10][11]
- 紧凑反馈回路 > 复杂编排：他明确表示不看好 subagent、prompt 优化器等方向 [11]

**具体工作法**
- 把 agent 当 Google/Stack Overflow 一样的实用工具用，不带意识形态立场 [11]
- 关键在给 agent 正确的反馈：编辑器集成、系统提示调优、在正确时机喂正确信息 [10][11]
- 团队实践：Amp 每天发版 15 次、不做传统 code review，用部署速度换学习速度 [11]
- 通过亲手构建（315 行 agent 教程）来形成判断，而非空谈 [12]

**可引用原话**
- "Being able to talk to an alien intelligence that edits your code changes everything." —— 能与一个会编辑你代码的外星智能对话，改变了一切。[10]
- "There is no moat." —— （构建 agent）没有护城河。[12]

## D6 宝玉（dotey）

**一句话定位**：《软件工程之美》作者、前微软 MVP，中文圈把软件工程方法论嫁接到 AI 编程上最系统的传播者（X @dotey / 博客 baoyu.io）。

**核心主张**
- 用好 Coding Agent「重点是两头」：开头把需求和 Plan 做对，结尾把验证闭环做好 [13][14]
- AI 编程的本质仍是软件工程：设计（模块化、松耦合）和清晰上下文决定生成质量 [15]
- 大部分 workflow 场景可被 Agent + Skills 架构替代 [15]

**具体工作法**
- 新功能不直接叫 Agent 写：先整理需求，发给三个不同 Agent（Codex/Claude Code/Cursor）开 Plan 模式各写方案，用最好的模型，对比后再执行 [13]
- 提示词里固定加「请写测试并验证测试通过」，给 Agent 提供自我验证手段，让它自己测试-修改直到完成 [14]
- 提示词/Skill 按「目标→想法→编写→测试→评估→迭代」循环打磨 [15]
- 把可复用流程沉淀为 Skill（出版《图解 Skill》，维护公开技能集）[15]

**可引用原话**
- 「用好 Coding Agent，重点是两头，尤其是开头的部分，如果一开始就走偏了后面怎么改都改不好。」[13]
- 「为 Agent 提供验证结果的方法，这样 Agent 就会自己去测试去修改，直到完成任务。」[14]

## D7 歸藏（guizang）

**一句话定位**：X @op7418 / 公众号「歸藏的AI工具箱」主理人，中文圈 AI 工具高频实测者，特点是把个人审美和工作流封装成可复用的开源 Skill。

**核心主张**
- 工作流应产品化：把经验固化为 Skill/提示词，让任何人复制即用 [16][17]
- 对 AI 输出「约束比自由更重要」：用锁定的模板、校验脚本防止 agent 产出漂移 [16]

**具体工作法**
- 将 PPT/社交卡片等产出流程编码为 8 步 Skill：需求澄清七问 → 模板复制 → 内容填充 → 可选生图 → checklist 自检（P0-P3 分级）→ 校验脚本 → 预览 → 迭代 [16]
- 用 Node 校验脚本 + Playwright 像素级检查做机器自检，不依赖人眼 [16]
- 锁死设计自由度（仅预设主题、22 种命名版式、禁止即兴发明），换取 agent 输出稳定 [16]
- 高频转译/实测官方最佳实践并附自己的复现提示词 [17]
- 注：其体系化长文主要在微信公众号，一手帖以 X 和 GitHub README 为准 [16][17]

**可引用原话**
- 「保护美学比给自由更重要。」（guizang-ppt-skill 设计原则）[16]
- 「直接复制提示词给 Claude Code 或者 Cursor，它就能帮你安装了。」[17]

## D8 观点光谱总结

1. **「要不要读 AI 写的每行代码」是最大分歧轴**。Karpathy（vibe 模式）一端：不读 diff、Accept All——但他自己限定在玩具项目；Willison/Hashimoto 另一端：不理解不发布、发布前必人工评审；Ball 团队甚至取消传统 code review，但以高频部署+快速回滚兜底。共识其实是「责任跟着风险走」：所有人都同意生产代码需要人负责，分歧只在验证手段（读代码 vs 行为验证 vs 部署反馈）。
2. **验证闭环自动化是跨圈共识**。Willison 的「测试不可外包」、宝玉的「给 Agent 验证手段让它自己修」、歸藏的校验脚本自检、Armin 的可读日志——殊途同归：让 agent（或人）能廉价地确认「真的能跑」。
3. **「开头对齐」比「过程纠偏」重要**。Hashimoto 先规划后引入 AI、宝玉的多 Agent Plan 对比、歸藏的需求澄清七问，都把重心压在任务定义阶段；与 Karpathy「走一步看一步」的 vibe 模式形成方法论对照。
4. **环境工程是新分工**。海外三位工程师（Armin/Ball/Hashimoto）强调为 agent 改造技术栈与反馈回路（选 Go、快工具、编辑器集成）；中文两位更强调把工作流封装成可分发的 Skill/提示词资产——前者优化「agent 干活的环境」，后者优化「人复用经验的载体」。
5. **对 agent 能力边界的判断趋同**：复杂度或新颖度越过阈值 agent 即失效（Armin 的「可控阈值」、Karpathy 的「偏离数据分布」、Hashimoto 的「负债」时刻），此时人必须接管——没有任何一位主张全自动。

## 出处清单

- [1] Karpathy vibe coding 原帖 — https://x.com/karpathy/status/1886192184808149383 — X 帖 — 2025-02-02
- [2] Karpathy 一周年回顾帖 — https://x.com/karpathy/status/2019137879310836075 — X 帖 — 2026-02
- [3] Inventor of Vibe Coding Admits He Hand-Coded His New Project — https://futurism.com/artificial-intelligence/inventor-vibe-coding-doesnt-work — 报道（含 Karpathy nanochat 原话） — 2025-10
- [4] Here's how I use LLMs to help me write code — https://simonwillison.net/2025/Mar/11/using-llms-for-code/ — 博客 — 2025-03-11
- [5] Not all AI-assisted programming is vibe coding — https://simonwillison.net/2025/Mar/19/vibe-coding/ — 博客 — 2025-03-19
- [6] Agentic Coding Recommendations — https://lucumr.pocoo.org/2025/6/12/agentic-coding/ — 博客 — 2025-06-12
- [7] Agentic Coding Things That Didn't Work — https://lucumr.pocoo.org/2025/7/30/things-that-didnt-work/ — 博客 — 2025-07-30
- [8] A Year of Vibes — https://lucumr.pocoo.org/2025/12/22/a-year-of-vibes/ — 博客 — 2025-12-22
- [9] Vibing a Non-Trivial Ghostty Feature — https://mitchellh.com/writing/non-trivial-vibing — 博客 — 2025
- [10] How I program with agents — https://ampcode.com/how-i-program-with-agents — 博客（原站现需登录，内容经 [11] 转引核对） — 2025
- [11] Thorsten Ball's Agentic Coding Vision（摘录页） — https://self.md/people/thorsten-ball-amp/ — 三方摘录 — 2025
- [12] How to Build an Agent 发布帖 — https://x.com/thorstenball/status/1912178069336396186 — X 帖 — 2025-04
- [13] 宝玉：用好 Coding Agent 重点是两头 — https://x.com/dotey/status/2059773942500298934 — X 帖 — 2025-11
- [14] 宝玉：为 Agent 提供验证结果的方法 — https://x.com/dotey/status/1952171388015370408 — X 帖 — 2025-08
- [15] 宝玉的分享（博客汇总） — https://baoyu.io/ — 博客 — 持续更新
- [16] guizang-ppt-skill README — https://github.com/op7418/guizang-ppt-skill — GitHub（一手） — 2025-2026
- [17] 歸藏 X 帖（工具实测/Skill 发布） — https://x.com/op7418/status/2010193224732946808 等 — X 帖 — 2025-2026
