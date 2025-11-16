/**************************************
 * VARIÁVEIS PRINCIPAIS 
 **************************************/
const STORAGE_KEY = "legadoEscolarAluno";

let PM_ATIVIDADE = Number(localStorage.getItem("cfg_pm")) || 10;
let XP_NEEDED = Number(localStorage.getItem("cfg_xp")) || 100;
let MULTIPLICADORES_ATIVOS = localStorage.getItem("cfg_mult") !== "off";

const VANTAGENS = window.VANTAGENS;

/**************************************
 * SISTEMA BASE
 **************************************/
function loadAlunos() {
  return JSON.parse(localStorage.getItem("alunos") || "{}");
}

function saveAlunos(data) {
  localStorage.setItem("alunos", JSON.stringify(data));
}

function criarAluno() {
  const nome = document.getElementById("nomeAluno").value.trim();
  const casa = document.getElementById("casaAluno").value;

  if (!nome) return alert("Digite um nome!");

  const alunos = loadAlunos();

  if (alunos[nome]) return alert("Esse aluno já existe!");

  alunos[nome] = {
    nome,
    casa,
    pm: 0,
    pc: 0,
    xp: 0,
    lvl: 1,
    inventario: []
  };

  saveAlunos(alunos);
  atualizarSelect();
  alert("Aluno criado com sucesso!");
}

/**************************************
 * SELEÇÃO DE ALUNOS
 **************************************/
function atualizarSelect() {
  const select = document.getElementById("selectAluno");
  const alunos = loadAlunos();
  const entries = Object.values(alunos);

  select.innerHTML = entries.map(a => `<option>${a.nome}</option>`).join("");
  renderAluno();
}

function renderAluno() {
  const alunos = loadAlunos();
  const nome = document.getElementById("selectAluno").value;
  const a = alunos[nome];
  if (!a) return;

  document.getElementById("dadosAluno").innerHTML = `
    <h3>${a.nome} — ${a.casa}</h3>
    <p><b>PM:</b> ${a.pm}</p>
    <p><b>PC:</b> ${a.pc}</p>
    <p><b>XP:</b> ${a.xp}/${XP_NEEDED}</p>
    <p><b>Nível:</b> ${a.lvl}</p>
    <div id="xpBar"><div style="width:${(a.xp / XP_NEEDED) * 100}%"></div></div>
  `;

  renderVantagens(a);
  renderInventario(a);
}

/**************************************
 * RECOMPENSAS
 **************************************/
function ganharPM() {
  const alunos = loadAlunos();
  const nome = document.getElementById("selectAluno").value;
  const a = alunos[nome];

  a.pm += PM_ATIVIDADE;
  saveAlunos(alunos);
  renderAluno();
}

function ganharXP() {
  const alunos = loadAlunos();
  const nome = document.getElementById("selectAluno").value;
  const a = alunos[nome];

  a.xp += 10;

  if (a.xp >= XP_NEEDED) {
    a.xp = 0;
    a.lvl++;
  }

  saveAlunos(alunos);
  renderAluno();
}

/**************************************
 * VANTAGENS
 **************************************/
function renderVantagens(a) {
  const container = document.getElementById("vantagens");
  const lista = VANTAGENS[a.casa];
  if (!lista) return (container.innerHTML = "(Sem vantagens)");

  let html = "";
  for (let rank in lista) {
    html += `<h4>Ranque ${rank}</h4>`;
    lista[rank].forEach(v => {
      html += `<button onclick="usarVantagem('${a.nome}','${rank}','${v.id}')">${v.nome}</button>`;
    });
  }
  container.innerHTML = html;
}

function usarVantagem(nome, rank, id) {
  const alunos = loadAlunos();
  const a = alunos[nome];
  const vantagem = VANTAGENS[a.casa][rank].find(v => v.id === id);

  if (!vantagem) return;

  let ganhoPC = vantagem.bonus || 0;

  if (MULTIPLICADORES_ATIVOS && vantagem.type === "multiplicador") {
    ganhoPC = Math.round(a.pm * vantagem.multiplier);
  }

  a.pc += ganhoPC;
  a.inventario.push(`Usou: ${vantagem.nome} (+${ganhoPC} PC)`);

  saveAlunos(alunos);
  renderAluno();
}

/**************************************
 * INVENTÁRIO
 **************************************/
function renderInventario(a) {
  const div = document.getElementById("inventario");
  if (!a.inventario.length) return (div.innerHTML = "Nenhum item");

  div.innerHTML = a.inventario
    .map(i => `<div>${i}</div>`)
    .join("");
}

/**************************************
 * EXPORTAÇÃO CSV
 **************************************/
function exportarCSV() {
  const alunos = loadAlunos();
  const linhas = [["Nome", "Casa", "PM", "PC", "XP", "Nível"]];

  for (const a of Object.values(alunos)) {
    linhas.push([a.nome, a.casa, a.pm, a.pc, a.xp, a.lvl]);
  }

  const csv = linhas.map(l => l.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "alunos.csv";
  a.click();
}

/**************************************
 * RESET TOTAL
 **************************************/
function resetSistema() {
  if (confirm("Tem certeza?")) {
    localStorage.clear();
    location.reload();
  }
}

/**************************************
 * RANKING
 **************************************/
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
  const raw = loadAlunos();
  const alunos = Object.values(raw);

  alunos.sort((a,b)=> (b.pc + b.pm) - (a.pc + a.pm));

  rankingAlunos.innerHTML = alunos.map((a,i)=>`
    <li><b>${i+1}º</b> — ${a.nome} (${a.casa}) — <b>${a.pc + a.pm} pts</b></li>
  `).join("");

  const casas = {};
  alunos.forEach(a => {
    casas[a.casa] = (casas[a.casa] || 0) + (a.pc + a.pm);
  });

  rankingCasas.innerHTML = Object.entries(casas)
    .sort((a,b)=>b[1]-a[1])
    .map((c,i)=>`<li><b>${i+1}º</b> — ${c[0]} — <b>${c[1]} pts</b></li>`)
    .join("");
}

/**************************************
 * STARTUP
 **************************************/
atualizarSelect();
