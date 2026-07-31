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

/* ---------- 术语解释系统 ----------
   词库是唯一数据源：正文自动标记 + 悬停解释卡 + 页尾名词对照表都从这里渲染 */
const GLOSSARY = [
  { en: 'pull',        zh: '拉取',     desc: '云端 → 本地：把远程仓库的最新历史抓回本地。每天开工第一件事。' },
  { en: 'commit',      zh: '提交',     desc: '把暂存区的改动封箱成一条历史记录，附带「为什么改」的说明。只发生在你电脑上，团队看不见。' },
  { en: 'push',        zh: '推送',     desc: '把本地分支上、云端还没有的 commit 传上去。push 之后团队才看得见你。' },
  { en: 'merge',       zh: '合并',     desc: '把一条分支的改动缝进另一条分支。内部逻辑是三方比较，不是覆盖。' },
  { en: 'branch',      zh: '分支',     desc: '指向某个 commit 的指针（一个 41 字节的小文件），不是代码副本。用于多人多需求并行、互不干扰。' },
  { en: 'main',        zh: '主分支',   desc: '唯一的、受保护的正式版本线。没有人能直接往上写，所有改动必须走 PR。' },
  { en: 'origin',      zh: '远程代号', desc: '远程仓库的默认代号——clone 时那个地址的别名。' },
  { en: 'checkout',    zh: '检出',     desc: '切换到某条分支，工作目录里的文件会整体替换成那条分支的样子。' },
  { en: 'clone',       zh: '克隆',     desc: '第一次把云端仓库（含完整历史）复制到本地。' },
  { en: 'rebase',      zh: '变基',     desc: '把你的 commit 摘下来，重新接到别处（通常是主线末端）。会改写 commit ID——所以只能对还没分享出去的分支做。' },
  { en: 'squash',      zh: '压缩合并', desc: '把 N 条零碎 commit 压成 1 条再进主线。最常见的 PR 合并策略。' },
  { en: 'conflict',    zh: '冲突',     desc: '两边改了同一处、改法不同，Git 不替你猜，交人工裁决。是正常现象，不是错误。' },
  { en: 'PR',          zh: '合并申请', desc: 'Pull Request（GitLab 叫 Merge Request）：「申请把我的支线并进主线」的工单，挂着人工 review 和 CI 两道检查。' },
  { en: 'review',      zh: '人工评审', desc: '同事逐行看代码、留评论、提修改意见。PR 的第一道检查。' },
  { en: 'CI',          zh: '持续集成', desc: '自动跑测试、构建、代码规范检查的机器人。PR 的第二道检查，全绿才能合并。' },
  { en: 'lint',        zh: '规范检查', desc: '自动检查代码风格与常见问题的工具，CI 常跑的一项。' },
  { en: 'fork',        zh: '派生',     desc: '把整个仓库复制一份到你名下。用于你没有原仓库写权限的场景（开源协作的标准姿势）。' },
  { en: 'worktree',    zh: '多工作树', desc: '同一个本地仓库在硬盘上多开一个工作目录，两条分支同时摊开。效率技巧。' },
  { en: 'HEAD',        zh: '当前位置', desc: '你此刻站在哪——当前检出的那条分支（或那个 commit）。冲突标记里的 HEAD 就是「你所在的这边」。' },
];

(function initGlossary() {
  /* 1. 自动标记：把正文里出现的术语包上 .term（跳过代码块、标题、SVG 等） */
  const SKIP = new Set(['PRE', 'CODE', 'SCRIPT', 'STYLE', 'SVG', 'BUTTON', 'H1', 'H2']);
  const byLower = new Map(GLOSSARY.map((g) => [g.en.toLowerCase(), g]));
  const pattern = new RegExp(
    '\\b(' + GLOSSARY.map((g) => g.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b',
    'g'
  );

  function walk(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // SVG 元素的 tagName 是小写（如 'svg'），统一转大写后比对，
      // 否则会深入分支图内部，把 <text> 里的 main、PR 换成 HTML span 而无法渲染
      if (SKIP.has(node.tagName.toUpperCase()) || node.classList.contains('term')) return;
      Array.from(node.childNodes).forEach(walk);
      return;
    }
    if (node.nodeType !== Node.TEXT_NODE || !pattern.test(node.textContent)) return;
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let rest = node.textContent;
    let m;
    let idx = 0;
    pattern.lastIndex = 0;
    while ((m = pattern.exec(rest)) !== null) {
      frag.appendChild(document.createTextNode(rest.slice(idx, m.index)));
      const span = document.createElement('span');
      span.className = 'term';
      span.tabIndex = 0;
      span.dataset.term = m[1].toLowerCase();
      span.textContent = m[1];
      frag.appendChild(span);
      idx = m.index + m[1].length;
    }
    frag.appendChild(document.createTextNode(rest.slice(idx)));
    node.parentNode.replaceChild(frag, node);
  }

  walk(document.querySelector('.content'));

  /* 2. 悬停 / 点按解释卡 */
  const tip = document.createElement('div');
  tip.className = 'term-tip';
  tip.hidden = true;
  document.body.appendChild(tip);

  function show(termEl) {
    const g = byLower.get(termEl.dataset.term);
    if (!g) return;
    tip.innerHTML = '<strong>' + g.en + ' · ' + g.zh + '</strong>' + g.desc;
    tip.hidden = false;
    const r = termEl.getBoundingClientRect();
    const tw = tip.offsetWidth;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
    tip.style.left = left + 'px';
    const above = r.top > tip.offsetHeight + 16;
    tip.style.top = (above ? r.top - tip.offsetHeight - 8 : r.bottom + 8) + 'px';
  }

  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('.term');
    if (t) show(t);
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.term')) tip.hidden = true;
  });
  document.addEventListener('focusin', (e) => {
    const t = e.target.closest('.term');
    if (t) show(t); else tip.hidden = true;
  });
  window.addEventListener('scroll', () => { tip.hidden = true; }, { passive: true });

  /* 3. 页尾名词对照表：与词库同源渲染 */
  const table = document.getElementById('glossary-table');
  if (table) {
    const tbody = table.querySelector('tbody');
    GLOSSARY.forEach((g) => {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td><code>' + g.en + '</code></td><td>' + g.zh + '</td><td>' + g.desc + '</td>';
      tbody.appendChild(tr);
    });
  }
})();

