
const PM_FIXO = 10;


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
  { nome: "Oráculo", min: 80001, max: Infinity },
];

const RANK_DATA = {
  "Aprendiz":   { img: "assets/ranks/aprendiz.png" },
  "Estudante":  { img: "assets/ranks/estudante.png" },
  "Pesquisador":{ img: "assets/ranks/pesquisador.png" },
  "Acadêmico":  { img: "assets/ranks/academico.png" },
  "Mentor":     { img: "assets/ranks/mentor.png" },
  "Erudito":    { img: "assets/ranks/erudito.png" },
  "Filósofo":   { img: "assets/ranks/filosofo.png" },
  "Sábio":      { img: "assets/ranks/sabio.png" },
  "Luminar":    { img: "assets/ranks/luminar.png" },
  "Oráculo":    { img: "assets/ranks/oraculo.png" }
};


const VANTAGENS = window.VANTAGENS;


const STORAGE_KEY = "legadoEscolarAluno";

function saveAluno() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(aluno));
}

function loadAluno() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}


let aluno = loadAluno() || {
  nome: prompt("Nome do aluno:"),
  casa: prompt("Casa (Precursores, Visionários, Guardiões ou Solidários):"),
  pm: 0,
  pc: 0,
  vantagensAtivas: [],
};

saveAluno();


function getRanque(pm) {
  return RANQUES.find(r => pm >= r.min && pm <= r.max).nome;
}

function getRanqueNumero() {
  return RANQUES.findIndex(x => x.nome === getRanque(aluno.pm)) + 1;
}

function updateRankBadge() {
  const rank = getRanque(aluno.pm);
  const badge = document.getElementById("rank-badge");
  if (badge) badge.src = RANK_DATA[rank].img;
  document.getElementById("rank-display").textContent = rank;
}


const QUIZ = [
  { q:"Quanto é 7 × 8?", options:["48","54","56","64"], answer:2 },
  { q:"A raiz quadrada de 81 é:", options:["7","8","9","10"], answer:2 },
  { q:"Se João tem 12 balas e dá 5, fica com:", options:["5","7","8","9"], answer:1 },
  { q:"1/4 + 1/4 =", options:["1/2","1/4","3/4","1"], answer:0 },
  { q:"Próximo número: 2,4,8,16 __", options:["18","20","24","32"], answer:3 },

  { q:"Qual frase está correta?", options:["Nós vai", "Nós vamos", "Nós vamos ir"], answer:1 },
  { q:"Classe de 'rapidamente':", options:["Verbo","Adjetivo","Advérbio","Substantivo"], answer:2 },
  { q:"Em 'As flores foram colhidas', o termo é:", options:["voz ativa","voz passiva"], answer:1 },
  { q:"Plural de 'cão':", options:["cãos","cães","cões","caoes"], answer:1 },
  { q:"Sujeito de 'Vento forte derrubou a árvore':", options:["vento forte","árvore","derrubou","não tem"], answer:0 }
];

function renderQuiz() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  QUIZ.forEach((item, index) => {
    let html = `<div class="pergunta"><p>${index+1}. ${item.q}</p>`;
    item.options.forEach((opt,i)=>{
      html+=`
        <label>
          <input type="radio" name="q${index}" value="${i}">
          ${opt}
        </label>
      `;
    });
    html+=`</div>`;
    container.innerHTML += html;
  });
}

function corrigirQuiz() {
  let score = 0;
  QUIZ.forEach((item, index)=>{
    const marked = document.querySelector(`input[name="q${index}"]:checked`);
    if(marked && Number(marked.value) === item.answer) score++;
  });
  return score;
}


function renderVantagens() {
  const container = document.getElementById("vantagens-list");
  container.innerHTML = "";

  const casa = aluno.casa;
  const rankAtual = getRanqueNumero();
  const vantagensDisponiveis = [];

  for(const r in VANTAGENS[casa]) {
    if(Number(r) <= rankAtual) vantagensDisponiveis.push(...VANTAGENS[casa][r]);
  }

  vantagensDisponiveis.forEach(v => {
    const el = document.createElement("label");
    el.innerHTML = `
      <input type="checkbox" data-id="${v.id}">
      ${v.nome}
    `;
    container.appendChild(el);
  });

  document.querySelectorAll("#vantagens-list input").forEach(check=>{
    check.addEventListener("change",()=>{
      const v = vantagensDisponiveis.find(x=>x.id===check.dataset.id);
      if(check.checked) aluno.vantagensAtivas.push(v);
      else aluno.vantagensAtivas = aluno.vantagensAtivas.filter(x=>x.id!==v.id);
      saveAluno();
    });
  });
}


