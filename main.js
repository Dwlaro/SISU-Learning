// ==========================================================================
// 张同学个人主页 —— 交互脚本
// 承担：移动端菜单切换、滚动入场动画、当前导航项高亮、
//       导航栏滚动毛玻璃态、卡片鼠标跟随高光
// 变量命名使用英文，注释使用中文；不引入任何动画库
// ==========================================================================

(function () {
  'use strict';

  // ===== 1. 移动端汉堡菜单切换 =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
  });

  // 点击任意导航链接后自动收起菜单
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '打开菜单');
    });
  });

  // ===== 2. 当前导航项高亮（随滚动更新） =====
  const sections = document.querySelectorAll('.section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    // 偏移量用于在分区接近顶部时提前切换高亮
    const scrollPosition = window.scrollY + 120;
    let currentId = '';

    sections.forEach(function (section) {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach(function (link) {
      const isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ===== 3. 滚动入场动画（IntersectionObserver，仅触发一次） =====
  const revealElements = document.querySelectorAll('.reveal');

  // 不支持 IntersectionObserver 的旧环境直接显示内容，避免“看不见”
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target); // 入场一次后停止观察
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===== 4. 导航栏滚动毛玻璃态 =====
  const navbar = document.getElementById('navbar');

  function setNavbarState() {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', setNavbarState, { passive: true });
  setNavbarState();

  // ===== 5. 卡片鼠标跟随径向高光（更新 CSS 变量 --mx / --my） =====
  const workCards = document.querySelectorAll('.work-card');

  workCards.forEach(function (card) {
    card.addEventListener('mousemove', function (event) {
      const rect = card.getBoundingClientRect();
      // 以卡片左上角为原点，计算鼠标相对位置（像素）
      card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    });
  });

  // ===== 页脚年份自动更新 =====
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();
