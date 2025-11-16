const PM_FIXO = 10;
const STORAGE_KEY = "legado_aluno_v2";


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
function ranqueIndexFromPM(pm){
  const idx = RANQUES.findIndex(r => pm >= r.min && pm <= r.max);
  return idx >= 0 ? (idx + 1) : 1;
}


const VANTAGENS = {
  Precursores: {
    1: [
      { id:"pre-1-1", nome:"Chama da Liderança I", bonus:3, desc:"Se o aluno for representante em uma atividade de grupo, a casa recebe +3 pontos." },
      { id:"pre-1-2", nome:"Voz da Inspiração I", bonus:5, desc:"Ao completar atividade coletiva, recebe +5 pontos por aluno convidado." },
      { id:"pre-1-3", nome:"Força da Determinação I", bonus:7, desc:"Se aluno com falhas completar semana sem erros, +7 pontos." }
    ],
    2: [
      { id:"pre-2-1", nome:"Chama da Liderança II", bonus:6, desc:"Você e outro aluno representantes → +6 pontos." },
      { id:"pre-2-2", nome:"Voz da Inspiração II", bonus:7, desc:"Coletiva com 3+ convidados → +7 pontos por convidado." },
      { id:"pre-2-3", nome:"Força da Determinação II", bonus:12, desc:"2 alunos com falhas completam semana → +12 pontos." }
    ],
    3: [
      { id:"pre-3-1", nome:"Chama da Liderança III", bonus:10, desc:"Você e 2 alunos representantes → +10 pontos." },
      { id:"pre-3-2", nome:"Voz da Inspiração III", bonus:13, desc:"Coletiva com 5+ convidados → +13 pontos por convidado." },
      { id:"pre-3-3", nome:"Força da Determinação III", bonus:16, desc:"3 alunos com falhas completam semana → +16 pontos." }
    ],
    4: [
      { id:"pre-4-1", nome:"Bandeira da Coragem I", bonus:15, desc:"Aluno se voluntaria para representar a casa em competição → +15 pontos." },
      { id:"pre-4-2", nome:"Rastro do Pioneiro I", bonus:18, desc:"Aluno inicia atividade inédita com 3 colegas → +18 pontos." },
      { id:"pre-4-3", nome:"Marca Individual I", bonus:20, desc:"Aluno sozinho com excelência em todas atividades da semana → +20 pontos." }
    ],
    5: [
      { id:"pre-5-1", nome:"Bandeira da Coragem II", bonus:22, desc:"Aluno organiza grupo e conclui atividade coletiva → +22 pontos." },
      { id:"pre-5-2", nome:"Rastro do Pioneiro II", bonus:25, desc:"Aluno propõe solução ousada validada → +25 pontos." },
      { id:"pre-5-3", nome:"Marca Individual II", bonus:28, desc:"Aluno entrega projeto extra além das tarefas → +28 pontos." }
    ],
    6: [
      { id:"pre-6-1", nome:"Bandeira da Coragem III", bonus:30, desc:"Aluno motiva 5 colegas para atividade extra → +30 pontos." },
      { id:"pre-6-2", nome:"Rastro do Pioneiro III", bonus:35, desc:"Aluno/grupo faz atividade inédita primeiro → +35 pontos." },
      { id:"pre-6-3", nome:"Marca Individual III", bonus:50, desc:"Aluno sozinho alcança nota máxima na semana → +50 pontos." }
    ],
    7: [
      { id:"pre-7-1", nome:"Estandarte Vivo", bonus:60, desc:"Casa completa atividades da semana primeiro → +60 pontos." },
      { id:"pre-7-2", nome:"Chama Inquebrável", bonus:80, desc:"Aluno com falhas entrega mês sem erros → +80 pontos." },
      { id:"pre-7-3", nome:"Rastro Inspirador", bonus:0, multiplier:2, type:"multiplicador", desc:"50% da casa segue iniciativa de um aluno → pontuação duplicada." }
    ],
    8: [
      { id:"pre-8-1", nome:"Pioneiro Supremo", bonus:100, desc:"Casa faz primeiro um projeto inédito → +100 pontos." },
      { id:"pre-8-2", nome:"Força Solitária", bonus:120, desc:"Aluno sozinho 2 semanas seguidas nota máxima → +120 pontos." },
      { id:"pre-8-3", nome:"Legado em Movimento", bonus:0, multiplier:3, type:"multiplicador", desc:"70% da casa em atividade extra → pontuação triplicada." }
    ],
    9: [
      { id:"pre-9-1", nome:"Vanguarda Absoluta", bonus:150, desc:"Casa completa semana antes de todas as outras → +150 pontos." },
      { id:"pre-9-2", nome:"Rota do Destemido", bonus:300, desc:"Aluno lidera projeto complexo até conclusão → +300 pontos." },
      { id:"pre-9-3", nome:"Legado Audaz", bonus:250, desc:"Casa propõe e executa projeto inédito não tentado antes → +250 pontos." }
    ],
    10: [
      { id:"pre-10-1", nome:"Ecos da Liderança", bonus:750, desc:"Aluno lidera projeto interescolar concluído → +750 pontos." },
      { id:"pre-10-2", nome:"Legado dos Destemidos", bonus:0, multiplier:5, type:"multiplicador", desc:"Toda casa participa de projeto coletivo → pontos multiplicados x5." },
      { id:"pre-10-3", nome:"Marca Imortal", bonus:500, desc:"Aluno conquista feito máximo (olimpíada/prêmio externo) → +500 pontos." }
    ]
  },

  Visionários: {
    1: [
      { id:"vis-1-1", nome:"Faísca Criativa I", bonus:3, desc:"Solução original → +3 pontos." },
      { id:"vis-1-2", nome:"Ousadia Inicial I", bonus:5, desc:"Ideia não convencional → +5 pontos." },
      { id:"vis-1-3", nome:"Inspiração Compartilhada I", bonus:7, desc:"Sugestão aproveitada por 2 colegas → +7 pontos." }
    ],
    2: [
      { id:"vis-2-1", nome:"Faísca Criativa II", bonus:6, desc:"2+ soluções originais → +6 pontos." },
      { id:"vis-2-2", nome:"Ousadia Inicial II", bonus:15, desc:"Resposta ousada perfeita → +15 pontos." },
      { id:"vis-2-3", nome:"Inspiração Compartilhada II", bonus:10, desc:"Ideia aproveitada por 3 colegas → +10 pontos." }
    ],
    3: [
      { id:"vis-3-1", nome:"Faísca Criativa III", bonus:9, desc:"3+ soluções originais → +9 pontos." },
      { id:"vis-3-2", nome:"Ousadia Inicial III", bonus:25, desc:"Ideia ousada perfeita → +25 pontos." },
      { id:"vis-3-3", nome:"Inspiração Compartilhada III", bonus:15, desc:"Ideia adotada por 4 colegas → +15 pontos." }
    ],
    4: [
      { id:"vis-4-1", nome:"Laboratório Vivo I", bonus:20, desc:"Solução criativa adotada oficialmente → +20 pontos." },
      { id:"vis-4-2", nome:"Centelha Coletiva I", bonus:18, desc:"Ideia envolve 3+ colegas → +18 pontos." },
      { id:"vis-4-3", nome:"Ousadia Reconhecida I", bonus:20, desc:"Abordagem não convencional → +20 pontos." }
    ],
    5: [
      { id:"vis-5-1", nome:"Laboratório Vivo II", bonus:22, desc:"Dupla melhora projetos → +22 pontos." },
      { id:"vis-5-2", nome:"Centelha Coletiva II", bonus:25, desc:"Motiva 4 colegas a desenvolver ideias → +25 pontos." },
      { id:"vis-5-3", nome:"Ousadia Reconhecida II", bonus:28, desc:"Protótipo apresentado → +28 pontos." }
    ],
    6: [
      { id:"vis-6-1", nome:"Laboratório Vivo III", bonus:80, desc:"Mini-piloto adotado pela escola → +80 pontos." },
      { id:"vis-6-2", nome:"Centelha Coletiva III", bonus:35, desc:"50% da casa em iniciativa criativa → +35 pontos." },
      { id:"vis-6-3", nome:"Ousadia Reconhecida III", bonus:50, desc:"Proposta ousada eficaz → +50 pontos." }
    ],
    7: [
      { id:"vis-7-1", nome:"Oficina de Possibilidades", bonus:60, desc:"Dinâmica inédita aplicada em sala → +60 pontos." },
      { id:"vis-7-2", nome:"Catalisador de Mudanças", bonus:80, desc:"Ideia altera regras oficiais → +80 pontos." },
      { id:"vis-7-3", nome:"Faísca Contagiante", bonus:0, multiplier:2, type:"multiplicador", desc:"Iniciativa replicada por 5 colegas → pontuação duplicada." }
    ],
    8: [
      { id:"vis-8-1", nome:"Laboratório Aberto", bonus:100, desc:"Casa inteira em projeto experimental validado → +100 pontos." },
      { id:"vis-8-2", nome:"Inventor Solitário", bonus:180, desc:"Aluno cria solução inédita reconhecida → +180 pontos." },
      { id:"vis-8-3", nome:"Festival de Ideias", bonus:0, multiplier:3, type:"multiplicador", desc:"70% da casa apresenta propostas → pontuação triplicada." }
    ],
    9: [
      { id:"vis-9-1", nome:"Visão que Ecoa", bonus:250, desc:"Projeto vira referência escolar → +250 pontos." },
      { id:"vis-9-2", nome:"Mente Brilhante", bonus:350, desc:"Aluno conquista destaque externo → +350 pontos." },
      { id:"vis-9-3", nome:"Impacto Coletivo", bonus:0, multiplier:4, type:"multiplicador", desc:"80% da casa em projeto reconhecido fora → pontuação quadruplicada." }
    ],
    10: [
      { id:"vis-10-1", nome:"Manifesto Criativo", bonus:500, desc:"Proposta incorporada oficialmente pela escola → +500 pontos." },
      { id:"vis-10-2", nome:"Horizonte Infinito", bonus:0, multiplier:5, type:"multiplicador", desc:"Projeto coletivo que ultrapassa a escola → pontos multiplicados x5." },
      { id:"vis-10-3", nome:"Gênio Visionário", bonus:800, desc:"Aluno recebe reconhecimento externo de alto nível → +800 pontos." }
    ]
  },

  Guardioes: {
    1: [
      { id:"gua-1-1", nome:"Escudo da Disciplina I", bonus:3, desc:"Aluno entrega tarefas no prazo → +3 pontos." },
      { id:"gua-1-2", nome:"Responsabilidade Compartilhada I", bonus:5, desc:"3 alunos diferentes sem atraso → +5 pontos." },
      { id:"gua-1-3", nome:"Defesa Coletiva I", bonus:7, desc:"Casa passa semana sem penalidade → +7 pontos." }
    ],
    2: [
      { id:"gua-2-1", nome:"Escudo da Disciplina II", bonus:6, desc:"2 alunos entregam no prazo → +6 pontos." },
      { id:"gua-2-2", nome:"Responsabilidade Compartilhada II", bonus:9, desc:"4 alunos sem atraso → +9 pontos." },
      { id:"gua-2-3", nome:"Defesa Coletiva II", bonus:12, desc:"Casa passa 2 semanas sem penalidades → +12 pontos." }
    ],
    3: [
      { id:"gua-3-1", nome:"Escudo da Disciplina III", bonus:9, desc:"3 alunos entregam no prazo → +9 pontos." },
      { id:"gua-3-2", nome:"Responsabilidade Compartilhada III", bonus:13, desc:"5 alunos sem atraso → +13 pontos." },
      { id:"gua-3-3", nome:"Defesa Coletiva III", bonus:16, desc:"Casa passa 3 semanas sem penalidades → +16 pontos." }
    ],
    4: [
      { id:"gua-4-1", nome:"Código da Honra I", bonus:12, desc:"Todos entregam sem atraso → +12 pontos." },
      { id:"gua-4-2", nome:"Vigilância Coletiva I", bonus:16, desc:"Metade da casa sem falhas → +16 pontos." },
      { id:"gua-4-3", nome:"Proteção Constante I", bonus:20, desc:"Casa passa 2 semanas sem penalidades → +20 pontos." }
    ],
    5: [
      { id:"gua-5-1", nome:"Código da Honra II", bonus:15, desc:"70% entregam no prazo → +15 pontos." },
      { id:"gua-5-2", nome:"Vigilância Coletiva II", bonus:20, desc:"60% sem falhas → +20 pontos." },
      { id:"gua-5-3", nome:"Proteção Constante II", bonus:25, desc:"Casa passa 3 semanas sem penalidades → +25 pontos." }
    ],
    6: [
      { id:"gua-6-1", nome:"Código da Honra III", bonus:18, desc:"80% entregam no prazo → +18 pontos." },
      { id:"gua-6-2", nome:"Vigilância Coletiva III", bonus:24, desc:"70% sem falhas → +24 pontos." },
      { id:"gua-6-3", nome:"Proteção Constante III", bonus:30, desc:"Casa passa 4 semanas sem penalidades → +30 pontos." }
    ],
    7: [
      { id:"gua-7-1", nome:"Juramento de Aço", bonus:60, desc:"Toda turma entrega no prazo → +60 pontos." },
      { id:"gua-7-2", nome:"Fortaleza Impecável", bonus:100, desc:"Casa passa 5 semanas sem penalidade → +100 pontos." },
      { id:"gua-7-3", nome:"Olhos da Vigília", bonus:0, multiplier:2, type:"multiplicador", desc:"70% da casa em todas atividades → pontuação duplicada." }
    ],
    8: [
      { id:"gua-8-1", nome:"Comando da Ordem", bonus:80, desc:"Todos líderes entregam → +80 pontos." },
      { id:"gua-8-2", nome:"Ritual da Pontualidade", bonus:90, desc:"70% entrega no primeiro dia → +90 pontos." },
      { id:"gua-8-3", nome:"Disciplina Contagiante", bonus:0, multiplier:3, type:"multiplicador", desc:"80% da casa em todas atividades → pontuação triplicada." }
    ],
    9: [
      { id:"gua-9-1", nome:"Guardião Supremo", bonus:150, desc:"Casa completa semana sem falha → +150 pontos." },
      { id:"gua-9-2", nome:"Sentinela Eterna", bonus:200, desc:"2 meses sem penalidades → +200 pontos." },
      { id:"gua-9-3", nome:"Linha Intransponível", bonus:0, multiplier:4, type:"multiplicador", desc:"90% da casa em todas atividades → pontuação quadruplicada." }
    ],
    10: [
      { id:"gua-10-1", nome:"Estandarte da Ordem", bonus:0, multiplier:2, type:"multiplicador", desc:"Casa completa temporada sem penalidades → pontos x2." },
      { id:"gua-10-2", nome:"Legião Inabalável", bonus:300, desc:"100% participam de pelo menos 1 atividade → +300 pontos." },
      { id:"gua-10-3", nome:"Coluna da Disciplina", bonus:500, desc:"80% participação mínima por 3 meses seguidos → +500 pontos." }
    ]
  },

  Solidarios: {
    1: [
      { id:"sol-1-1", nome:"Apoio Moral I", bonus:2, desc:"Aluno participa de atividade coletiva pela primeira vez → +2 pontos." },
      { id:"sol-1-2", nome:"Força do Grupo I", bonus:3, desc:"2 membros participam juntos → +3 pontos." },
      { id:"sol-1-3", nome:"Cuidado Contínuo I", bonus:1, desc:"Casa recebe +1 ponto por atividade completa." }
    ],
    2: [
      { id:"sol-2-1", nome:"Apoio Moral II", bonus:3, desc:"Aluno traz colega novo → +3 pontos." },
      { id:"sol-2-2", nome:"Força do Grupo II", bonus:5, desc:"3 membros juntos → +5 pontos." },
      { id:"sol-2-3", nome:"Cuidado Contínuo II", bonus:8, desc:"Turma completa tarefas da semana → +8 pontos." }
    ],
    3: [
      { id:"sol-3-1", nome:"Apoio Moral III", bonus:5, desc:"2 alunos novos participam juntos → +5 pontos." },
      { id:"sol-3-2", nome:"Força do Grupo III", bonus:8, desc:"4 membros juntos → +8 pontos." },
      { id:"sol-3-3", nome:"Cuidado Contínuo III", bonus:12, desc:"Turma completa tarefas c/ 80% de acertos → +12 pontos." }
    ],
    4: [
      { id:"sol-4-1", nome:"Voz Unida I", bonus:6, desc:"3 alunos diferentes incentivam colega a participar → +6 pontos." },
      { id:"sol-4-2", nome:"União Inquebrável I", bonus:10, desc:"5+ membros juntos → +10 pontos." },
      { id:"sol-4-3", nome:"Raízes Fortes I", bonus:15, desc:"Turma conclui semana sem ausência com 80%+ acertos → +15 pontos." }
    ],
    5: [
      { id:"sol-5-1", nome:"Voz Unida II", bonus:8, desc:"4 alunos diferentes juntos → +8 pontos." },
      { id:"sol-5-2", nome:"União Inquebrável II", bonus:12, desc:"6+ membros juntos → +12 pontos." },
      { id:"sol-5-3", nome:"Raízes Fortes II", bonus:18, desc:"Turma conclui semana com 90% de acertos → +18 pontos." }
    ],
    6: [
      { id:"sol-6-1", nome:"Voz Unida III", bonus:10, desc:"5 alunos diferentes juntos → +10 pontos." },
      { id:"sol-6-2", nome:"União Inquebrável III", bonus:15, desc:"7+ membros juntos → +15 pontos." },
      { id:"sol-6-3", nome:"Raízes Fortes III", bonus:20, desc:"Turma semana com 100% de acertos → +20 pontos." }
    ],
    7: [
      { id:"sol-7-1", nome:"Harmonia Plena", bonus:25, desc:"Metade +1 participa → +25 pontos." },
      { id:"sol-7-2", nome:"Força Lendária", bonus:0, multiplier:2, type:"multiplicador", desc:"10+ membros juntos → pontuação dobrada." },
      { id:"sol-7-3", nome:"Árvore da Vida", bonus:50, desc:"Mês inteiro sem perder tarefas → +50 pontos." }
    ],
    8: [
      { id:"sol-8-1", nome:"Círculo Inquebrável", bonus:40, desc:"Todos participam de uma atividade na semana → +40 pontos." },
      { id:"sol-8-2", nome:"Legado Vivo", bonus:100, desc:"3 semanas seguidas 100% conclusão → +100 pontos." },
      { id:"sol-8-3", nome:"Eco Solidário", bonus:30, desc:"2 atividades com metade da casa na mesma semana → +30 pontos." }
    ],
    9: [
      { id:"sol-9-1", nome:"Eterna Colheita", bonus:150, desc:"2 meses seguidos c/ 100% conclusão → +150 pontos." },
      { id:"sol-9-2", nome:"Força Transcendente", bonus:0, multiplier:4, type:"multiplicador", desc:"3 atividades c/ 8 membros → pontuação quadruplicada." },
      { id:"sol-9-3", nome:"Aliança Perfeita", bonus:60, desc:"Todos participam e sem falhas → +60 pontos." }
    ],
    10: [
      { id:"sol-10-1", nome:"Coroa da União", bonus:0, multiplier:3, type:"multiplicador", desc:"100% participação → pontos triplicados." },
      { id:"sol-10-2", nome:"Pulso Coletivo", bonus:150, desc:"75% participação em todas atividades de um mês → +150 pontos." },
      { id:"sol-10-3", nome:"Coração Único", bonus:500, desc:"Casa completa temporada sem falhar → +500 pontos." }
    ]
  }
};


