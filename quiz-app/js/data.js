// course cardconst 
COURSES = [
  { id: 'js',     title: 'JavaScript',       desc: '10 questions' , count: 10 },
  { id: 'html',   title: 'HTML & CSS',        desc: '8 questions' ,  count: 8  },
  { id: 'python', title: 'Python',            desc: '10 questions', count: 10 },
  { id: 'db',     title: 'Databases',         desc: '8 questions',  count: 8  },
];

// question bank
const QUESTION_BANK = {
  js: [
    { q: 'Which keyword declares a block-scoped variable?',           opts: ['var','let','const','function'],        ans: 1 },
    { q: 'What does DOM stand for?',                                  opts: ['Data Object Model','Document Object Model','Document Order Model','Data Order Model'], ans: 1 },
    { q: 'Which method adds an element to the end of an array?',      opts: ['push()','pop()','shift()','splice()'], ans: 0 },
    { q: 'What is the output of typeof null?',                        opts: ['null','object','undefined','string'],  ans: 1 },
    { q: 'Which is NOT a JavaScript primitive type?',                 opts: ['String','Boolean','Float','Symbol'],   ans: 2 },
    { q: 'What does === check?',                                      opts: ['Value only','Type only','Value and type','Reference'], ans: 2 },
    { q: 'Which loop always executes at least once?',                 opts: ['for','while','do...while','for...of'], ans: 2 },
    { q: 'What is a closure?',                                        opts: ['A loop','A function with access to outer scope','An HTML tag','A CSS rule'], ans: 1 },
    { q: 'Which method removes the last element of an array?',        opts: ['splice()','pop()','shift()','delete'], ans: 1 },
    { q: 'What does async/await handle?',                             opts: ['CSS animations','Sync code','Async operations','HTML rendering'], ans: 2 },
  ],
  html: [
    { q: 'Which does HTML stands for?',                               opts: ['Hyper Text Markup Language','Hyper Text Makeup Language','Hyper Text Markup Latex','Hyper Test Markup Language'],      ans: 0 },
    { q: 'What does CSS stand for?',                                  opts: ['Computer Style Sheets','Creative Style Syntax','Cascading Style Sheets','Color Style Sheets'], ans: 2 },
    { q: 'Which attribute holds a hyperlink URL?',                    opts: ['src','rel','href','link'],             ans: 2 },
    { q: 'What is Flexbox used for?',                                 opts: ['3D transforms','1D layout','Database queries','Routing'], ans: 1 },
    { q: 'Which property controls text size?',                        opts: ['font-style','text-size','font-size','text-font'], ans: 2 },
    { q: 'Which CSS property adds space inside an element?',          opts: ['margin','border','padding','outline'], ans: 2 },
    { q: 'What does display: grid create?',                           opts: ['A list','2D layout','A circle','A nav'], ans: 1 },
    { q: 'CSS Grid is for which type of layout?',                     opts: ['1D','2D','3D','Inline'], ans: 1 },
  ],
  python: [
    { q: 'Which keyword defines a function in Python?',               opts: ['function','def','fun','method'],       ans: 1 },
    { q: 'Which structure uses key-value pairs?',                     opts: ['List','Tuple','Dictionary','Set'],     ans: 2 },
    { q: 'Which operator means exponentiation?',                      opts: ['^','**','%%','//'],                    ans: 1 },
    { q: 'What does len() return?',                                   opts: ['Last element','Length','Memory address','Type'], ans: 1 },
    { q: 'What does range(5) produce?',                               opts: ['1–5','0–5','0–4','1–4'],              ans: 2 },
    { q: 'Which method adds to a list?',                              opts: ['add()','insert()','append()','push()'], ans: 2 },
    { q: 'What is a lambda?',                                         opts: ['A loop','Anonymous function','A class','A module'], ans: 1 },
    { q: 'How are exceptions handled?',                               opts: ['try/catch','try/except','error/handle','check/catch'], ans: 1 },
    { q: 'What is the output of type([])?',                           opts: ["<class 'dict'>","<class 'tuple'>","<class 'list'>","<class 'set'>"], ans: 2 },
    { q: 'Which keyword is used to create a class?',                  opts: ['struct','object','class','def'],       ans: 2 },
  ],
  db: [
    { q: 'What does SQL stand for?',                                  opts: ['Structured Query Language','Simple Query Logic','System Query Language','Structured Quick Language'], ans: 0 },
    { q: 'Which clause filters rows?',                                opts: ['ORDER BY','GROUP BY','WHERE','HAVING'], ans: 2 },
    { q: 'What does a PRIMARY KEY do?',                               opts: ['Allows nulls','Uniquely identifies a row','Connects tables','Encrypts data'], ans: 1 },
    { q: 'What is normalization?',                                    opts: ['Encrypt data','Reduce redundancy','Index queries','Back up tables'], ans: 1 },
    { q: 'Which JOIN returns only matching rows?',                    opts: ['LEFT','RIGHT','INNER','FULL'],         ans: 2 },
    { q: 'What does a FOREIGN KEY do?',                               opts: ['Encrypts a column','Links two tables','Sorts records','Creates indexes'], ans: 1 },
    { q: 'Which function returns the average?',                       opts: ['SUM()','MAX()','AVG()','COUNT()'],     ans: 2 },
    { q: 'What is a database index?',                                 opts: ['A backup','A speed-up structure','A constraint','A data type'], ans: 1 },
  ],
};
