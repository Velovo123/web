/* =========================================================
   JavaScript for Laboratory Work #4
   ========================================================= */

// ===== CHANGE ONLY THIS NUMBER to match your journal variant
const VARIANT = 27; // <-- поставте свій номер

// ===== 1. Збереження системної інформації в localStorage
function collectSysInfo() {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    screen: `${screen.width}×${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  localStorage.setItem('sysInfo', JSON.stringify(info, null, 2));
  return info;
}

// Відобразити у футері
function showSysInfo() {
  const el = document.getElementById('sys-info');
  const data = JSON.parse(localStorage.getItem('sysInfo')) || collectSysInfo();
  el.textContent = `Info saved in localStorage: ${JSON.stringify(data)}`;
}

// ===== 2. Завантаження коментарів із JSONPlaceholder
async function loadComments() {
  const url = `https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`;
  try {
    const res = await fetch(url);
    const comments = await res.json();
    renderComments(comments);
  } catch (err) {
    console.error('Error fetching comments', err);
  }
}

function renderComments(list) {
  const ul = document.getElementById('comments-list');
  list.forEach(({ name, email, body }) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${name}</strong> (${email}):<br>${body}`;
    ul.appendChild(li);
  });
}

// ===== 3. Модальне вікно через 1 хвилину
function setupModal() {
  const modal = document.getElementById('feedback-modal');
  const closeBtn = document.getElementById('modal-close');

  setTimeout(() => modal.classList.remove('hidden'), 60000); // 60 000 мс

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { // клік поза контентом
    if (e.target === modal) modal.classList.add('hidden');
  });
}

// ===== 4. Перемикач теми + авто-режим
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('light', theme === 'light');
}

function detectInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;

  // Авто: 07:00-21:00 — light; інакше dark
  const h = new Date().getHours();
  return h >= 7 && h < 21 ? 'light' : 'dark';
}

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  let current = detectInitialTheme();
  applyTheme(current);

  btn.addEventListener('click', () => {
    current = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', current);
    applyTheme(current);
  });
}

/* =====  Bootstrap on DOM ready  ===== */
document.addEventListener('DOMContentLoaded', () => {
  showSysInfo();
  loadComments();
  setupModal();
  setupThemeToggle();
});
