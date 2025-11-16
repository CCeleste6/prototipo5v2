const STORAGE_KEY = 'quiz-pm-pc:v1';
const THEME_KEY = 'legado-theme:v1';
const WELCOME_KEY = 'legado-welcome-seen:v1';

const QUESTIONS = {
  math: [
    {"id":"m1","tema":"Matemática","tipo":"Múltipla escolha","enunciado":"Calcule o valor de 3/4 de 48.","alternativas":["32","36","24","16"],"resposta":"36","pontos_PM":5,"gatilhos_PC":[{"tipo":"Marca Individual I","casa":"Precursores","pc":20}]},
    {"id":"m2","tema":"Matemática","tipo":"Aberta","enunciado":"Resolva a equação 2x + 5 = 17. Qual o valor de x?","resposta":"6","pontos_PM":6,"gatilhos_PC":[]},
    {"id":"m3","tema":"Matemática","tipo":"Múltipla escolha","enunciado":"Qual é o MMC entre 12 e 18?","alternativas":["36","72","54","6"],"resposta":"36","pontos_PM":5,"gatilhos_PC":[{"tipo":"Faísca Criativa I","casa":"Visionários","pc":3}]},
    {"id":"m4","tema":"Matemática","tipo":"Problema","enunciado":"Uma classe tem 24 alunos. Se 3/8 deles faltarem, quantos alunos permanecem presentes?","resposta":"18","pontos_PM":7,"gatilhos_PC":[{"tipo":"Escudo da disciplina I","casa":"Guardiões","pc":3}]},
    {"id":"m5","tema":"Matemática","tipo":"Múltipla escolha","enunciado":"Se um item custa R$ 45 e está com desconto de 20%, qual o preço final?","alternativas":["R$36","R$35","R$37","R$30"],"resposta":"R$36","pontos_PM":6,"gatilhos_PC":[]}
  ],
  portugues: [
    {"id":"p1","tema":"Português","tipo":"Múltipla escolha","enunciado":"Qual alternativa contém um verbo no pretérito perfeito?","alternativas":["eu comia","tu comeste","eles comerão","nós comeríamos"],"resposta":"tu comeste","pontos_PM":5,"gatilhos_PC":[{"tipo":"Inspiração Compartilhada I","casa":"Visionários","pc":7}]},
    {"id":"p2","tema":"Português","tipo":"Aberta","enunciado":"Reescreva a frase no plural: 'O aluno entregou a tarefa no prazo.'","resposta":"Os alunos entregaram as tarefas no prazo.","pontos_PM":6,"gatilhos_PC":[]},
    {"id":"p3","tema":"Português","tipo":"Múltipla escolha","enunciado":"Assinale a alternativa em que 'por que' está corretamente usado para introduzir pergunta direta.","alternativas":["Por que você saiu cedo?","Por que do fato","porque sim","porquê da resposta"],"resposta":"Por que você saiu cedo?","pontos_PM":5,"gatilhos_PC":[{"tipo":"Apoio Moral I","casa":"Solidários","pc":2}]},
    {"id":"p4","tema":"Português","tipo":"Múltipla escolha","enunciado":"Marque a alternativa com vírgula correta: 'Se você estudar __ passarás no exame.'","alternativas":[";"," ,"," —"," ."],"resposta":" ,","pontos_PM":5,"gatilhos_PC":[]},
    {"id":"p5","tema":"Português","tipo":"Problema","enunciado":"Identifique a oração subordinada na frase: 'Quando chove, eu prefiro ficar em casa.'","resposta":"Quando chove","pontos_PM":7,"gatilhos_PC":[{"tipo":"Voz Unida I","casa":"Solidários","pc":6}]}
  ]
};

const allQuestions = [...QUESTIONS.math, ...QUESTIONS.portugues];

const houseState = {
  "Precursores": { pc: 0 },
  "Visionários": { pc: 0 },
  "Guardiões": { pc: 0 },
  "Solidários": { pc: 0 }
};

