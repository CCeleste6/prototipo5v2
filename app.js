/* =========================
   App principal - prototipo5v2
   ========================= */

const PM_KEY = "cfg_pm_fixed";
const XP_PER_KEY = "cfg_xp_per_acerto";
const XP_NEEDED_KEY = "cfg_xp_needed";
const ALUNOS_KEY = "legado_alunos";
const INVENT_KEY = "legado_invent";

const DEFAULTS = {
  pmFixed: 10,
  xpPerAcerto: 10,
  xpNeeded: 100
};

/* RANKS: ordem crescente (baixo -> alto)
   mapeie nomes para arquivos em assets/ranks/
*/
const RANKS = [
  "estudante",
  "pesquisador",
  "academico",
  "mentor",
  "erudito",
  "filosofo",
  "sabio",
  "luminar",
  "oráculo"
];

const RANK_THRESHOLDS = [0, 200, 600, 1400, 2600, 4200, 6200, 8800, 12000];

/* util: ler configs */
function cfg(key, fallback) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return Number(v);
}

/* pegar VANTAGENS globais definidas em VANTAGENS.js */
const VANTAGENS = window.VANTAGENS || {};

function saveAlunos(obj) { localStorage.setItem(ALUNOS_KEY, JSON.stringify(obj)); }
function loadAlunos(){ return JSON.parse(localStorage.getItem(ALUNOS_KEY) || "{}"); }
function saveInvent(arr){ localStorage.setItem(INVENT_KEY, JSON.stringify(arr)); }
function loadInvent(){ return JSON.parse(localStorage.getItem(INVENT_KEY) || "[]"); }

/* ---------- UI refs ---------- */
const el = id => document.getElementById(id);
const qForm = el("quiz-form");

const state = {
  currentStudent: null
};

/* ---------- PERGUNTAS (10: 5 matemática, 5 português) ---------- */
const QUIZ = [
  /* matemática */
  { id:"q1", q:"Quanto é 7 × 8?", options:["48","54","56","64"], answer:2 },
  { id:"q2", q:"A raiz quadrada de 81 é:", options:["7","8","9","10"], answer:2 },
  { id:"q3", q:"Se João tem 12 balas e dá 5, fica com:", options:["5","7","8","9"], answer:1 },
  { id:"q4", q:"1/4 + 1/4 =", options:["1/2","1/4","3/4","1"], answer:0 },
  { id:"q5", q:"Próximo número: 2,4,8,16 __", options:["18","20","24","32"], answer:3 },
  /* português */
  { id:"q6", q:"Qual frase está correta?", options:["Nós vai ao cinema","Nós vamos ao cinema","Nós iremos ao cinema"], answer:1 },
  { id:"q7", q:"Classe de 'rapidamente':", options:["Verbo","Adjetivo","Advérbio","Substantivo"], answer:2 },
  { id:"q8", q:"Em 'As flores foram colhidas', a voz é:", options:["ativa","passiva"], answer:1 },
  { id:"q9", q:"Plural de 'cão':", options:["cãos","cães","cões","caoes"], answer:1 },
  { id:"q10", q:"Sujeito em 'Vento forte derrubou a árvore':", options:["vento forte","árvore","derrubou","não tem"], answer:0 }
];

/* ---------- helpers ranque e imagem ---------- */
function getRankByPM(pm){
  for(let i = RANK_THRESHOLDS.length-1; i>=0; i--){
    if(pm >= RANK_THRESHOLDS[i]) return RANKS[i];
  }
  return RANKS[0];
}
function rankImagePath(rankName){
  // usa exatamente o arquivo que você já tem em assets/ranks/
  // cuidado: nomes de arquivos sensíveis a maiúsculas. Usamos versão conhecida.
  // mapeie variações:
  const map = {
    "estudante":"estudante.png",
    "pesquisador":"pesquisador.png",
    "academico":"academico.png",
    "mentor":"mentor.png",
    "erudito":"erudito.png",
    "filosofo":"filosofo.png",
    "sabio":"sabio.png",
    "luminar":"luminar.png",
    "oráculo":"oráculo.png",
    "oraculo":"oráculo.png"
  };
  return `assets/ranks/${map[rankName] || "estudante.png"}`;
}

