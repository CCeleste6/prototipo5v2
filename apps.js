
const STORAGE_KEY = 'quiz-pm-pc:v1';
const THEME_KEY = 'legado-theme:v1';


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


function setTheme(isLight){
  if (isLight) document.body.classList.add('theme-light');
  else document.body.classList.remove('theme-light');
  try { localStorage.setItem(THEME_KEY, JSON.stringify({light: !!isLight})); } catch(e){}
  if (el.themeToggle) el.themeToggle.checked = !!isLight;
  if (el.themeToggleInline) el.themeToggleInline.checked = !!isLight;
}
(function(){ try {
  const t = JSON.parse(localStorage.getItem(THEME_KEY));
  setTheme(t && t.light);
} catch(e){ setTheme(false); } })();


function saveState(){
  const payload = { participant, idx, pmTotal, answers, houseState, savedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    lastSavedAt = payload.savedAt;
    updateSaveIndicator(lastSavedAt);
  } catch(e){
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
      return true;
    }
  } catch(e){ console.warn('Erro ao carregar estado:', e); }
  return false;
}

function clearState(){
  localStorage.removeItem(STORAGE_KEY);
  lastSavedAt = null;
  if (el.saveStatus) updateSaveIndicator(null);
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
    if (pcEl) pcEl.textContent = `PC: ${houseState[name].pc}`;
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
      const b = document.createElement('div'); b.className='alt'; b.textContent=alt; b.dataset.value=alt;
      const containsAdv = Array.isArray(q.gatilhos_PC) && q.gatilhos_PC.some(g => {
        return participant && (String(g.casa || participant.house) === String(participant.house));
      });
      if (containsAdv) b.classList.add('house-adv');
      b.addEventListener('click', ()=>{ document.querySelectorAll('.alt').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); });
      const prev = answers[q.id] && answers[q.id].answer;
      if (prev && String(prev).trim().toLowerCase() === String(alt).trim().toLowerCase()) b.classList.add('selected');
      list.appendChild(b);
    });
    el.questionContainer.appendChild(list);
  } else {
    const ta = document.createElement('textarea'); ta.id='open-answer'; ta.rows=3; ta.style.width='100%';
    if (answers[q.id] && answers[q.id].answer) ta.value = answers[q.id].answer;
    el.questionContainer.appendChild(ta);
  }
}


function updateStatus(){
  if ($id('pm-score')) $id('pm-score').textContent = `PM: ${pmTotal}`;
  if ($id('question-index')) $id('question-index').textContent = `Questão ${idx+1} / ${allQuestions.length}`;
  if (el.prevBtn) el.prevBtn.disabled = idx === 0;
  if (el.nextBtn) el.nextBtn.disabled = idx === allQuestions.length - 1;
}

function getCurrentAnswer(){
  const q = allQuestions[idx];
  if (q.alternativas){
    const sel = document.querySelector('.alt.selected');
    return sel ? sel.dataset.value : '';
  } else {
    const ta = $id('open-answer');
    return ta ? ta.value.trim() : '';
  }
}

function calculatePM(question, answer){
  const correct = (String(answer).trim().toLowerCase() === String(question.resposta).trim().toLowerCase());
  const pm = correct ? (question.pontos_PM || 0) : 0;
  return { pmEarned: pm, correct };
}

function collectGatilhos(question, answer){
  const { correct } = calculatePM(question, answer);
  const collected = [];
  if (!correct) return collected;
  if (Array.isArray(question.gatilhos_PC)){
    question.gatilhos_PC.forEach(g => collected.push({ tipo: g.tipo || '', casa: g.casa || null, pc: g.pc || 0 }));
  }
  return collected;
}


function applyGatilhosFinal(){
  if (!participant || !participant.house) return [];
  const applied = [];
  Object.keys(answers).forEach(qid => {
    const a = answers[qid];
    if (!a.gatilhos) return;
    a.gatilhos.forEach(g => {
      const target = g.casa || participant.house;
      if (String(target) === String(participant.house) && g.pc && g.pc > 0) {
        houseState[target].pc += g.pc;
        applied.push({ house: target, pc: g.pc, motivo: g.tipo });
      }
    });
  });
  return applied;
}


function startQuizFromForm(){
  const name = (el.nameInput && el.nameInput.value.trim()) || 'Aluno';
  const house = (el.houseSelect && el.houseSelect.value) || 'Precursores';
  participant = { id: Date.now().toString(), name, house };
  pmTotal = 0; idx = 0; answers = {};
  saveState();
  if (el.quizArea) el.quizArea.classList.remove('hidden');
  if (el.results) el.results.classList.add('hidden');
  showLoader(true);
  setTimeout(()=>{ showLoader(false); renderQuestion(); updateStatus(); renderHouseScores(); }, 450);
}

function restoreToUI(){
  if (!participant) return;
  if (el.nameInput) el.nameInput.value = participant.name || '';
  if (el.houseSelect) {
    for (let i=0;i<el.houseSelect.options.length;i++){
      if (el.houseSelect.options[i].value === participant.house){ el.houseSelect.selectedIndex = i; break; }
    }
  }
  if (el.quizArea) el.quizArea.classList.remove('hidden');
  if (el.results) el.results.classList.add('hidden');
  renderQuestion(); updateStatus(); renderHouseScores();
  updateSaveIndicator(lastSavedAt);
}