let participant = null;
let idx = 0;
let pmTotal = 0;
let answers = {};
let lastSavedAt = null;

function $id(id){ return document.getElementById(id); }
const el = {
  welcome: $id('welcome'),
  welcomeStart: $id('welcome-start'),
  welcomeContinue: $id('welcome-continue'),
  welcomeCard: document.querySelector('.welcome-card'),
  themeToggle: $id('theme-toggle'),
  themeToggleInline: $id('theme-toggle-inline'),
  startBtn: $id('start-btn'),
  nameInput: $id('participant-name'),
  houseSelect: $id('participant-house'),
  quizArea: $id('quiz-area'),
  questionContainer: $id('question-container'),
  prevBtn: $id('prev-btn'),
  nextBtn: $id('next-btn'),
  submitBtn: $id('submit-btn'),
  pmScore: $id('pm-score'),
  qIndex: $id('question-index'),
  results: $id('results'),
  resultDetail: $id('result-detail'),
  restartBtn: $id('restart-btn'),
  houseScores: $id('house-scores'),
  saveStatus: $id('save-status'),
  loader: $id('loader')
};


function applyThemeState(isLight){

  if (isLight) {
    document.body.classList.add('theme-light');
    document.documentElement.classList.add('light');
  } else {
    document.body.classList.remove('theme-light');
    document.documentElement.classList.remove('light');
  }

  if (el.themeToggle) el.themeToggle.checked = !!isLight;
  if (el.themeToggleInline) el.themeToggleInline.checked = !!isLight;
 
  try { localStorage.setItem(THEME_KEY, JSON.stringify({ light: !!isLight })); } catch(e){}
}

function initTheme(){
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      applyThemeState(!!(parsed && parsed.light));
      return;
    }
  } catch(e){ /* ignore parse errors */ }

  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyThemeState(prefersLight);
}

function attachThemeListeners(){
  if (el.themeToggle) {
    el.themeToggle.addEventListener('change', () => {
      applyThemeState(el.themeToggle.checked);
    });
  }
  if (el.themeToggleInline) {
    el.themeToggleInline.addEventListener('change', () => {
      applyThemeState(el.themeToggleInline.checked);
    });
  }
  
  window.Legado = window.Legado || {};
  window.Legado.applyThemeState = applyThemeState;
}


function saveState(){
  const payload = { participant, idx, pmTotal, answers, houseState, savedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    lastSavedAt = payload.savedAt;
    updateSaveIndicator(lastSavedAt);
  } catch(e){
    console.warn('Erro ao salvar estado:', e);
    if (el.saveStatus) el.saveStatus.textContent = 'Não foi possível salvar localmente';
  }
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (data && data.participant) {
      participant = data.participant;
      idx = data.idx || 0;
      pmTotal = data.pmTotal || 0;
      answers = data.answers || {};
      Object.keys(houseState).forEach(h=>{
        houseState[h].pc = (data.houseState && data.houseState[h] && Number(data.houseState[h].pc)) || houseState[h].pc;
      });
      lastSavedAt = data.savedAt || null;
      updateSaveIndicator(lastSavedAt);
      return true;
    }
  } catch(e){
    console.warn('Erro ao carregar estado:', e);
  }
  return false;
}

function clearState(){
  localStorage.removeItem(STORAGE_KEY);
  lastSavedAt = null;
  updateSaveIndicator(null);
}

function updateSaveIndicator(ts){
  if (!el.saveStatus) return;
  if (!ts) {
    el.saveStatus.textContent = 'Nenhum progresso salvo';
    return;
  }
  const d = new Date(ts);
  el.saveStatus.textContent = `Progresso salvo em ${d.toLocaleString('pt-BR')}`;
}


