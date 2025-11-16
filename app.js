const STORAGE_KEY = "legadoEscolarAluno";


let PM_ATIVIDADE = Number(localStorage.getItem("cfg_pm")) || 10;
let XP_NEEDED = Number(localStorage.getItem("cfg_xp")) || 100;
let MULTIPLICADORES_ATIVOS = localStorage.getItem("cfg_mult") !== "off";

const RANQUES = [
  { nome: "Aprendiz", min: 0, max: 2000 },
  { nome: "Estudante", min: 2001, max: 5000 },
  { nome: "Pesquisador", min: 5001, max: 9000 },
  { nome: "Acadêmico", min: 9001, max: 14000 },
  { nome: "Mentor", min: 14001, max: 20000 },
  { nome: "Erudito", min: 20001, max: 28000 },
  { nome: "Filósofo", min: 28001, max: 40000 },
  { nome: "Sábio", max: 55000, min: 40001 },
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

  totalPC = MULTIPLICADORES_ATIVOS ? totalPC * mult : totalPC;

  aluno.pm += PM_ATIVIDADE;
  aluno.pc += totalPC;

  addXP(acertos * 10);
  addToInventory(aluno.casa, { nome:"Atividade concluída", bonus: totalPC });

  localStorage.setItem("atividades_completas",
    (Number(localStorage.getItem("atividades_completas") || 0) + 1)
  );

  alert(`
ATIVIDADE CONCLUÍDA!

Quiz: ${acertos}/${QUIZ.length} acertos
+${PM_ATIVIDADE} PM (fixo)
+${totalPC} PC (vantagens)
+${acertos * 10} XP

Seu novo ranque: ${getRanque(aluno.pm)}
  `);

  aluno.vantagensAtivas = [];
  saveAluno();
  updateRankBadge();
  renderVantagens();
  renderQuiz();
  tryUnlockAchievements();
}


const studentBtn = document.getElementById("student-btn");
const studentPanel = document.getElementById("student-panel");
const closeStudent = document.getElementById("close-student");
const xpFill = document.getElementById("xp-fill");
const xpText = document.getElementById("xp-text");
const studentSummary = document.getElementById("student-summary");

let xp = Number(localStorage.getItem("xp") || 0);

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
| XP total: ${xp}
| Nível: ${Math.floor(xp / XP_NEEDED)}
  `;
}


const masterBtn = document.getElementById("master-btn");
const masterPanel = document.getElementById("master-panel");
const closeMaster = document.getElementById("close-master");
const exportBtn = document.getElementById("export-btn");
const resetBtn = document.getElementById("reset-btn");
const masterOutput = document.getElementById("master-output");

masterBtn.addEventListener("click", () => {
  masterPanel.classList.toggle("hidden");
  masterOutput.textContent = JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY)), null, 2);
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

function exportCSV() {
  let csv = "key,value\n";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    csv += `${key},"${localStorage.getItem(key)}"\n`;
  }

  const blob = new Blob([csv], {type: "text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "legado_dados.csv";
  a.click();
}


const ACHIEVEMENTS_DATA = [
  {
    id: "first_activity",
    name: "Primeiro Passo",
    desc: "Concluiu sua primeira atividade",
    condition: () => totalActivities() >= 1
  },
  {
    id: "first_advantage",
    name: "Aproveitou a Chance",
    desc: "Usou uma vantagem pela primeira vez",
    condition: () => Number(localStorage.getItem("vantagens_usadas")) >= 1
  },
  {
    id: "xp_100",
    name: "Ascendente",
    desc: "Conquistou 100 XP totais",
    condition: () => xp >= 100
  },
  {
    id: "xp_500",
    name: "Veterano",
    desc: "Passou da marca de 500 XP",
    condition: () => xp >= 500
  },
  {
    id: "rank_5",
    name: "Nobre da Aprendizagem",
    desc: "Alcançou o Ranque 5",
    condition: () => getRanqueNumero() >= 5
  },
  {
    id: "house_loyalty",
    name: "Fiel à Casa",
    desc: "Participou de 10 atividades na mesma casa",
    condition: () => Number(localStorage.getItem("atividades_completas")) >= 10
  }
];

const achievementsBtn = document.getElementById("achievements-btn");
const achievementsPanel = document.getElementById("achievements-panel");
const closeAchievements = document.getElementById("close-achievements");
const achievementsList = document.getElementById("achievements-list");

achievementsBtn.addEventListener("click", () => {
  achievementsPanel.classList.toggle("hidden");
  renderAchievements();
});

closeAchievements.addEventListener("click", () => {
  achievementsPanel.classList.add("hidden");
});

function renderAchievements() {
  const unlocked = JSON.parse(localStorage.getItem("achievements") || "{}");

  achievementsList.innerHTML = ACHIEVEMENTS_DATA.map(a => {
    const isUnlocked = unlocked[a.id];

    return `
      <li class="${isUnlocked ? "badge-unlocked" : "badge-locked"}">
        🏅 ${a.name}
        <br><small>${a.desc}</small>
      </li>
    `;
  }).join("");
}

function tryUnlockAchievements() {
  const unlocked = JSON.parse(localStorage.getItem("achievements") || "{}");
  let changed = false;

  ACHIEVEMENTS_DATA.forEach(a => {
    if (!unlocked[a.id] && a.condition()) {
      unlocked[a.id] = true;
      changed = true;
      showAchievementToast(a.name);
    }
  });

  if (changed) {
    localStorage.setItem("achievements", JSON.stringify(unlocked));
  }
}

function showAchievementToast(name) {
  alert(`🏅 Nova conquista desbloqueada:\n${name}`);
}

function totalActivities() {
  return Number(localStorage.getItem("atividades_completas") || 0);
}


window.onload = () => {
  updateRankBadge();
  renderQuiz();
  renderVantagens();
};
document.getElementById("finish-btn").addEventListener("click", finalizarAtividade);
