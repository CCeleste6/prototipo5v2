const PM_FIXO = 10;
const STORAGE_KEY = "legado_aluno_v1";


const RANQUES = [
  { nome: "Aprendiz", min: 0, max: 2000 },
  { nome: "Estudante", min: 2001, max: 5000 },
  { nome: "Pesquisador", min: 5001, max: 9000 },
  { nome: "Acadêmico", min: 9001, max: 14000 },
  { nome: "Mentor", min: 14001, max: 20000 },
  { nome: "Erudito", min: 20001, max: 28000 },
  { nome: "Filósofo", min: 28001, max: 40000 },
  { nome: "Sábio", min: 40001, max: 55000 },
  { nome: "Luminar", min: 55001, max: 80000 },
  { nome: "Oráculo", min: 80001, max: Infinity }
];

function calcRanque(pm){
  const r = RANQUES.find(r => pm >= r.min && pm <= r.max);
  return r ? r.nome : "—";
}


const VANTAGENS = {
  "Precursores": {
    1: [
      { id: "p1-1", nome: "Chama da Liderança I", bonus: 3, desc: "Se for representante, casa recebe +3 PC" },
      { id: "p1-2", nome: "Voz da Inspiração I", bonus: 5, desc: "Ao completar atividade coletiva, +5 PC por aluno convidado" },
      { id: "p1-3", nome: "Força da Determinação I", bonus: 7, desc: "Se aluno com falhas completar semana, +7 PC" }
    ],
    2: [
      { id: "p2-1", nome: "Chama da Liderança II", bonus: 6 },
      { id: "p2-2", nome: "Voz da Inspiração II", bonus: 7 },
      { id: "p2-3", nome: "Força da Determinação II", bonus: 12 }
    ],
    3: [
      { id: "p3-1", nome: "Chama da Liderança III", bonus: 10 },
      { id: "p3-2", nome: "Voz da Inspiração III", bonus: 13 },
      { id: "p3-3", nome: "Força da Determinação III", bonus: 16 }
    ],
    4: [
      { id: "p4-1", nome: "Bandeira da Coragem I", bonus: 15 },
      { id: "p4-2", nome: "Rastro do Pioneiro I", bonus: 18 },
      { id: "p4-3", nome: "Marca Individual I", bonus: 20 }
    ],

  },
  "Visionários": {
    1: [
      { id: "v1-1", nome: "Faísca Criativa I", bonus: 3, desc: "Apresentar solução original → +3 PC" },
      { id: "v1-2", nome: "Ousadia Inicial I", bonus: 5 },
      { id: "v1-3", nome: "Inspiração Compartilhada I", bonus: 7 }
    ],
    2: [
      { id: "v2-1", nome: "Faísca Criativa II", bonus: 6 },
      { id: "v2-2", nome: "Ousadia Inicial II", bonus: 15 },
      { id: "v2-3", nome: "Inspiração Compartilhada II", bonus: 10 }
    ],
    3: [
      { id: "v3-1", nome: "Faísca Criativa III", bonus: 9 },
      { id: "v3-2", nome: "Ousadia II (perfeita)", bonus: 25 },
      { id: "v3-3", nome: "Inspiração III", bonus: 15 }
    ],
    4: [
      { id: "v4-1", nome: "Laboratório Vivo", bonus: 20 },
      { id: "v4-2", nome: "Centelha Coletiva", bonus: 18 },
      { id: "v4-3", nome: "Ousadia Reconhecida", bonus: 20 }
    ]
  },
  "Guardioes": {
    1: [
      { id: "g1-1", nome: "Escudo da Disciplina I", bonus: 3 },
      { id: "g1-2", nome: "Responsabilidade Compartilhada I", bonus: 5 },
      { id: "g1-3", nome: "Defesa Coletiva I", bonus: 7 }
    ],
    2: [
      { id: "g2-1", nome: "Escudo II", bonus: 6 },
      { id: "g2-2", nome: "Responsabilidade II", bonus: 9 },
      { id: "g2-3", nome: "Defesa II", bonus: 12 }
    ],
    3: [
      { id: "g3-1", nome: "Escudo III", bonus: 9 },
      { id: "g3-2", nome: "Responsabilidade III", bonus: 13 },
      { id: "g3-3", nome: "Defesa III", bonus: 16 }
    ],
    4: [
      { id: "g4-1", nome: "Código da Honra I", bonus: 12 },
      { id: "g4-2", nome: "Vigilância Coletiva I", bonus: 16 },
      { id: "g4-3", nome: "Proteção Constante I", bonus: 20 }
    ]
  },
  "Solidarios": {
    1: [
      { id: "s1-1", nome: "Apoio Moral I", bonus: 2 },
      { id: "s1-2", nome: "Força do Grupo I", bonus: 3 },
      { id: "s1-3", nome: "Cuidado Contínuo I", bonus: 1 }
    ],
    2: [
      { id: "s2-1", nome: "Apoio Moral II", bonus: 3 },
      { id: "s2-2", nome: "Força do Grupo II", bonus: 5 },
      { id: "s2-3", nome: "Cuidado Contínuo II", bonus: 8 }
    ],
    3: [
      { id: "s3-1", nome: "Apoio Moral III", bonus: 5 },
      { id: "s3-2", nome: "Força do Grupo III", bonus: 8 },
      { id: "s3-3", nome: "Cuidado Contínuo III", bonus: 12 }
    ],
    4: [
      { id: "s4-1", nome: "Voz Unida", bonus: 6 },
      { id: "s4-2", nome: "União Inquebrável", bonus: 10 },
      { id: "s4-3", nome: "Raízes Fortes", bonus: 15 }
    ]
  }
};