const TIER_TO_RANQUE = { 1:1, 2:4, 3:7, 4:10 };


const QUESTIONS = [
  { text: "Qual é o resultado de 7 × 8?", options: ["48","56","64","52"] },
  { text: "Qual é a fração equivalente a 0,5?", options: ["1/2","2/3","3/5","4/6"] },
  { text: "Se um carro percorre 240 km em 3 horas, qual é sua velocidade média?", options: ["80 km/h","60 km/h","100 km/h","40 km/h"] },
  { text: "Qual é o valor de (3² + 4²)?", options: ["25","12","5","25"] },
  { text: "Se um número é dividido por 2 e o resultado é 18, qual é o número?", options: ["34","36","32","40"] },
  { text: "Qual das frases está escrita corretamente?", options: ["Houveram muitas pessoas na festa","Fazem dois anos que viajei","Faz dois anos que viajei","Existem muito tempo"] },
  { text: "Qual é o plural de 'cidadão'?", options: ["Cidadãoses","Cidadões","Cidadãos","Cidadães"] },
  { text: "Em qual opção há um verbo no pretérito perfeito?", options: ["Eu comerei","Eu estudava","Eu estudei","Eu estudaria"] },
  { text: "Qual alternativa apresenta um advérbio?", options: ["Inteligente","Felizmente","Bonito","Menino"] },
  { text: "Assinale a opção com acentuação correta:", options: ["Ideia","Heróico","Pôe-se","Vôo"] }
];


