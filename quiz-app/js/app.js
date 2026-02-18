// app state
const App = {
  page:         'home',         
  course:       null,           
  userName:     '',
  questions:    [],
  currentQ:     0,
  answers:      [],             // null | index
};

// routing the page
function go(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  App.page = pageId;

  // nav highlight
  document.querySelectorAll('[data-nav]').forEach(b => {
    b.classList.toggle('is-active', b.dataset.nav === pageId);
  });

  if (pageId === 'home')  Home.init();
  if (pageId === 'admin') Admin.init();
}

// toast
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2800);
}

// shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// init
document.addEventListener('DOMContentLoaded', () => go('home'));