function ranqueIndexFromPM(pm){
  const idx = RANQUES.findIndex(r => pm >= r.min && pm <= r.max);
  return idx >= 0 ? (idx + 1) : 1;
}


function getVantagensDisponiveis(casa, pm){
  const idx = ranqueIndexFromPM(pm);
  const houseMap = VANTAGENS[casa] || {};

  if(houseMap[idx]) return houseMap[idx];

  const keys = Object.keys(houseMap).map(k => parseInt(k)).sort((a,b)=>a-b);
  for(let i = keys.length - 1; i >= 0; i--){
    if(keys[i] <= idx) return houseMap[keys[i]];
  }

  return houseMap[keys[0]] || [];
}


let state = {
  aluno: null,
  atividadeAtual: {
    respostas: [],
    vantagemEscolhida: null
  },
  historico: []
};

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}


const QUESTIONS = [

  {
    text: "Qual é o resultado de 7 × 8?",
    options: ["48","56","64","52"]
  },
  {
    text: "Qual é a fração equivalente a 0,5?",
    options: ["1/2","2/3","3/5","4/6"]
  },
  {
    text: "Se um carro percorre 240 km em 3 horas, qual é sua velocidade média?",
    options: ["80 km/h","60 km/h","100 km/h","40 km/h"]
  },
  {
    text: "Qual é o valor de (3² + 4²)?",
    options: ["25","12","5","25"]
  },
  {
    text: "Se um número é dividido por 2 e o resultado é 18, qual é o número?",
    options: ["34","36","32","40"]
  },

  {
    text: "Qual das frases está escrita corretamente?",
    options: [
      "Houveram muitas pessoas na festa",
      "Fazem dois anos que viajei",
      "Faz dois anos que viajei",
      "Existem muito tempo"
    ]
  },
  {
    text: "Qual é o plural de 'cidadão'?",
    options: ["Cidadãoses","Cidadões","Cidadãos","Cidadães"]
  },
  {
    text: "Em qual opção há um verbo no pretérito perfeito?",
    options: ["Eu comerei","Eu estudava","Eu estudei","Eu estudaria"]
  },
  {
    text: "Qual alternativa apresenta um advérbio?",
    options: ["Inteligente","Felizmente","Bonito","Menino"]
  },
  {
    text: "Assinale a opção com acentuação correta:",
    options: ["Ideia","Heróico","Pôe-se","Vôo"]
  }
];