let state = loadState() || {
  aluno: null,
  atividadeAtual: { respostas: [], vantagensEscolhidas: {} }, 
  historico: []
};


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
    const d = document.createElement("div");
    d.className = "opt";
    d.textContent = opt;
    d.dataset.index = i;
    d.addEventListener("click", () => {
      state.atividadeAtual.respostas[qIndex] = opt;
      if(qIndex < QUESTIONS.length - 1){
        qIndex++;
        renderQuestion();
      }
      renderProgress();
      saveState();
    });
    el.options.appendChild(d);
  });
  renderProgress();
}
function renderProgress(){
  el.progress.textContent = `${qIndex+1} / ${QUESTIONS.length}`;
  el.prevBtn.disabled = qIndex === 0;
  el.nextBtn.disabled = qIndex === QUESTIONS.length - 1;
}
el.prevBtn.addEventListener("click", () => { if(qIndex>0){ qIndex--; renderQuestion(); }});
el.nextBtn.addEventListener("click", () => { if(qIndex<QUESTIONS.length-1){ qIndex++; renderQuestion(); }});
el.resetBtn.addEventListener("click", () => {
  state.atividadeAtual = { respostas: [], vantagensEscolhidas: {} };
  qIndex = 0;
  renderQuestion();
  renderVantagens();
  saveState();
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
    pc: 0
  };
  state.atividadeAtual = { respostas: [], vantagensEscolhidas: {} };
  state.historico = state.historico || [];
  saveState();
  setupAfterInit();
});
el.btnLoad.addEventListener("click", () => {
  const loaded = loadState();
  if(!loaded || !loaded.aluno){ alert("Nenhum aluno salvo."); return; }
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
  const ranqueIdx = ranqueIndexFromPM(state.aluno.pm);
  const maxTier = Math.min(4, Math.floor((ranqueIdx - 1) / 3) + 1);
  el.vantagensList.innerHTML = "";

  for(let tier = 1; tier <= maxTier; tier++){
    const tierDiv = document.createElement("div");
    tierDiv.className = "card";
    tierDiv.style.marginBottom = "10px";
    const header = document.createElement("h3");
    header.textContent = `Tier ${tier} — opções`;
    tierDiv.appendChild(header);

    const ranqueToShow = TIER_TO_RANQUE[tier] || 1;
    const opts = (VANTAGENS[casa] && VANTAGENS[casa][ranqueToShow]) || [];

    if(opts.length === 0){
      const p = document.createElement("div");
      p.className = "muted small";
      p.textContent = "Nenhuma vantagem disponível para este Tier.";
      tierDiv.appendChild(p);
    } else {
      const form = document.createElement("div");
      form.style.display = "flex";
      form.style.flexDirection = "column";
      form.style.gap = "8px";

      opts.forEach(opt => {
        const row = document.createElement("label");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "8px";
        row.style.border = "1px solid #eef2ff";
        row.style.borderRadius = "8px";

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.flexDirection = "column";
        left.innerHTML = `<strong>${opt.nome}</strong><small class="muted">${opt.desc || ""}</small>`;

        const right = document.createElement("div");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `tier-${tier}`;
        input.value = opt.id;

        if(state.atividadeAtual.vantagensEscolhidas && state.atividadeAtual.vantagensEscolhidas[`tier${tier}`] === opt.id){
          input.checked = true;
        }
        input.addEventListener("change", () => {
          state.atividadeAtual.vantagensEscolhidas = state.atividadeAtual.vantagensEscolhidas || {};
          state.atividadeAtual.vantagensEscolhidas[`tier${tier}`] = opt.id;
          saveState();
          renderVantagens(); 
        });


        const clearBtn = document.createElement("button");
        clearBtn.className = "btn";
        clearBtn.textContent = "Limpar";
        clearBtn.style.marginLeft = "8px";
        clearBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          if(state.atividadeAtual.vantagensEscolhidas){
            delete state.atividadeAtual.vantagensEscolhidas[`tier${tier}`];
            saveState();
            renderVantagens();
          }
        });

        right.appendChild(input);
        right.appendChild(clearBtn);

        row.appendChild(left);
        row.appendChild(right);
        form.appendChild(row);
      });
      tierDiv.appendChild(form);
    }
    el.vantagensList.appendChild(tierDiv);
  }

  if(maxTier === 0){
    el.vantagensList.innerHTML = "<div class='muted small'>Nenhum Tier liberado ainda para sua pontuação atual.</div>";
  }
}


