# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 背景（新 session 无需用户重复交代，读完本文件即可开工）

- 仓库主人：AI 产品经理，正在系统学习 Coding 全栈能力，方式是**边做边推进**——不预设路线，每次确定一个模块，做出真实产物沉淀在这里
- 用户只会输入任务本身；背景、规范、状态一律以本文件和下方路由文件为准，不要要求用户重复交代
- 远程仓库：https://github.com/Zhiheng-07/coding-practice （公开，账号 Zhiheng-07）
- 当前状态：模块 01（Git 标准开发流程）已完成 v1.1；下一个模块未定

## 文件路由（按需读取，控制 token）

| 文件 | 内容 | 何时读 |
|---|---|---|
| `项目进度.md` | 各模块状态快照 + 下一步 | 需要了解全局进展时（始终很短） |
| `项目日志.md` | 追加式活动流水，只增不改 | **默认不读**；用户问历史时读顶部若干条即可 |
| `01-Git标准开发流程/` | 模块 01 的 HTML/md/CHANGELOG/素材 | 任务涉及该模块时 |

- 项目日志超过约 300 行时：旧条目移入 `归档/项目日志-YYYY.md`，主文件只留最近条目
- 本文件保持精简（< 90 行），新增规范优先挂到对应模块目录，不堆在这里

## 工作纪律（所有改动，包括纯文档）

1. `git checkout main && git pull` → `git checkout -b <type>/<topic>`（type: feat / fix / chore / docs）
2. 小粒度 commit，中文 message 写意图；push 前 `git pull origin main`
3. `gh pr create`（描述含「做了什么 / 怎么验证」）→ **Squash and merge** → 删分支收尾
4. 不直接在 main 上提交。每个 PR 是一次流程练习，PR 历史即学习记录

## 模块结构与同步规则（重要）

每个学习模块一个编号目录（如 `01-Git标准开发流程/`），内含：

```
NN-模块名/
  模块名.html    # 可随时单独分享的单文件教学站（零依赖、离线可用）
  模块名.md      # HTML 的完整文字镜像
  CHANGELOG.md   # 版本记录（vX.Y + 变更点）
  素材/          # 原始学习素材（问答记录等），不修改
```

**三处同步铁律**：任何修改模块 HTML 内容的 PR，必须在同一 PR 内更新对应 md 镜像和 CHANGELOG，合并后用 obsidian CLI 覆盖 vault 中 `Coding实战/NN-模块名/模块名.md`（遵守 ~/.claude/rules/obsidian.md）。三处（HTML / 仓库 md / Obsidian）内容一致才算完成。

**版本记录**：内容里程碑在 main 上打 tag（如 `git-v1.1`）并 push；不在模块内嵌套 git init。

**HTML 扩展方向**（模块 02 出现时实施）：单 HTML 演进为多模块「学习站」——顶部加模块导航，现有 Git 内容成为模块 01 分区，仍保持单文件离线可分享。

## 内容约定

- 全中文；专业术语保留英文并配解释
- HTML 产物验证：python3 标签配对校验 + `node --check` 内嵌 JS + 浏览器打开确认交互；剪贴板等 API 需做 file:// 降级
- 教学内容基于用户的真实学习素材（问答记录）定制，引用用户原话做误区对照效果最好

## 会话收尾清单

1. `项目日志.md` 顶部追加当日条目（做了什么 / 产出在哪 / 关键收获），随当次分支一起提交
2. 模块状态有变化 → 同步更新 `项目进度.md`
3. 改了模块内容 → 检查三处同步铁律是否闭环