const el = {
  setup: document.getElementById("setup"),
  name: document.getElementById("name"),
  house: document.getElementById("house"),
  pmStart: document.getElementById("pm-start"),
  btnStart: document.getElementById("btn-start"),
  btnLoad: document.getElementById("btn-load"),

  vantagensSection: document.getElementById("vantagens"),
  vantagensList: document.getElementById("vantagens-list"),

  quizSection: document.getElementById("quiz"),
  questionText: document.getElementById("question-text"),
  options: document.getElementById("options"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  progress: document.getElementById("progress"),
  submitActivity: document.getElementById("submit-activity"),
  resetBtn: document.getElementById("reset-btn"),

  historySection: document.getElementById("history"),
  historyList: document.getElementById("history-list"),
  clearStorage: document.getElementById("clear-storage"),

  uName: document.getElementById("u-name"),
  uHouse: document.getElementById("u-house"),
  uPM: document.getElementById("u-pm"),
  uPC: document.getElementById("u-pc"),
  uRanque: document.getElementById("u-ranque"),
  userSummary: document.getElementById("user-summary")
};


let qIndex = 0;

function renderQuestion(){
  const q = QUESTIONS[qIndex];
  el.questionText.textContent = q.text;
  el.options.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("div");
    b.className = "opt";
    b.textContent = opt;
    b.dataset.index = i;
    b.addEventListener("click", () => {

      state.atividadeAtual.respostas[qIndex] = opt;

      if(qIndex < QUESTIONS.length - 1){
        qIndex++;
        renderQuestion();
      } else {

        renderQuestion();
      }
      renderProgress();
    });
    el.options.appendChild(b);
  });
  renderProgress();
}

function renderProgress(){
  el.progress.textContent = `${qIndex+1} / ${QUESTIONS.length}`;
  el.prevBtn.disabled = qIndex === 0;
  el.nextBtn.disabled = qIndex === QUESTIONS.length - 1;
}

el.prevBtn.addEventListener("click", () => {
  if(qIndex > 0){ qIndex--; renderQuestion(); }
});
el.nextBtn.addEventListener("click", () => {
  if(qIndex < QUESTIONS.length - 1){ qIndex++; renderQuestion(); }
});
el.resetBtn.addEventListener("click", () => {
  state.atividadeAtual = { respostas: [], vantagemEscolhida: null };
  qIndex = 0;
  renderQuestion();
  renderVantagens();
});


el.btnStart.addEventListener("click", () => {
  const nome = el.name.value.trim();
  const casa = el.house.value;
  const pmInit = Math.max(0, parseInt(el.pmStart.value || "0"));
  if(!nome){ alert("Digite o nome do aluno."); return; }

  state.aluno = {
    nome,
    casa,
    pm: pmInit,
    pc: 0,
    vantagensAtivas: { /* não persistir escolhas permanentes aqui e cada atividade pode aplicar vantagem */ }
  };

  state.historico = state.historico || [];
  state.atividadeAtual = { respostas: [], vantagemEscolhida: null };

  saveState();

  setupAfterInit();
});

el.btnLoad.addEventListener("click", () => {
  const loaded = loadState();
  if(!loaded || !loaded.aluno){ alert("Nenhum aluno salvo no localStorage."); return; }
  state = loaded;
  setupAfterInit();
});


function updateUserSummary(){
  if(!state.aluno) return;
  el.userSummary.style.display = "block";
  el.uName.textContent = state.aluno.nome;
  el.uHouse.textContent = state.aluno.casa;
  el.uPM.textContent = state.aluno.pm;
  el.uPC.textContent = state.aluno.pc;
  el.uRanque.textContent = calcRanque(state.aluno.pm);
}


