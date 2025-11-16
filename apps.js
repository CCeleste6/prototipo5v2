const DATA = [
  {
    q: "Qual é a capital do Brasil?",
    options: ["Brasília", "São Paulo", "Rio de Janeiro", "Salvador"],
    correct: 0,
    pm: 5,
    pcHouse: "Precursores",
    pc: 3
  },
  {
    q: "Quem escreveu 'Dom Casmurro'?",
    options: ["Machado de Assis", "Jorge Amado", "Clarice Lispector", "Graciliano Ramos"],
    correct: 0,
    pm: 4,
    pcHouse: "Visionários",
    pc: 2
  }
];


let state = {
  index: 0,
  answers: Array(DATA.length).fill(null),
  pmTotal: 0,
  pc: { Precursores: 0, Visionários: 0, Guardiões: 0, Solidários: 0 }
};


const qIndexEl = document.getElementById('q-index');
const qTotalEl = document.getElementById('q-total');
const questionText = document.getElementById('question-text');
const answersList = document.getElementById('answers-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const resultCard = document.getElementById('result-card');
const resultBody = document.getElementById('result-body');
const pmTotalEl = document.getElementById('pm-total');
const progressMsg = document.getElementById('progress-msg');
const pcEls = {
  Precursores: document.getElementById('pc-precursores'),
  Visionários: document.getElementById('pc-visionarios'),
  Guardiões: document.getElementById('pc-guardioes'),
  Solidários: document.getElementById('pc-solidarios')
};


function init() {
  qTotalEl.textContent = DATA.length;
  loadProgress();
  renderQuestion();
  renderScoreboard();
  attachEvents();
  applyThemeFromStorage();
}

function renderQuestion(){
  const idx = state.index;
  const item = DATA[idx];
  qIndexEl.textContent = idx + 1;
  questionText.textContent = item.q;
  answersList.innerHTML = '';
  item.options.forEach((opt, i) => {
    const li = document.createElement('li');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'answer';
    radio.value = i;
    radio.id = `opt-${i}`;
    if (state.answers[idx] === i) radio.checked = true;

    const label = document.createElement('label');
    label.htmlFor = `opt-${i}`;
    label.textContent = opt;
    label.style.cursor = 'pointer';
    li.appendChild(radio);
    li.appendChild(label);


    li.addEventListener('click', () => {
      state.answers[idx] = i;
   
      radio.checked = true;
      saveProgress();
    });

    answersList.appendChild(li);
  });
}

function nextQuestion(){
  if (state.index < DATA.length - 1) {
    state.index++;
    renderQuestion();
  }
}

function prevQuestion(){
  if (state.index > 0) {
    state.index--;
    renderQuestion();
  }
}

function submitAnswer(){

  state.pmTotal = 0;
  state.pc = { Precursores: 0, Visionários: 0, Guardiões: 0, Solidários: 0 };

  state.answers.forEach((ans, idx) => {
    if (ans === null) return;
    const item = DATA[idx];

    if (ans === item.correct) state.pmTotal += item.pm;
 
    const house = item.pcHouse;
    if (house && state.pc[house] !== undefined) state.pc[house] += item.pc;
  });

  renderScoreboard();
  showResults();
  saveProgress();
}

function showResults(){
  resultBody.innerHTML = `
    <p><strong>PM total:</strong> ${state.pmTotal}</p>
    <p><strong>PC por casa:</strong></p>
    <ul>
      <li>Precursores: ${state.pc.Precursores}</li>
      <li>Visionários: ${state.pc.Visionários}</li>
      <li>Guardiões: ${state.pc.Guardiões}</li>
      <li>Solidários: ${state.pc.Solidários}</li>
    </ul>
  `;
  resultCard.hidden = false;
}

function restart(){
  state = {
    index: 0,
    answers: Array(DATA.length).fill(null),
    pmTotal: 0,
    pc: { Precursores: 0, Visionários: 0, Guardiões: 0, Solidários: 0 }
  };
  localStorage.removeItem('quiz-progress');
  renderQuestion();
  renderScoreboard();
  resultCard.hidden = true;
  progressMsg.textContent = 'Nenhum progresso salvo';
}

function renderScoreboard(){
  pmTotalEl.textContent = state.pmTotal;
  Object.keys(pcEls).forEach(k => pcEls[k].textContent = state.pc[k]);
}

function saveProgress(){
  const payload = {
    index: state.index,
    answers: state.answers,
    pmTotal: state.pmTotal,
    pc: state.pc,
    updated: Date.now()
  };
  localStorage.setItem('quiz-progress', JSON.stringify(payload));
  progressMsg.textContent = 'Progresso salvo';
}

function loadProgress(){
  const raw = localStorage.getItem('quiz-progress');
  if (!raw) return;
  try {
    const p = JSON.parse(raw);
    if (p && Array.isArray(p.answers)) {
      state.index = p.index || 0;
      state.answers = p.answers;
      state.pmTotal = p.pmTotal || 0;
      state.pc = p.pc || state.pc;
      progressMsg.textContent = 'Progresso salvo';
    }
  } catch(e){
    console.warn('Erro ao carregar progresso', e);
  }
}


const themeBtn = document.getElementById('toggle-theme');
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme');
  if (cur === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
    themeBtn.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeBtn.textContent = '☀️';
  }
}
function applyThemeFromStorage(){
  const t = localStorage.getItem('theme');
  if (t === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeBtn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '🌙';
  }
}


function attachEvents(){
  nextBtn.addEventListener('click', () => { nextQuestion(); saveProgress(); });
  prevBtn.addEventListener('click', () => { prevQuestion(); saveProgress(); });
  submitBtn.addEventListener('click', submitAnswer);
  restartBtn.addEventListener('click', restart);
  document.getElementById('save-progress').addEventListener('click', saveProgress);
  themeBtn.addEventListener('click', toggleTheme);
}

init();