el.submitActivity.addEventListener("click", () => {
  if(!state.aluno){ alert("Nenhum aluno ativo."); return; }


  const chosenIds = Object.values(state.atividadeAtual.vantagensEscolhidas || {}).filter(Boolean);
  const chosenAdvantages = [];
  chosenIds.forEach(id => {

    let found = null;
    for(const casaKey of Object.keys(VANTAGENS)){
      const ranquesMap = VANTAGENS[casaKey];
      for(const ranqueNum of Object.keys(ranquesMap)){
        const list = ranquesMap[ranqueNum];
        const f = list.find(x => x.id === id);
        if(f){ found = f; break; }
      }
      if(found) break;
    }
    if(found) chosenAdvantages.push(found);
  });


  let sumBonus = 0;
  let multiplier = 1;
  chosenAdvantages.forEach(v => {
    if(v.type === "multiplicador" && v.multiplier){
      multiplier *= v.multiplier;
    } else {
      sumBonus += (v.bonus || 0);
    }
  });


  const pmGanho = Math.round(PM_FIXO * multiplier);
  const pcGanho = Math.round(sumBonus * multiplier);


  state.aluno.pm = (state.aluno.pm || 0) + pmGanho;
  state.aluno.pc = (state.aluno.pc || 0) + pcGanho;


  const now = new Date().toISOString();
  const vantagemNomes = chosenAdvantages.map(v => v.nome);
  const entry = {
    ts: now,
    pmRecebidos: pmGanho,
    pcRecebidos: pcGanho,
    vantagens: vantagemNomes,
    respostas: state.atividadeAtual.respostas.slice(),
    ranqueApos: calcRanque(state.aluno.pm)
  };
  state.historico = state.historico || [];
  state.historico.unshift(entry);

  
  state.atividadeAtual = { respostas: [], vantagensEscolhidas: {} };
  qIndex = 0;
  saveState();
  updateUserSummary();
  renderVantagens();
  renderQuestion();
  renderHistory();

  alert(`Atividade concluída!
+${pmGanho} PM (PM_FIXO x multiplicador)
+${pcGanho} PC (vantagens aplicadas)
Ranque atual: ${calcRanque(state.aluno.pm)}
Vantagens aplicadas: ${vantagemNomes.length ? vantagemNomes.join(", ") : "—"}`);
});


function renderHistory(){
  el.historySection.style.display = "block";
  el.historyList.innerHTML = "";
  (state.historico || []).forEach(h => {
    const d = document.createElement("div");
    d.className = "history-item";
    d.innerHTML = `<div><strong>${new Date(h.ts).toLocaleString()}</strong></div>
                   <div>PM: ${h.pmRecebidos} · PC: ${h.pcRecebidos}</div>
                   <div>Vantagens: ${h.vantagens.length ? h.vantagens.join(", ") : "—"}</div>
                   <div>Ranque após: ${h.ranqueApos}</div>`;
    el.historyList.appendChild(d);
  });
}
el.clearStorage.addEventListener("click", () => {
  if(!confirm("Limpar dados do protótipo (localStorage)?")) return;
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


function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  } catch(e){
    return null;
  }
}


window.addEventListener("load", () => {
  const loaded = loadState();
  if(loaded && loaded.aluno){

    state = loaded;
  }
  renderQuestion();
  updateUserSummary();
  renderVantagens();
  renderHistory();
});
