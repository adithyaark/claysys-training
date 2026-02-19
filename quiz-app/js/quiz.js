// P2 & P3 - Quiz & Summary
const Quiz = {

  // start
  start() {
    // Header info
    document.getElementById('qb-course').textContent = App.course.title;
    document.getElementById('qb-user').textContent   = App.userName;
    go('quiz');
    this.renderQ();
    this.timeLeft = 600;  
    this.tick();           
  },

  // render question
  renderQ() {
    const q     = App.questions[App.currentQ];
    const total = App.questions.length;
    const num   = App.currentQ + 1;
    const pct   = Math.round((num / total) * 100);

    document.getElementById('q-tag').textContent       = `Question ${num} of ${total}`;
    document.getElementById('q-text').textContent      = q.q;
    document.getElementById('prog-fill').style.width   = pct + '%';
    document.getElementById('prog-cur').textContent    = num;
    document.getElementById('prog-tot').textContent    = total;

    // next / finish
    document.getElementById('btn-next').textContent =
      App.currentQ === total - 1 ? 'Finish ✓' : 'Next →';

    // options
    const labels   = ['A','B','C','D'];
    const answered = App.answers[App.currentQ] !== null;

    document.getElementById('options').innerHTML = q.opts.map((opt, i) => {
      let cls = 'opt';
      if (answered) {
        if (i === q.ans) cls += ' correct';
        else if (i === App.answers[App.currentQ] && i !== q.ans) cls += ' wrong';
      }
      return `
        <button class="${cls}" onclick="Quiz.answer(${i})" ${answered ? 'disabled' : ''}>
          <span class="opt-key">${labels[i]}</span>
          ${opt}
        </button>`;
    }).join('');
  },

  // answer
  answer(idx) {
    if (App.answers[App.currentQ] !== null) return;
    App.answers[App.currentQ] = idx;
    this.renderQ();
  },

  // next / finish
  next() {
    if (App.currentQ < App.questions.length - 1) {
      App.currentQ++;
      this.renderQ();
    } else {
      this.showSummary();
    }
  },

  // P3 -summary
  showSummary() {
    if (this.timerId) {
      clearTimeout(this.timerId);  
      this.timerId = null;
    }
    const qs      = App.questions;
    const as      = App.answers;
    const correct = qs.filter((q, i) => as[i] === q.ans).length;
    const wrong   = qs.length - correct;
    const pct     = Math.round((correct / qs.length) * 100);

    const grade =
      pct >= 80 ? ' Excellent!'      :
      pct >= 60 ? ' Good job!'       :
      pct >= 40 ? ' Keep going'      :
                  ' Try again';

    document.getElementById('sum-score').textContent = `${correct} / ${qs.length}`;
    document.getElementById('sum-pct').textContent   = pct + '%';
    document.getElementById('sum-grade').textContent = grade;
    document.getElementById('sum-correct').textContent = correct;
    document.getElementById('sum-wrong').textContent   = wrong;
    document.getElementById('sum-total').textContent   = qs.length;

    // save to leaderboard
    Storage.saveScore({
      name:        App.userName,
      courseId:    App.course.id,
      courseTitle: App.course.title,
      score:       correct,
      total:       qs.length,
      pct:         pct,
      date:        new Date().toLocaleDateString(),
    });

    go('summary');
  },

  // Timer properties
  timerId: null,
  timeLeft: 600,  

  tick() {  
    this.timeLeft--;
    
    // Update display
    const min = Math.floor(this.timeLeft / 60);
    const sec = this.timeLeft % 60;
    document.getElementById('timer-min').textContent = min.toString().padStart(2, '0');
    document.getElementById('timer-sec').textContent = sec.toString().padStart(2, '0');
    
    // Visual states
    const timerEl = document.getElementById('quiz-timer');
    timerEl.className = 
      this.timeLeft < 300 ? 'prog-timer warning' : 
      this.timeLeft < 60  ? 'prog-timer danger' : 'prog-timer';
    
    // Continue or end
    if (this.timeLeft > 0) {
      this.timerId = setTimeout(() => this.tick(), 1000);  
    } else {
      this.showSummary();  
    }
  },

};
