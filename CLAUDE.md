# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库定位

这是《Coding实战》——仓库主人（AI 产品经理）系统学习 Coding 全栈能力的**学习沉淀仓库**。学习方式是**边做边推进**：不预设完整路线，每次确定一个模块，做出真实产物后沉淀在这里。已完成的第一个模块是 Git 标准开发流程。

远程仓库：https://github.com/Zhiheng-07/coding-practice （公开）

## 工作方式（重要）

**所有改动必须走标准开发流程**——这既是仓库规范，也是仓库主人的持续练习：

1. `git checkout main && git pull` 同步主线
2. `git checkout -b <type>/<topic>` 开功能分支（type 用 feat / fix / chore / docs）
3. 小粒度 commit，message 用中文写清意图（「新增冲突模拟器」而不是「修改」）
4. push 前 `git pull origin main` 合入主线
5. 用 `gh pr create` 开 PR，描述含「做了什么 / 怎么验证」
6. **Squash and merge**（`gh pr merge N --squash --delete-branch`），保持 main 历史一条 PR 一条记录
7. 合并后：切回 main、pull、删本地分支

不要直接在 main 上提交。每个 PR 是一次完整的流程练习，PR 历史本身就是学习记录。

## 目录结构

```
Git标准开发流程.html   # 模块一产物：交互式教学网站（单文件、离线可用）
文档信息/              # 模块一的原始学习素材（问答记录）
项目进度.md            # 状态快照：各模块完成情况与下一步
项目日志.md            # 追加式流水：每次学习/开发活动的记录
```

后续新模块的产物与素材如何组织，到时按需决定，不预设结构。

## 进度与日志的维护规则

- **每个会话结束前**，在 `项目日志.md` 顶部追加一条当日记录（做了什么、产出在哪、关键收获），日期倒序
- 一个模块完成或状态变化时，同步更新 `项目进度.md`
- 这两个文件的更新随当次功能分支一起提交，不单独开分支

## 内容约定

- 全中文写作；专业术语保留英文原文并配中文解释
- 教学类 HTML 产物必须是**单文件、零依赖、离线双击可用**（CSS/JS 内嵌，不引用 CDN；剪贴板等 API 需考虑 file:// 场景降级）
- HTML 产物验证方式：`python3` 做标签配对校验，`node --check` 校验内嵌 JS 语法，浏览器打开确认交互
- 不修改 `文档信息/` 下的原始学习素材