function renderHouseScores(){
  const houses = document.querySelectorAll('.house');
  houses.forEach(div=>{
    const name = div.dataset.house;
    const pcEl = div.querySelector('.pc');
    if (pcEl && houseState[name]) pcEl.textContent = `PC: ${houseState[name].pc}`;
  });
}


function showLoader(on = true){
  if (!el.loader) return;
  if (on) el.loader.classList.remove('hidden'); else el.loader.classList.add('hidden');
}


function renderQuestion(){
  if (!el.questionContainer) return;
  const q = allQuestions[idx];
  el.questionContainer.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = `${q.tema} — ${q.tipo}`;
  const p = document.createElement('p');
  p.textContent = q.enunciado;
  el.questionContainer.appendChild(title);
  el.questionContainer.appendChild(p);

  if (q.alternativas){
    const list = document.createElement('div'); list.className='alternatives';
    q.alternativas.forEach(alt=>{
      const b = document.createElement('div');
      b.className='alt';
      b.textContent = alt;
      b.dataset.value = alt;
      b.tabIndex = 0;
     
      b.addEventListener('click', () => {
        
        const prev = list.querySelector('.alt.selected');
        if (prev) prev.classList.remove('selected');
        b.classList.add('selected');
        answers[q.id] = alt;
      });
      b.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          b.click();
        }
      });
      list.appendChild(b);
    });
    el.questionContainer.appendChild(list);
    
    if (answers[q.id]) {
      const chosen = Array.from(list.children).find(node => node.dataset.value === answers[q.id]);
      if (chosen) chosen.classList.add('selected');
    }
  } else {
    
    const textarea = document.createElement('textarea');
    textarea.id = `open-${q.id}`;
    textarea.value = answers[q.id] || '';
    textarea.addEventListener('input', () => {
      answers[q.id] = textarea.value;
    });
    el.questionContainer.appendChild(textarea);
  }

  
  if (el.qIndex) el.qIndex.textContent = `${idx + 1} / ${allQuestions.length}`;
  if (el.pmScore) el.pmScore.textContent = `PM: ${pmTotal}`;
}

function goNext(){
  if (idx < allQuestions.length - 1) {
    idx++;
    renderQuestion();
  }
}
function goPrev(){
  if (idx > 0) {
    idx--;
    renderQuestion();
  }
}


function submitAnswer(){
  const q = allQuestions[idx];
  const given = answers[q.id];
  let correct = false;
  if (q.tipo && q.tipo.toLowerCase().includes('múltipla escolha')) {
    correct = String(given) === String(q.resposta);
  } else {
    
    correct = String(given || '').trim().toLowerCase() === String(q.resposta || '').trim().toLowerCase();
  }
  if (correct) {
    pmTotal += Number(q.pontos_PM || 0);

    if (Array.isArray(q.gatilhos_PC)) {
      q.gatilhos_PC.forEach(g => {
        if (houseState[g.casa]) houseState[g.casa].pc += Number(g.pc || 0);
      });
    }
  }

  if (idx < allQuestions.length - 1) {
    idx++;
    renderQuestion();
  } else {
    showResults();
  }
  saveState();
  renderHouseScores();
}

function showResults(){
  if (!el.results || !el.resultDetail) return;
  el.quizArea.classList.add('hidden');
  el.results.classList.remove('hidden');
  el.resultDetail.innerHTML = `<p>Participante: ${participant || '—'}</p>
    <p>PM total: ${pmTotal}</p>
    <p>PC por casa:</p>
    <ul>
      ${Object.keys(houseState).map(h => `<li>${h}: ${houseState[h].pc} PC</li>`).join('')}
    </ul>`;
}

function restartQuiz(){
  participant = null; idx = 0; pmTotal = 0; answers = {};
  Object.keys(houseState).forEach(h => houseState[h].pc = 0);
  clearState();
  // reset UI
  if (el.nameInput) el.nameInput.value = '';
  if (el.houseSelect) el.houseSelect.selectedIndex = 0;
  if (el.results) el.results.classList.add('hidden');
  if (el.quizArea) el.quizArea.classList.add('hidden');
  renderHouseScores();
}