/* ---------- 命令块一键复制 ---------- */
(function initCopyButtons() {
  document.querySelectorAll('.cmd').forEach((box) => {
    const pre = box.querySelector('pre');
    if (!pre) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    box.appendChild(btn);

    btn.addEventListener('click', () => {
      // 复制时去掉注释，只留可执行的命令行
      const text = pre.innerText
        .split('\n')
        .map((line) => line.replace(/\s*#.*$/, '').trimEnd())
        .filter((line) => line.trim() !== '')
        .join('\n');
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ 已复制';
        setTimeout(() => { btn.textContent = '复制'; }, 1600);
      }).catch(() => {
        btn.textContent = '复制失败';
        setTimeout(() => { btn.textContent = '复制'; }, 1600);
      });
    });
  });
})();

/* ---------- 自测判断题 ---------- */
(function initQuiz() {
  const list = document.getElementById('quiz-list');
  if (!list) return;

  const QUESTIONS = [
    {
      q: '「同步主分支，就是从云端下载一份最新的确认版文件，它由专人维护。」',
      ok: false,
      why: '拉下来的是整个仓库的完整历史（每条 commit、每条分支都在本地），这就是「分布式」。主分支也不是专人维护的，是靠 PR + review + CI 的流程保证的。',
    },
    {
      q: '「新建分支主要是为了犯错时能兜底。」',
      ok: false,
      why: '兜底只是副产品。主要目的是隔离——多人多需求同时改同一个仓库，各写各的互不干扰。',
    },
    {
      q: '「commit 之后，团队同事就能看到我的改动了。」',
      ok: false,
      why: 'commit 只动你自己的电脑。push 之后团队才看得见——这条分界线贯穿整个流程。',
    },
    {
      q: '「新建分支是纯本地操作，断网也能做。」',
      ok: true,
      why: '正确。pull 时完整历史已经在本地了，开分支只是贴一个 41 字节的指针，不需要向云端要任何东西。',
    },
    {
      q: '「push 之前，需要先把本地的分支合并一下再推。」',
      ok: false,
      why: 'push 不需要预先合并——它就是把你这条分支上的 commit 原样传上去。如果指的是把零碎 commit 压整齐，那叫 rebase / squash，跟 merge 是两回事。',
    },
    {
      q: '「合并时，Git 会自动拿新版本覆盖旧版本。」',
      ok: false,
      why: 'Git 做的是三方比较：找到共同祖先，逐块对比三份内容。只有一边改的采用那一边；两边都改了同一块才报冲突、交人裁决。',
    },
    {
      q: '「冲突说明有人操作失误了。」',
      ok: false,
      why: '冲突不是错误，是正常现象——两边改了同一处，机器不懂业务不敢猜，把决定权交给人。',
    },
    {
      q: '「PR 要人工 review 和 CI 两道检查都通过，才能合并进主线。」',
      ok: true,
      why: '正确。这就是流程的质量闸门，也是 PM 在页面上就能看到需求卡在哪一环的原因。',
    },
    {
      q: '「三种合并策略（Merge / Squash / Rebase）会导致最终代码内容不同。」',
      ok: false,
      why: '三种策略不影响最终代码内容，只影响主线历史的可读性——所以这是团队规范问题，不是技术问题。',
    },
  ];

  let answered = 0;
  let correct = 0;
  const score = document.getElementById('quiz-score');

  QUESTIONS.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'quiz-item';
    card.innerHTML =
      '<p class="quiz-q"><span class="quiz-idx">' + (i + 1) + '</span>' + item.q + '</p>' +
      '<div class="quiz-btns">' +
      '<button type="button" data-ans="true">对</button>' +
      '<button type="button" data-ans="false">不对 / 有偏差</button>' +
      '</div>' +
      '<div class="quiz-why" hidden></div>';
    list.appendChild(card);

    const btns = card.querySelectorAll('button');
    const why = card.querySelector('.quiz-why');

    btns.forEach((b) => b.addEventListener('click', () => {
      if (card.classList.contains('done')) return;
      card.classList.add('done');

      const isRight = (b.dataset.ans === 'true') === item.ok;
      b.classList.add(isRight ? 'right' : 'wrong');
      why.innerHTML =
        '<strong>' + (isRight ? '✓ 判断正确。' : '✗ 再想想——') + '</strong>' + item.why;
      why.hidden = false;

      answered += 1;
      if (isRight) correct += 1;
      if (answered === QUESTIONS.length) {
        score.textContent =
          '全部答完：' + correct + ' / ' + QUESTIONS.length +
          (correct === QUESTIONS.length
            ? '。误区已扫清，可以开始第一个真实需求了。'
            : '。答错的几条，回到上面对应的步骤和误区对照卡再看一眼。');
        score.hidden = false;
      }
    }));
  });
})();
