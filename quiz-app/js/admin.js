// admin module
const Admin = {

  editState: null,  

  init() {
    this.switchTab('dashboard');
  },

  switchTab(id) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('is-active'));
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('is-active'));
    document.getElementById('tab-' + id).classList.add('is-active');
    document.querySelector(`.side-btn[data-tab="${id}"]`)?.classList.add('is-active');

    if (id === 'dashboard')  this.renderDashboard();
    if (id === 'questions')  this.renderQuestions();
    if (id === 'leaderboard') this.renderLeaderboard();
  },

  // dashboard
  renderDashboard() {
    // stat: total custom questions
    const all    = Storage.getAllQuestions();
    const custom = Object.values(all).reduce((s, a) => s + a.length, 0);
    const lb     = Storage.getLeaderboard();

    document.getElementById('dash-courses').textContent   = COURSES.length;
    document.getElementById('dash-custom').textContent    = custom;
    document.getElementById('dash-quizzes').textContent   = lb.length;
  },

  // questions
  renderQuestions() {
    // populate course filter + add-form dropdown
    const courseOpts = COURSES.map(c => `<option value="${c.id}"> ${c.title}</option>`).join('');
    document.getElementById('q-filter').innerHTML = '<option value="all">All courses</option>' + courseOpts;
    document.getElementById('q-course').innerHTML = courseOpts;

    this.filterQuestions();
    this.resetForm();
  },

  filterQuestions() {
    const filter = document.getElementById('q-filter')?.value || 'all';
    const all    = Storage.getAllQuestions();

    let rows = '';

    COURSES.forEach(course => {
      if (filter !== 'all' && filter !== course.id) return;

      // built-in questions 
      const builtin = QUESTION_BANK[course.id] || [];
      builtin.forEach(q => {
        rows += `
          <div class="q-item">
            <div class="q-item-body">
              <div class="q-item-text">${q.q}</div>
              <div class="q-item-meta"> ${course.title} </span></div>
            </div>
          </div>`;
      });

      // custom questions
      const custom = all[course.id] || [];
      custom.forEach((q, idx) => {
        rows += `
          <div class="q-item">
            <div class="q-item-body">
              <div class="q-item-text">${q.q}</div>
              <div class="q-item-meta"> ${course.title} &nbsp;·&nbsp; <span class="badge badge-green">Custom</span></div>
            </div>
            <div class="q-item-actions">
              <button class="btn btn-ghost btn-sm" onclick="Admin.editQuestion('${course.id}', ${idx})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="Admin.deleteQuestion('${course.id}', ${idx})">Delete</button>
            </div>
          </div>`;
      });
    });

    document.getElementById('q-list').innerHTML = rows || '<div class="empty">No questions found.</div>';
  },

  // save question
  saveQuestion() {
    const courseId = document.getElementById('q-course').value;
    const text     = document.getElementById('admin-q-text').value.trim();
    const opts     = [0,1,2,3].map(i => document.getElementById('q-opt-' + i).value.trim());
    const correctEl = document.querySelector('input[name="q-correct"]:checked');

    // validation
    const errText = document.getElementById('q-err-text');
    const errOpts = document.getElementById('q-err-opts');
    const errAns  = document.getElementById('q-err-ans');

    let valid = true;
    errText.classList.remove('show');
    errOpts.classList.remove('show');
    errAns.classList.remove('show');

    if (!text)                 { errText.classList.add('show'); valid = false; }
    if (opts.some(o => !o))    { errOpts.classList.add('show'); valid = false; }
    if (!correctEl)            { errAns.classList.add('show');  valid = false; }
    if (!valid) return;

    const q = { q: text, opts, ans: parseInt(correctEl.value) };

    if (this.editState) {
      Storage.updateQuestion(this.editState.courseId, this.editState.idx, q);
      toast('Question updated.');
      this.editState = null;
    } else {
      Storage.saveQuestion(courseId, q);
      toast('Question added.');
    }

    this.renderQuestions();
  },

  // edit 
  editQuestion(courseId, idx) {
    const q      = Storage.getQuestions(courseId)[idx];
    const panel  = document.getElementById('q-form-panel');

    document.getElementById('q-course').value = courseId;
    document.getElementById('admin-q-text').value   = q.q;
    [0,1,2,3].forEach(i => {
      document.getElementById('q-opt-' + i).value = q.opts[i] || '';
    });
    const radio = document.querySelector(`input[name="q-correct"][value="${q.ans}"]`);
    if (radio) radio.checked = true;

    this.editState = { courseId, idx };
    panel.classList.add('editing');

    // scroll form
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  resetForm() {
    this.editState = null;
    document.getElementById('q-form-panel')?.classList.remove('editing');
    ['admin-q-text'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    [0,1,2,3].forEach(i => { const el = document.getElementById('q-opt-' + i); if (el) el.value = ''; });
    document.querySelectorAll('input[name="q-correct"]').forEach(r => r.checked = false);
    ['q-err-text','q-err-opts','q-err-ans'].forEach(id => {
      document.getElementById(id)?.classList.remove('show');
    });
  },

  // delete
  deleteQuestion(courseId, idx) {
    if (!confirm('Delete this question?')) return;
    Storage.deleteQuestion(courseId, idx);
    this.renderQuestions();
    toast('Question deleted.');
  },

  // leaderboard
  renderLeaderboard() {
    const lb    = Storage.getLeaderboard();
    const tbody = document.getElementById('lb-body');

    if (lb.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No scores yet.</td></tr>';
      return;
    }

    const sorted = [...lb].sort((a, b) => b.pct - a.pct);
    tbody.innerHTML = sorted.map((e, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${e.name}</td>
        <td>${e.courseTitle}</td>
        <td>${e.score}/${e.total} &nbsp;<span class="t-muted">(${e.pct}%)</span></td>
        <td>${e.date}</td>
      </tr>`
    ).join('');
  },
};