function isWelcomeSeen(){ return localStorage.getItem(WELCOME_KEY) === '1'; }
function markWelcomeSeen(){ try { localStorage.setItem(WELCOME_KEY, '1'); } catch(e){} }

function openWelcome(){
  if (!el.welcome) return;
  el.welcome.classList.remove('hidden');
  el.welcome.setAttribute('aria-hidden', 'false');

  document.body.style.overflow = 'hidden';

  if (el.welcomeStart) el.welcomeStart.focus();
}

function closeWelcome(){
  if (!el.welcome) return;
  el.welcome.classList.add('hidden');
  el.welcome.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  markWelcomeSeen();

  if (el.startBtn) el.startBtn.focus();
}

function onOverlayClick(e){

  if (!el.welcomeCard) return;
  if (!el.welcomeCard.contains(e.target)) {
    closeWelcome();
  }
}

function onEsc(e){
  if (e.key === 'Escape' && el.welcome && el.welcome.getAttribute('aria-hidden') === 'false') {
    closeWelcome();
  }
}

function attachWelcomeEvents(){
  if (!el.welcome) return;


  if (el.welcomeStart) {
    el.welcomeStart.addEventListener('click', () => {

      participant = (el.nameInput && el.nameInput.value) || participant || 'Participante';
      idx = 0;
      pmTotal = 0;
      answers = {};
      renderQuestion();
      if (el.quizArea) el.quizArea.classList.remove('hidden');
      if (el.results) el.results.classList.add('hidden');
      renderHouseScores();
      saveState();
      closeWelcome();

      window.dispatchEvent(new CustomEvent('legado:welcome:started', { detail: { participant } }));
    });
  }
  if (el.welcomeContinue) {
    el.welcomeContinue.addEventListener('click', () => {

      const loaded = loadState();
      if (!loaded) {

        participant = (el.nameInput && el.nameInput.value) || participant || 'Participante';
        idx = 0;
        pmTotal = 0;
        answers = {};
      }
      renderQuestion();
      if (el.quizArea) el.quizArea.classList.remove('hidden');
      if (el.results) el.results.classList.add('hidden');
      renderHouseScores();
      closeWelcome();
      window.dispatchEvent(new CustomEvent('legado:welcome:continued', { detail: { loaded } }));
    });
  }


  el.welcome.addEventListener('click', onOverlayClick);

  document.addEventListener('keydown', onEsc);
}


function attachQuizUI(){
  if (el.nextBtn) el.nextBtn.addEventListener('click', goNext);
  if (el.prevBtn) el.prevBtn.addEventListener('click', goPrev);
  if (el.submitBtn) el.submitBtn.addEventListener('click', submitAnswer);
  if (el.restartBtn) el.restartBtn.addEventListener('click', restartQuiz);
  if (el.startBtn) {
    el.startBtn.addEventListener('click', () => {
      participant = (el.nameInput && el.nameInput.value) || participant || 'Participante';
      idx = 0;
      pmTotal = 0;
      answers = {};
      renderQuestion();
      if (el.quizArea) el.quizArea.classList.remove('hidden');
      renderHouseScores();
      saveState();
    });
  }
}


function init(){

  initTheme();
  attachThemeListeners();


  attachWelcomeEvents();


  if (el.welcome) {
    if (!isWelcomeSeen()) {
      openWelcome();
    } else {
      el.welcome.classList.add('hidden');
      el.welcome.setAttribute('aria-hidden', 'true');
    }
  }


  attachQuizUI();


  const had = loadState();
  if (had) {
    renderHouseScores();

  }


  window.Legado = window.Legado || {};
  window.Legado.openWelcome = openWelcome;
  window.Legado.closeWelcome = closeWelcome;
  window.Legado.saveState = saveState;
  window.Legado.loadState = loadState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