/* ---------- CRUD Aluno ---------- */
function createOrLoadStudent(name, casa){
  const students = loadAlunos();
  if(!name) return alert("Digite um nome.");
  if(!students[name]){
    students[name] = {
      nome:name,
      casa:casa,
      pm:0,
      pc:0,
      xp:0,
      lvl:0,
      chosenAdvantages: {}, // {rank: advId}
      inventory: []
    };
    saveAlunos(students);
  }
  state.currentStudent = name;
  renderMain();
}

function getCurrent(){
  const s = loadAlunos();
  return s[state.currentStudent];
}

/* ---------- RENDER PRINCIPAL ---------- */
function renderMain(){
  const current = getCurrent();
  if(!current) {
    el("aluno-panel").hidden = true;
    return;
  }
  el("aluno-panel").hidden = false;
  el("aluno-nome").textContent = current.nome;
  el("aluno-casa").textContent = current.casa;
  const rank = getRankByPM(current.pm);
  el("aluno-rank").textContent = rank;
  el("rank-badge").src = rankImagePath(rank);
  el("aluno-pm").textContent = current.pm;
  el("aluno-pc").textContent = current.pc;
  el("aluno-xp").textContent = current.xp;
  el("aluno-lvl").textContent = current.lvl;
  const xpNeeded = cfg(XP_NEEDED_KEY, DEFAULTS.xpNeeded);
  const pct = Math.min(100, (current.xp / xpNeeded) * 100);
  el("xp-fill").style.width = pct + "%";
}

/* ---------- RENDER QUIZ ---------- */
function renderQuizForm(){
  qForm.innerHTML = "";
  QUIZ.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "q";
    let html = `<p><b>${idx+1}.</b> ${item.q}</p>`;
    item.options.forEach((opt,i)=>{
      html += `<label><input type="radio" name="${item.id}" value="${i}"> ${opt}</label><br>`;
    });
    div.innerHTML = html;
    qForm.appendChild(div);
  });
}

/* ---------- RENDER VANTAGENS (escolhas) ---------- */
function renderVantagensPanel(){
  const current = getCurrent();
  if(!current) return;
  const casa = current.casa;
  const list = VANTAGENS[casa] || {};
  const container = el("vantagens-list");
  container.innerHTML = "";
  // for each rank set of vantagens
  Object.keys(list).sort((a,b)=>a-b).forEach(rank => {
    const block = document.createElement("div");
    block.className = "vant-rank";
    block.innerHTML = `<h4>Ranques até ${rank}</h4>`;
    list[rank].forEach(v=>{
      const id = `chk-${rank}-${v.id}`;
      const checked = current.chosenAdvantages && current.chosenAdvantages[rank] === v.id ? "checked" : "";
      const html = `
        <div class="vant-item">
          <input type="radio" name="rank-${rank}" id="${id}" value="${v.id}" ${checked}>
          <label for="${id}">${v.nome} ${v.bonus ? `( +${v.bonus} PC )` : ""} ${v.multiplier ? `(x${v.multiplier})` : ""}</label>
        </div>
      `;
      block.innerHTML += html;
    });
    container.appendChild(block);
  });
  // add listeners (radio groups ensure one per ranque)
}

/* ---------- SALVAR escolhas de vantagens ---------- */
function saveChosenVantagens(){
  const current = getCurrent();
  if(!current) return;
  const casa = current.casa;
  const list = VANTAGENS[casa] || {};
  // iterate ranks
  Object.keys(list).forEach(rank=>{
    const radios = document.getElementsByName(`rank-${rank}`);
    for(const r of radios) if(r.checked){
      current.chosenAdvantages[rank] = r.value;
      break;
    }
  });
  const students = loadAlunos();
  students[current.nome] = current;
  saveAlunos(students);
  alert("Vantagens salvas.");
  renderMain();
}

