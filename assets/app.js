/* ============================================================
   Git 标准开发流程教学站 · 交互逻辑
   ============================================================ */

/* ---------- 侧边进度条：滚动联动高亮 ----------
   同时对外广播当前区块（sectionchange 事件），供分支生命周期图使用 */
(function initScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item');
  const targets = [];
  let lastId = null;

  navItems.forEach((item) => {
    const el = document.getElementById(item.dataset.section);
    if (el) targets.push({ el, item, id: item.dataset.section });
  });

  function highlight() {
    // 取视口上沿 1/3 处所在的区块作为「当前」
    const line = window.innerHeight / 3;
    let current = targets[0];
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top <= line) current = t;
    }
    navItems.forEach((n) => n.classList.remove('active'));
    if (current) {
      current.item.classList.add('active');
      if (current.id !== lastId) {
        lastId = current.id;
        window.dispatchEvent(new CustomEvent('sectionchange', { detail: current.id }));
      }
    }
  }

  window.addEventListener('scroll', highlight, { passive: true });
  window.addEventListener('resize', highlight);
  highlight();
})();

/* ---------- 分支生命周期图：滚到哪一步，演化到哪一步 ---------- */
(function initLifecycle() {
  const container = document.getElementById('lifecycle');
  if (!container) return;

  const caption = document.getElementById('lc-caption');
  const groups = Array.from(container.querySelectorAll('.lc-st')).map((g) => {
    const m = g.className.baseVal.match(/lc-st-(\d+)/);
    return { g, n: m ? Number(m[1]) : 0 };
  });

  const stageOfSection = {
    'step-2': 1, 'step-3': 2, 'step-3-5': 3,
    'step-4': 4, 'step-5': 5, 'step-6': 6, 'step-7': 7,
  };

  const captions = [
    '开工前：主线上是全团队共享的历史',
    '步骤 2：在最新 commit 上贴了一个新指针 feat/login——纯本地，团队看不见',
    '步骤 3：封了两箱改动 f1、f2，仍然只在你电脑上',
    '步骤 3.5：主线跑出了新 commit m4，把它合入自己的分支（f3），冲突在自己家里解',
    '步骤 4：push 成功——云端出现同名分支，团队第一次看见你',
    '步骤 5：PR 挂起，人工 review + CI 两道检查进行中',
    '步骤 6：Squash 合并——你的三条 commit 在主线上压成一条',
    '步骤 7：分支删除，主线继续前进，你回到干净状态',
  ];

  function setStage(stage) {
    groups.forEach(({ g, n }) => {
      g.classList.toggle('on', n <= stage);
      // 收尾阶段：分支相关元素淡出，只留主线与合并结果
      g.classList.toggle('dim', stage >= 7 && n <= 5);
    });
    caption.textContent = captions[stage];
  }

  window.addEventListener('sectionchange', (e) => {
    const stage = stageOfSection[e.detail];
    if (stage !== undefined) setStage(stage);
    else if (['hero', 'map', 'step-1'].includes(e.detail)) setStage(0);
    // 主线之后的区块不改变图的状态
  });

  setStage(0);
})();

/* ---------- 冲突解决模拟器 ---------- */
(function initConflictSim() {
  const sim = document.getElementById('conflict-sim');
  if (!sim) return;

  const result = document.getElementById('sim-result');
  const resolved = document.getElementById('sim-resolved');
  const note = document.getElementById('sim-note');
  const buttons = sim.querySelectorAll('.sim-choices button');

  const outcomes = {
    ours: {
      code: 'const timeout = 3000;',
      note: '你裁决：维持主线的值。你的分支这次改动在这一处被放弃——这完全合法，冲突解决本来就允许「不采用自己的版本」。',
    },
    theirs: {
      code: 'const timeout = 5000;',
      note: '你裁决：采用自己的值。注意主线那边的 3000 被覆盖了——如果那是别人有意的改动，最好在 PR 里说一声为什么。',
    },
    both: {
      code: 'const timeout = 4000;',
      note: '你裁决：两个版本都不要，另写一个。这也是常见解法——冲突解决不是二选一，而是「编辑成最终想要的样子」。',
    },
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const o = outcomes[btn.dataset.choice];
      buttons.forEach((b) => b.classList.toggle('chosen', b === btn));
      resolved.textContent = o.code;
      note.textContent = o.note;
      result.hidden = false;
    });
  });

  document.getElementById('sim-reset').addEventListener('click', () => {
    result.hidden = true;
    buttons.forEach((b) => b.classList.remove('chosen'));
  });
})();

/* ---------- 三种合并策略切换器 ---------- */
(function initStrategySwitcher() {
  const switcher = document.getElementById('strategy-switcher');
  if (!switcher) return;

  const shape = document.getElementById('strategy-shape');
  const note = document.getElementById('strategy-note');
  const tabs = switcher.querySelectorAll('.strategy-tabs button');

  const strategies = {
    merge: {
      shape: '主线   ○──○─────────╮──●──○\n              ╰──○──○──╯\n你的分支   f1  f2  ↗',
      note: '你的每一条 commit 都在，外加一个合并节点，分叉痕迹保留。适合想完整保留开发过程，或合并长期分支。',
    },
    squash: {
      shape: '主线   ○──○──────●──────○\n                  ↑\n           f1+f2+f3 压成一条',
      note: '你的 N 条 commit 被压成 1 条。最常见：一个 PR = 主线上一条记录，回头查「这个功能是哪次改的」时，一条记录比二十条零碎 commit 好用得多。',
    },
    rebase: {
      shape: '主线   ○──○──●──●──●──○\n              f1  f2  f3 逐条接上，无分叉',
      note: '你的 commit 逐条接到主线末尾，得到一条完全笔直的历史，但没有「这几条属于同一次 PR」的痕迹。',
    },
  };

  function select(key) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.strategy === key));
    shape.textContent = strategies[key].shape;
    note.textContent = strategies[key].note;
  }

  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.strategy)));
  select('merge');
})();