function renderVantagens(){
  if(!state.aluno) return;
  const casa = state.aluno.casa;
  const pm = state.aluno.pm;
  const ranqueIdx = ranqueIndexFromPM(pm);
  const disponiveis = getVantagensDisponiveis(casa, pm);

  el.vantagensList.innerHTML = "";
  if(!disponiveis || disponiveis.length === 0){
    el.vantagensList.innerHTML = "<div class='muted small'>Nenhuma vantagem disponível para seu ranque.</div>";
    return;
  }

  disponiveis.forEach(v => {
    const div = document.createElement("div");
    div.className = "vantagem";
    div.innerHTML = `<div><strong>${v.nome}</strong></div>
                     <div class="muted small">${v.desc || ""}</div>
                     <div class="muted small">Bônus PC: +${v.bonus}</div>`;
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = (state.atividadeAtual.vantagemEscolhida && state.atividadeAtual.vantagemEscolhida.id === v.id) ? "Selecionado ✓" : "Escolher";
    btn.addEventListener("click", () => {

      state.atividadeAtual.vantagemEscolhida = v;
      saveState();
      renderVantagens();
    });
    div.appendChild(btn);
    el.vantagensList.appendChild(div);
  });
}


el.submitActivity.addEventListener("click", () => {
  if(!state.aluno){ alert("Nenhum aluno ativo."); return; }


  state.aluno.pm += PM_FIXO;


  let bonus = 0;
  if(state.atividadeAtual.vantagemEscolhida){
    bonus = state.atividadeAtual.vantagemEscolhida.bonus || 0;
    state.aluno.pc += bonus;
  }


  const now = new Date().toISOString();
  const entry = {
    ts: now,
    atividade: {
      perguntas: QUESTIONS.length,
      respostas: state.atividadeAtual.respostas.slice(),
      pmRecebidos: PM_FIXO,
      pcRecebidos: bonus,
      vantagem: state.atividadeAtual.vantagemEscolhida ? state.atividadeAtual.vantagemEscolhida.nome : null,
      ranqueApós: calcRanque(state.aluno.pm)
    }
  };
  state.historico = state.historico || [];
  state.historico.unshift(entry);


  state.atividadeAtual = { respostas: [], vantagemEscolhida: null };

  saveState();
  updateUserSummary();
  renderVantagens();
  renderHistory();

  alert(`Atividade concluída!
+${PM_FIXO} PM
+${bonus} PC (vantagem aplicada)
Ranque atual: ${calcRanque(state.aluno.pm)}
`);


  qIndex = 0;
  renderQuestion();
});


function renderHistory(){
  el.historySection.style.display = "block";
  el.historyList.innerHTML = "";
  (state.historico || []).forEach(h => {
    const d = document.createElement("div");
    d.className = "history-item";
    d.innerHTML = `<div><strong>${new Date(h.ts).toLocaleString()}</strong></div>
                   <div>PM ganhos: ${h.atividade.pmRecebidos} · PC ganhos: ${h.atividade.pcRecebidos}</div>
                   <div>Vantagem: ${h.atividade.vantagem || "—"}</div>
                   <div>Ranque agora: ${h.atividade.ranqueApós}</div>`;
    el.historyList.appendChild(d);
  });
}

el.clearStorage.addEventListener("click", () => {
  if(!confirm("Limpar todos os dados do protótipo (localStorage)?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});


function setupAfterInit(){

  el.setup.style.display = "none";
  el.vantagensSection.style.display = "block";
  el.quizSection.style.display = "block";
  el.historySection.style.display = "block";
  updateUserSummary();
  renderVantagens();
  renderQuestion();
  renderHistory();
}


window.addEventListener("load", () => {
  const loaded = loadState();
  if(loaded && loaded.aluno){
    state = loaded;

  }
  renderQuestion();
});


function loadState(){
  return loadStateRaw();
}
function loadStateRaw(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