/* ---------- APLICAR vantagens ao finalizar atividade (quiz) ---------- */
function applyAdvantagesOnResult(correctCount){
  const current = getCurrent();
  if(!current) return 0;
  let pcGain = 0;
  // We'll sum bonuses from chosen advantages that exist; multipliers calculate relative to correctCount
  for(const rank in current.chosenAdvantages){
    const advId = current.chosenAdvantages[rank];
    // find advantage object
    const advList = VANTAGENS[current.casa] && VANTAGENS[current.casa][rank];
    if(!advList) continue;
    const adv = advList.find(a=>a.id === advId);
    if(!adv) continue;
    if(adv.bonus) pcGain += adv.bonus;
    if(adv.multiplier) {
      // multiplier effect: give multiplier * correctCount * (xpPerAcerto/2) as PC (arbitrário, mas funcional)
      const xpPer = cfg(XP_PER_KEY, DEFAULTS.xpPerAcerto);
      pcGain += Math.round(adv.multiplier * correctCount * (xpPer/2));
    }
    // register inventory
    const inv = loadInvent();
    inv.push({
      id: Date.now(),
      aluno: current.nome,
      casa: current.casa,
      vantagem: adv.nome,
      bonus: adv.bonus || null,
      multiplier: adv.multiplier || null,
      timestamp: new Date().toISOString()
    });
    saveInvent(inv);
  }
  return pcGain;
}

/* ---------- SUBMETER QUIZ ---------- */
function submitQuiz(){
  const current = getCurrent();
  if(!current) return;
  let correct = 0;
  QUIZ.forEach(q=>{
    const sel = qForm.querySelector(`input[name="${q.id}"]:checked`);
    if(sel && Number(sel.value) === q.answer) correct++;
  });
  // XP & PM
  const xpPer = cfg(XP_PER_KEY, DEFAULTS.xpPerAcerto);
  const gainedXP = correct * xpPer;
  const pmFixed = cfg(PM_KEY, DEFAULTS.pmFixed);
  // apply advantages to compute PC
  const gainedPCFromVant = applyAdvantagesOnResult(correct);

  current.xp += gainedXP;
  current.pm += pmFixed;
  current.pc += gainedPCFromVant;
  // level up if xp exceeds xpNeeded
  const xpNeeded = cfg(XP_NEEDED_KEY, DEFAULTS.xpNeeded);
  while(current.xp >= xpNeeded){
    current.xp -= xpNeeded;
    current.lvl++;
  }
  // save
  const students = loadAlunos();
  students[current.nome] = current;
  saveAlunos(students);

  alert(`Resultado: ${correct}/10\n+${pmFixed} PM\n+${gainedPCFromVant} PC (vantagens)\n+${gainedXP} XP`);
  // cleanup chosen advantages per ranque? specification: advantages persist (they choose) — keep them
  renderMain();
  closeQuiz();
}

/* ---------- INVENTÁRIO UI ---------- */
function renderInventarioList(){
  const arr = loadInvent();
  const ul = el("inventario-list");
  ul.innerHTML = "";
  if(!arr.length) ul.innerHTML = "<li>(Nenhum registro)</li>";
  else arr.slice().reverse().forEach(it=>{
    const li = document.createElement("li");
    li.textContent = `${new Date(it.timestamp).toLocaleString()} — ${it.aluno} — ${it.vantagem} (${it.casa})`;
    ul.appendChild(li);
  });
}

/* ---------- RANKING ---------- */
function renderRanking(){
  const studentsObj = loadAlunos();
  const students = Object.values(studentsObj);
  students.sort((a,b)=> (b.pm + b.pc) - (a.pm + a.pc));
  const aList = el("ranking-alunos");
  aList.innerHTML = students.map((s,i)=>`<li>${i+1}. ${s.nome} — ${s.casa} — <b>${s.pm + s.pc}</b></li>`).join("");
  const casas = {};
  students.forEach(s => casas[s.casa] = (casas[s.casa]||0) + (s.pm + s.pc));
  el("ranking-casas").innerHTML = Object.entries(casas).sort((a,b)=>b[1]-a[1]).map((c,i)=>`<li>${i+1}. ${c[0]} — <b>${c[1]}</b></li>`).join("");
}