if (el.welcomeStart) el.welcomeStart.addEventListener('click', ()=>{ if (el.welcome) el.welcome.classList.add('hidden'); });
if (el.welcomeContinue) el.welcomeContinue.addEventListener('click', ()=>{ const ok = loadState(); if (ok) { if (el.welcome) el.welcome.classList.add('hidden'); restoreToUI(); } else { alert('Nenhum progresso salvo encontrado.'); } });

if (el.themeToggle) el.themeToggle.addEventListener('change',(e)=>setTheme(e.target.checked));
if (el.themeToggleInline) el.themeToggleInline.addEventListener('change',(e)=>setTheme(e.target.checked));

if (el.startBtn) el.startBtn.addEventListener('click', startQuizFromForm);
if (el.prevBtn) el.prevBtn.addEventListener('click', ()=>{ if (idx>0){ idx--; renderQuestion(); updateStatus(); saveState(); }});
if (el.nextBtn) el.nextBtn.addEventListener('click', ()=>{ if (idx<allQuestions.length-1){ idx++; renderQuestion(); updateStatus(); saveState(); }});
if (el.submitBtn) el.submitBtn.addEventListener('click', ()=>{ 
  const q = allQuestions[idx];
  const answer = getCurrentAnswer();
  if (!answer) { alert('Responda a questão antes de enviar.'); return; }
  const prev = answers[q.id];
  const res = calculatePM(q, answer);
  pmTotal += res.pmEarned - ((prev && prev.pmEarned) || 0);
  const gat = collectGatilhos(q, answer);
  answers[q.id] = { answer, correct: res.correct, pmEarned: res.pmEarned, gatilhos: gat };
  saveState(); renderHouseScores(); updateStatus();
  if (idx < allQuestions.length - 1) { idx++; showLoader(true); setTimeout(()=>{ showLoader(false); renderQuestion(); updateStatus(); saveState(); }, 300); }
  else { showResults(); }
});

function showResults(){
  const appliedGatilhos = applyGatilhosFinal();
  const bonusPC = Math.floor((pmTotal * 10) / 100);
  if (participant && participant.house && bonusPC > 0) houseState[participant.house].pc += bonusPC;

  if (el.quizArea) el.quizArea.classList.add('hidden');
  if (el.results) el.results.classList.remove('hidden');
  if (el.resultDetail) el.resultDetail.innerHTML = '';

  if (el.resultDetail) {
    const summary = document.createElement('div'); summary.className='result-row';
    summary.innerHTML = `<strong>${participant.name}</strong> — Casa: ${participant.house} — <span>PM total: ${pmTotal}</span>`;
    el.resultDetail.appendChild(summary);

    const gRow = document.createElement('div'); gRow.className='result-row';
    if (appliedGatilhos.length>0){
      gRow.innerHTML = `<strong>Vantagens aplicadas da casa ${participant.house}:</strong>`;
      appliedGatilhos.forEach(g=>{ const d=document.createElement('div'); d.textContent=`+${g.pc} PC — ${g.motivo}`; gRow.appendChild(d); });
    } else { gRow.textContent = `Nenhuma vantagem da casa ${participant.house} foi ativada.`; }
    el.resultDetail.appendChild(gRow);

    const bonusRow = document.createElement('div'); bonusRow.className='result-row';
    bonusRow.innerHTML = `Bônus: 10% do PM convertido em PC = <strong>+${bonusPC} PC</strong> para a casa <strong>${participant.house}</strong>`;
    el.resultDetail.appendChild(bonusRow);

    Object.keys(answers).forEach((qid,i)=>{
      const a = answers[qid];
      const row = document.createElement('div'); row.className='result-row';
      row.innerHTML = `<div><strong>Questão ${i+1}</strong> — correta: ${a.correct} — PM ganho: ${a.pmEarned}</div>`;
      if (a.gatilhos && a.gatilhos.length){
        a.gatilhos.forEach(g=>{
          const gdiv=document.createElement('div'); const target = g.casa || participant.house;
          gdiv.textContent = `Gatilho registrado: ${g.tipo} => +${g.pc} PC para ${target}`;
          row.appendChild(gdiv);
        });
      }
      el.resultDetail.appendChild(row);
    });

    const housesRow = document.createElement('div'); housesRow.className='result-row';
    housesRow.innerHTML = `<h3>Placar de Casas</h3>`;
    Object.keys(houseState).forEach(h=>{ const d=document.createElement('div'); d.textContent=`${h}: PC = ${houseState[h].pc}`; housesRow.appendChild(d); });
    el.resultDetail.appendChild(housesRow);
  }

  saveState();
}

if (el.restartBtn) el.restartBtn.addEventListener('click', ()=>{ 
  if (!confirm('Reiniciar quiz local? Isso apagará progresso salvo neste navegador.')) return;
  participant = null; idx = 0; pmTotal = 0; answers = {};
  Object.keys(houseState).forEach(h=>houseState[h].pc=0);
  clearState(); renderHouseScores();
  if (el.results) el.results.classList.add('hidden'); if (el.quizArea) el.quizArea.classList.add('hidden'); if (el.nameInput) el.nameInput.value='';
});


window.addEventListener('load', ()=>{
  renderHouseScores();
  const ok = loadState();
  if (ok) {
    if (el.nameInput) el.nameInput.value = participant?.name || '';
    updateSaveIndicator(lastSavedAt);
  } else {
    updateSaveIndicator(null);
  }
});
