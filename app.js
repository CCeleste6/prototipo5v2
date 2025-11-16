const questions = [

  {
    text: "Qual é o resultado de 7 × 8?",
    options: [
      { label: "48", casa: "solidarios" },
      { label: "56", casa: "precursores" },
      { label: "64", casa: "visionarios" },
      { label: "52", casa: "guardioes" },
    ]
  },
  {
    text: "Qual é a fração equivalente a 0,5?",
    options: [
      { label: "1/2", casa: "visionarios" },
      { label: "2/3", casa: "solidarios" },
      { label: "3/5", casa: "precursores" },
      { label: "4/6", casa: "guardioes" },
    ]
  },
  {
    text: "Se um carro percorre 240 km em 3 horas, qual é sua velocidade média?",
    options: [
      { label: "80 km/h", casa: "guardioes" },
      { label: "60 km/h", casa: "precursores" },
      { label: "100 km/h", casa: "visionarios" },
      { label: "40 km/h", casa: "solidarios" },
    ]
  },
  {
    text: "Qual é o valor de (3² + 4²)?",
    options: [
      { label: "25", casa: "solidarios" },
      { label: "12", casa: "visionarios" },
      { label: "5", casa: "precursores" },
      { label: "25", casa: "guardioes" },
    ]
  },
  {
    text: "Se um número é dividido por 2 e o resultado é 18, qual é o número?",
    options: [
      { label: "34", casa: "visionarios" },
      { label: "36", casa: "precursores" },
      { label: "32", casa: "solidarios" },
      { label: "40", casa: "guardioes" },
    ]
  },


  {
    text: "Qual das frases está escrita corretamente?",
    options: [
      { label: "Houveram muitas pessoas na festa", casa: "solidarios" },
      { label: "Fazem dois anos que viajei", casa: "guardioes" },
      { label: "Faz dois anos que viajei", casa: "precursores" },
      { label: "Existem muito tempo", casa: "visionarios" },
    ]
  },
  {
    text: "Qual é o plural de 'cidadão'?",
    options: [
      { label: "Cidadãoses", casa: "visionarios" },
      { label: "Cidadões", casa: "solidarios" },
      { label: "Cidadãos", casa: "guardioes" },
      { label: "Cidadães", casa: "precursores" },
    ]
  },
  {
    text: "Em qual opção há um verbo no pretérito perfeito?",
    options: [
      { label: "Eu comerei", casa: "visionarios" },
      { label: "Eu estudava", casa: "solidarios" },
      { label: "Eu estudei", casa: "precursores" },
      { label: "Eu estudaria", casa: "guardioes" },
    ]
  },
  {
    text: "Qual alternativa apresenta um advérbio?",
    options: [
      { label: "Inteligente", casa: "solidarios" },
      { label: "Felizmente", casa: "visionarios" },
      { label: "Bonito", casa: "guardioes" },
      { label: "Menino", casa: "precursores" },
    ]
  },
  {
    text: "Assinale a opção com acentuação correta:",
    options: [
      { label: "Ideia", casa: "solidarios" },
      { label: "Heróico", casa: "visionarios" },
      { label: "Pôe-se", casa: "precursores" },
      { label: "Vôo", casa: "guardioes" },
    ]
  }
];


let currentQuestionIndex = 0;
const scores = {
  precursores: 0,
  visionarios: 0,
  guardioes: 0,
  solidarios: 0
};


const questionTextEl = document.getElementById('question-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const resultsSection = document.getElementById('results');
const restartBtn = document.getElementById('restart-btn');

const scorePrecursoresEl = document.getElementById('score-precursores');
const scoreVisionariosEl = document.getElementById('score-visionarios');
const scoreGuardioesEl = document.getElementById('score-guardioes');
const scoreSolidariosEl = document.getElementById('score-solidarios');

const finalPrecursores = document.getElementById('final-precursores');
const finalVisionarios = document.getElementById('final-visionarios');
const finalGuardioes = document.getElementById('final-guardioes');
const finalSolidarios = document.getElementById('final-solidarios');


function renderQuestion() {
  const q = questions[currentQuestionIndex];
  questionTextEl.textContent = q.text;

  const container = document.getElementById('question-container');
  while (container.children.length > 1) {
    container.removeChild(container.lastChild);
  }

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt.label;
    btn.className = 'btn btn--nav';
    btn.addEventListener('click', () => {
      scores[opt.casa]++;
      updateScores();
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        showResults();
      }
    });
    container.appendChild(btn);
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === questions.length - 1;
}


function updateScores() {
  scorePrecursoresEl.textContent = scores.precursores;
  scoreVisionariosEl.textContent = scores.visionarios;
  scoreGuardioesEl.textContent = scores.guardioes;
  scoreSolidariosEl.textContent = scores.solidarios;
}


function showResults() {
  resultsSection.style.display = "block";
  finalPrecursores.textContent = scores.precursores;
  finalVisionarios.textContent = scores.visionarios;
  finalGuardioes.textContent = scores.guardioes;
  finalSolidarios.textContent = scores.solidarios;
}


function restartQuiz() {
  currentQuestionIndex = 0;
  for (let key in scores) scores[key] = 0;
  updateScores();
  resultsSection.style.display = "none";
  renderQuestion();
}


prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
});
nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  }
});
restartBtn.addEventListener("click", restartQuiz);


renderQuestion();
updateScores();
