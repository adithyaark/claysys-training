// localStorage wrapper
const Storage = {

  // keys
  KEYS: {
    questions:   'qa_custom_questions',   // { courseId: [ {q,opts,ans} ] }
    leaderboard: 'qa_leaderboard',        // [ {name, courseId, score, ...} ]
  },

  // custom qsns
  getAllQuestions() {
    return JSON.parse(localStorage.getItem(this.KEYS.questions) || '{}');
  },

  getQuestions(courseId) {
    const all = this.getAllQuestions();
    return all[courseId] || [];
  },

  saveQuestion(courseId, q) {
    const all = this.getAllQuestions();
    if (!all[courseId]) all[courseId] = [];
    all[courseId].push(q);
    localStorage.setItem(this.KEYS.questions, JSON.stringify(all));
  },

  updateQuestion(courseId, idx, q) {
    const all = this.getAllQuestions();
    if (!all[courseId]) return;
    all[courseId][idx] = q;
    localStorage.setItem(this.KEYS.questions, JSON.stringify(all));
  },

  deleteQuestion(courseId, idx) {
    const all = this.getAllQuestions();
    if (!all[courseId]) return;
    all[courseId].splice(idx, 1);
    localStorage.setItem(this.KEYS.questions, JSON.stringify(all));
  },

  // leaderboard
  getLeaderboard() {
    return JSON.parse(localStorage.getItem(this.KEYS.leaderboard) || '[]');
  },

  saveScore(entry) {
    const lb = this.getLeaderboard();
    lb.push(entry);
    localStorage.setItem(this.KEYS.leaderboard, JSON.stringify(lb));
  },

  deleteScore(idx) {
    const lb = this.getLeaderboard();
    lb.splice(idx, 1);
    localStorage.setItem(this.KEYS.leaderboard, JSON.stringify(lb));
  },
};
