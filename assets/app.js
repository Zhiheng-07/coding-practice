/* ============================================================
   Git 标准开发流程教学站 · 交互逻辑
   ============================================================ */

/* ---------- 侧边进度条：滚动联动高亮 ---------- */
(function initScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item');
  const targets = [];

  navItems.forEach((item) => {
    const el = document.getElementById(item.dataset.section);
    if (el) targets.push({ el, item });
  });

  function highlight() {
    // 取视口上沿 1/3 处所在的区块作为「当前」
    const line = window.innerHeight / 3;
    let current = targets[0];
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top <= line) current = t;
    }
    navItems.forEach((n) => n.classList.remove('active'));
    if (current) current.item.classList.add('active');
  }

  window.addEventListener('scroll', highlight, { passive: true });
  window.addEventListener('resize', highlight);
  highlight();
})();
