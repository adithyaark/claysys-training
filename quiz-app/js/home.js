// home page
const Home = {

  init() {
    this.render();
  },
  

  render() {
    const grid = document.getElementById('course-grid');
    grid.innerHTML = COURSES.map(c => `
      <div class="course-card" id="card-${c.id}" onclick="Home.pick('${c.id}')">
        <div class="cc-title">${c.title}</div>
        <div class="cc-meta">${c.desc}</div>

        <div class="field">
          <label>Your name</label>
          <input
            class="input"
            id="name-${c.id}"
            placeholder="Enter your name"
            onclick="event.stopPropagation()"
            onkeydown="if(event.key==='Enter') Home.start('${c.id}')"
          >
          <div class="field-error" id="err-${c.id}">Name is required.</div>
        </div>

        <button
          class="btn btn-primary btn-block btn-sm"
          onclick="event.stopPropagation(); Home.start('${c.id}')">
          Start Quiz →
        </button>
      </div>
    `).join('');
  },

  pick(id) {
    document.querySelectorAll('.course-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('card-' + id)?.classList.add('selected');
    // focus name input
    document.getElementById('name-' + id)?.focus();
  },

  start(courseId) {
    const nameEl = document.getElementById('name-' + courseId);
    const errEl  = document.getElementById('err-' + courseId);
    const name   = nameEl?.value.trim();
    Quiz.timeLeft = 600;  


    // Validation
    if (!name) {
      errEl.classList.add('show');
      nameEl.focus();
      return;
    }
    errEl.classList.remove('show');

    const course = COURSES.find(c => c.id === courseId);
    const bank   = [
      ...(QUESTION_BANK[courseId] || []),
      ...(Storage.getQuestions(courseId)),
    ];
    const questions = shuffle(bank).slice(0, course.count); //shuffling

    App.course    = course;
    App.userName  = name;
    App.questions = questions;
    App.currentQ  = 0;
    App.answers   = new Array(questions.length).fill(null);

    Quiz.start();
  },
};