/* ---------- EXPORT INVENTARIO CSV ---------- */
function exportInventCSV(){
  const arr = loadInvent();
  if(!arr.length) return alert("Nenhum histórico.");
  let csv = "aluno,casa,vantagem,bonus,multiplier,timestamp\n";
  arr.forEach(r=>{
    csv += `"${r.aluno}","${r.casa}","${r.vantagem}","${r.bonus || ""}","${r.multiplier || ""}","${r.timestamp}"\n`;
  });
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "inventario.csv";
  a.click();
}

/* ---------- UI event wiring ---------- */
function wireEvents(){
  el("btn-criar").addEventListener("click", ()=>{
    const name = el("input-nome").value.trim();
    const casa = el("input-casa").value;
    createOrLoadStudent(name, casa);
    renderMain();
  });

  el("btn-iniciar-quiz").addEventListener("click", ()=>{
    renderQuizForm();
    el("quiz-panel").hidden = false;
    el("setup-panel").hidden = true;
    el("vantagens-panel").hidden = true;
  });
  el("btn-cancel-quiz").addEventListener("click", closeQuiz);
  el("btn-submit-quiz").addEventListener("click", submitQuiz);

  el("btn-vantagens").addEventListener("click", ()=>{
    el("vantagens-panel").hidden = false;
    el("quiz-panel").hidden = true;
    renderVantagensPanel();
  });
  el("btn-save-vantagens").addEventListener("click", saveChosenVantagens);
  el("btn-close-vantagens").addEventListener("click", ()=> el("vantagens-panel").hidden = true);

  el("btn-inventario").addEventListener("click", ()=>{ renderInventarioList(); el("inventario-panel").hidden = false; });
  el("btn-close-inv").addEventListener("click", ()=> el("inventario-panel").hidden = true);
  el("btn-export-inv").addEventListener("click", exportInventCSV);
  el("btn-clear-inv").addEventListener("click", ()=>{
    if(confirm("Apagar histórico?")) { saveInvent([]); renderInventarioList(); }
  });

  el("btn-ranking").addEventListener("click", ()=>{ renderRanking(); el("ranking-panel").hidden = false; });
  el("btn-close-ranking").addEventListener("click", ()=> el("ranking-panel").hidden = true);

  el("btn-config").addEventListener("click", ()=>{
    el("config-panel").hidden = false;
    el("cfg-pm").value = cfg(PM_KEY, DEFAULTS.pmFixed);
    el("cfg-xp-per").value = cfg(XP_PER_KEY, DEFAULTS.xpPerAcerto);
    el("cfg-xp-needed").value = cfg(XP_NEEDED_KEY, DEFAULTS.xpNeeded);
  });
  el("btn-save-config").addEventListener("click", ()=>{
    localStorage.setItem(PM_KEY, Number(el("cfg-pm").value));
    localStorage.setItem(XP_PER_KEY, Number(el("cfg-xp-per").value));
    localStorage.setItem(XP_NEEDED_KEY, Number(el("cfg-xp-needed").value));
    alert("Configurações salvas.");
    el("config-panel").hidden = true;
  });
  el("btn-close-config").addEventListener("click", ()=> el("config-panel").hidden = true);
}

/* ---------- helpers UI ---------- */
function closeQuiz(){
  el("quiz-panel").hidden = true;
  el("setup-panel").hidden = false;
  renderMain();
}

/* ---------- startup ---------- */
function init(){
  wireEvents();
  // ensure defaults exist
  if(localStorage.getItem(PM_KEY) === null) localStorage.setItem(PM_KEY, DEFAULTS.pmFixed);
  if(localStorage.getItem(XP_PER_KEY) === null) localStorage.setItem(XP_PER_KEY, DEFAULTS.xpPerAcerto);
  if(localStorage.getItem(XP_NEEDED_KEY) === null) localStorage.setItem(XP_NEEDED_KEY, DEFAULTS.xpNeeded);

  // if students exist, auto-select first
  const students = loadAlunos();
  const keys = Object.keys(students);
  if(keys.length){
    state.currentStudent = keys[0];
  }
  renderMain();
}

/* Run */
init();