function finalizarAtividade() {
  const acertos = corrigirQuiz();
  let totalPC = 0;
  let mult = 1;

  aluno.vantagensAtivas.forEach(v=>{
    if(v.type==="multiplicador") mult *= v.multiplier;
    else totalPC += v.bonus || 0;
  });

  totalPC *= mult;
  aluno.pm += PM_FIXO;
  aluno.pc += totalPC;

  alert(`
ATIVIDADE CONCLUÍDA!

Quiz: ${acertos}/${QUIZ.length} acertos
+${PM_FIXO} PM (fixo)
+${totalPC} PC (vantagens)

Seu novo ranque: ${getRanque(aluno.pm)}
  `);

  aluno.vantagensAtivas = [];
  saveAluno();
  updateRankBadge();
  renderVantagens();
  renderQuiz();
}


window.onload = () => {
  updateRankBadge();
  renderQuiz();
  renderVantagens();
};

document.getElementById("finish-btn").addEventListener("click", finalizarAtividade);

/*******************************
 * MODO MESTRE
 ******************************/
const masterBtn = document.getElementById("master-btn");
const masterPanel = document.getElementById("master-panel");
const closeMaster = document.getElementById("close-master");
const exportBtn = document.getElementById("export-btn");
const resetBtn = document.getElementById("reset-btn");
const masterOutput = document.getElementById("master-output");

masterBtn.addEventListener("click", () => {
  masterPanel.classList.toggle("hidden");
  renderMasterData();
});

closeMaster.addEventListener("click", () => {
  masterPanel.classList.add("hidden");
});

resetBtn.addEventListener("click", () => {
  if (confirm("Tem certeza que quer apagar tudo?")) {
    localStorage.clear();
    alert("Dados resetados!");
    location.reload();
  }
});

exportBtn.addEventListener("click", exportCSV);

function renderMasterData() {
  masterOutput.textContent = JSON.stringify(localStorage, null, 2);
}

function exportCSV() {
  let csv = "key,value\n";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    csv += `${key},"${localStorage.getItem(key)}"\n`;
  }

  const blob = new Blob([csv], {type: "text/csv"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "legado_dados.csv";
  a.click();
}


/******************************
 * PAINEL DO ALUNO (XP SYSTEM)
 *****************************/
const studentBtn = document.getElementById("student-btn");
const studentPanel = document.getElementById("student-panel");
const closeStudent = document.getElementById("close-student");
const xpFill = document.getElementById("xp-fill");
const xpText = document.getElementById("xp-text");
const studentSummary = document.getElementById("student-summary");

let xp = Number(localStorage.getItem("xp") || 0);

const XP_NEEDED = 100; // you can adjust this later

studentBtn.addEventListener("click", () => {
  studentPanel.classList.toggle("hidden");
  updateXPDisplay();
});

closeStudent.addEventListener("click", () => {
  studentPanel.classList.add("hidden");
});

function addXP(amount) {
  xp += amount;
  localStorage.setItem("xp", xp);
  updateXPDisplay();
}

function updateXPDisplay() {
  const progress = Math.min((xp % XP_NEEDED) / XP_NEEDED * 100, 100);
  xpFill.style.width = progress + "%";

  xpText.textContent = `${xp % XP_NEEDED}/${XP_NEEDED} XP para próxima evolução`;

  studentSummary.textContent = `
    XP total: ${xp}
    | Level interno: ${Math.floor(xp / XP_NEEDED)}
  `;
}

/******************************
 * Sistema de Ranking
 *****************************/
const rankingBtn = document.getElementById("ranking-btn");
const rankingPanel = document.getElementById("ranking-panel");
const closeRanking = document.getElementById("close-ranking");
const rankingAlunos = document.getElementById("ranking-alunos");
const rankingCasas = document.getElementById("ranking-casas");

rankingBtn.addEventListener("click", () => {
  rankingPanel.classList.toggle("hidden");
  renderRankings();
});

closeRanking.addEventListener("click", () => {
  rankingPanel.classList.add("hidden");
});

function renderRankings() {
  const raw = JSON.parse(localStorage.getItem("alunos") || "{}");

  const alunos = Object.values(raw);

  alunos.sort((a,b) => (b.pc + b.pm) - (a.pc + a.pm));

  rankingAlunos.innerHTML = alunos.map((a, i) => `
    <li><b>${i+1}º</b> — ${a.nome} (${a.casa}) — <b>${a.pc + a.pm} pts</b></li>
  `).join("");


  const casas = {};

  alunos.forEach(a => {
    if (!casas[a.casa]) casas[a.casa] = 0;
    casas[a.casa] += (a.pc + a.pm);
  });

  const casasOrdenadas = Object.entries(casas).sort((a,b) => b[1] - a[1]);

  rankingCasas.innerHTML = casasOrdenadas.map((c,i) => `
    <li><b>${i+1}º</b> — ${c[0]} — <b>${c[1]} pts</b></li>
  `).join("");
}
