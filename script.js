// -----------------------------
// script.js — Cocktail Quiz (Firestore integration)
// -----------------------------

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*
  Este arquivo está organizado por fluxo:
  1) Carregamento do banco (Firestore)
  2) Dados de distratores
  3) Estado global e refs do DOM
  4) Helpers utilitários (shuffle, scroll, etc.)
  5) Listeners da tela inicial (categorias/páginas/exame)
  6) Início do quiz (modo página e exame)
  7) Renderização da questão
  8) Botões de ação (Next / Back / End / Break)
  9) Timers (por questão e global + break)
 10) Avaliação da questão
 11) Resultados
 12) Navegação
 13) Boot (DOMContentLoaded)
*/

// -----------------------------
// 1) Firestore — carrega cocktails por categoria e página
// -----------------------------
let cocktailDBPages = {}; // { classics: {1: [...], 2:[...]}, menu: {...} }

async function loadCocktails() {
  const querySnapshot = await getDocs(collection(window.db, "cocktails"));
  const byCat = {};
  querySnapshot.forEach(doc => {
    const data = doc.data(); // {category, page, name, ...}
    const cat = data.category || "classics";
    const page = data.page;
    if (!byCat[cat]) byCat[cat] = {};
    if (!byCat[cat][page]) byCat[cat][page] = [];
    byCat[cat][page].push(data);
  });
  cocktailDBPages = byCat;
  console.log("✅ Cocktails loaded:", cocktailDBPages);
}

// -----------------------------
// 2) Distratores (listas para montar alternativas)
// -----------------------------
// Distratores extras
const extraIngredients = [
  "BSC Simple 1:1","Buffalo Trace","Bitter Truth Jerry Thomas Bitters","Lime Juice",
  "Cranberry Juice Eager","Lemon Mix","Ketel One","Dutch Barn Vodka",
  "Briottet Crème De Peche","Mr Blacks Coffee","Bacardi Carta Blanca","Millers Gin",
  "Carpano Dry Vermouth","Whole Milk","Whipping Cream","Oggs",
  "Demerara Sugar","Orange Zest","Pineapple Juice","MK Dark Berries",
  "Goslings Black Seal Rum","Mint Leaves","Artisan Ginger Beer","Caster Sugar","Lemon Sq", "Sagatiba Pura","Lime Sq",
  "Honey","BSC Disco Grenadine","BSC Orgeat","Appleton Estate 8 Year","Martini Rubino Vermouth","Briottet Marasquin","Campari","Courvoisier VS",
  "Cointreau","Tanqueray","Briottet Crème De Cacao Brown","Sipsmith Sloe Gin","Briottet Crème d'Apricot","La Fee Absinthe","Peychaud Bitters",
  "Woodford Rye","Briottet Violette","Lemon Zest Discard","Laphroaig","Johnnie Walker Black","Kaveri Ginger","Luxardo Amaretto","Lemon Zest",
  "Herno Old Tom Gin","Soda Pm","Benedictine","Lillet Blanc","Bacardi Coconut","Midori","Giffard Banane du Brésil","BSC Passion Fruit","Grapefruit Juice",
  "Appleton Signature Rum","Grand Marnier","Velvet Falernum Liqueur","Baileys","BSC Nogave","Patron Silver","Havana 7","Coca Cola Bottle","El Jimador Blanco","Angostura Bitters",
  "Pisco ABA","Orange Juice","Wray & Nephew Overproof","Galliano","Orange Slice","Cucumber","Ginger Ale","Lemonade","Pimms No 1","Jack Daniels Black Label","BSC Raspberry","Red Chili",
  "Coriander Sprigs","Carpano Bianco","Aperol","Mezcal Verde","Chartreuse Yellow","Coke Zero","Amaro Averna","Chartreuse Green","ODK Coconut","Luxardo Cherries & Lemon Zest",
  "Woodford Reserve Rye","Lime Cordial","Alchemist Marmalade","Briottet Crème De Mure","Basil Leaves","Briottet Cacao Blanc","Briottet Menthe Green","Jameson","Hot Water","Espresso",
  "Any Open Red Wine","Moet Champagne","Alchemist Prosecco","Briottet Cassis (Blackcurrant)"
];

const extraQuantities = [
  "1 Count","2 Counts","3 Counts","4 Counts","5 Counts","6 Counts","8 Counts","12 Counts",
  "15 ml Jig","25 ml Jig","50 ml Jig","1 Barspn","2 Barspns","1 Dash","2 Dashes","3 Dashes",
  "1 Unit","2 Units","3 Units","8 Leaves","1/2 Can","6 Units","Top","0.25 Can","10 Units","2 Counts Top","125 ml","30 ml","175 ml","110 ml","80 ml","85 ml"
];

const extraGlassware = [
 "Sexy Rocks","Coupe","Highball","Nick and Nora","Rocks","Tall Highball","Bremen Beer","Tubo","Amber Coffee Glass","Wine Glass","Chilled Flute"
];

const extraGarnishes = [
  "Orange Zest","Lime Sq","Lemon/Lime/Grapefruit Zest or Olive","None","Orange Sq & Cherry","Small Mint Sprig","Lemon Zest","Lime Wheel","Mint Sprig, Lime Sq, Cherry",
  "Orange Zest & Cherry", "Lemon Zest & Sugar Rim","Grapefruit Zest","Cinnamon and Nutmeg Dust","Luxardo Cherries","Flamed Orange Zest","Lemon Sq & Cherry","Banana Leaf",
  "Lime Circle x2","Grapefruit Sq","3 Dashes Angostura Bitters","Mint Sprig","Whole Freeze Dried Raspberries","Chili Stem","Orange Sq","Basil Leaf","Cinnamon/Nutmeg & Hammered Spoon"
];

const extraMethods = ["Stir & Strain","Shake & Fine Strain","Shake and Strain","Build","Build & Quick Stir","Hard Shake and Strain",
  "Shake & Double Strain","Muddle Shake & Pour","Blend 3 cubes & Fine Strain","Rinse / Stir & Strain","Build Over Ice Ball","Build and Churn",
  "Shake, Strain & Top","Hard Shake & Fine Strain", "Build & Stir"];

const extraIce = ["Crushed","Cubed","Iceball","None","7 Cubes","Dry Ice"];

// -----------------------------
// 3) Estado global + refs DOM
// -----------------------------
let cocktailDB = [];           // cocktails da sessão atual (página ou exame)
let currentCategory = "classics";
let currentUserName = "";
let currentCocktailIndex = 0;

let results = [];
let totalQuestions = 0;
let totalCorrect = 0;

let isFullExam = false;
let hasAnswered = false;
let breakUsed = false;
let isOnBreak = false;

// Timers
const QUESTION_TIME = 300;      // 5 min por cocktail (modo página/estudo)
const EXAM_TIME = 21600;        // 6 horas (exame final)
const BREAK_TIME = 1800;        // 30 min de break (extra)
let timerRef = null;
let globalTimeLeft = 0;         // Exame
let breakTimeLeft = 0;          // Contador visível de break

// DOM
const quizContainer = document.getElementById("quiz-container");
const resultSummary = document.getElementById("result-summary");
const timerDiv = document.getElementById("timer");

// -----------------------------
// 4) Helpers
// -----------------------------
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
function resetQuiz() {
  currentCocktailIndex = 0;
  results = [];
  totalQuestions = 0;
  totalCorrect = 0;
  hasAnswered = false;
}
function clearButtons() {
  document.querySelectorAll(".action-buttons, .result-buttons").forEach(el => el.remove());
}
function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function clearTimer() {
  clearInterval(timerRef);
  timerRef = null;
}
function formatMinutes(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

// -----------------------------
// 5) Listeners — categorias, páginas e full exam
// -----------------------------
// Abre/fecha grupo de páginas da categoria
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    const container = document.getElementById(`${category}-pages`);
    container.style.display = container.style.display === "none" ? "block" : "none";
  });
});

// Inicia por página (modo estudo)
document.querySelectorAll(".page-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    isFullExam = false;
    breakUsed = false;
    isOnBreak = false;

    currentUserName = document.getElementById("username").value.trim() || "Guest";
    currentCategory = btn.dataset.category;
    const selectedPage = btn.dataset.page;

    cocktailDB = cocktailDBPages[currentCategory]?.[selectedPage] || [];
    startQuiz(false); // estudo
  });
});

// Inicia full exam da categoria
document.querySelectorAll(".full-test-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    isFullExam = true;
    breakUsed = false;
    isOnBreak = false;

    currentUserName = document.getElementById("username").value.trim() || "Guest";
    currentCategory = btn.dataset.category;

    cocktailDB = Object.values(cocktailDBPages[currentCategory] || {}).flat();
    startQuiz(true); // exame
  });
});

// -----------------------------
// 6) Start Quiz
// -----------------------------
function startQuiz(fullExam = false) {
  resetQuiz();
  scrollTop();

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";

  if (fullExam) {
    // cronômetro global e primeira questão
    globalTimeLeft = EXAM_TIME;
    startGlobalTimer();
    renderQuestion(); // <- antes faltava isso!
  } else {
    renderQuestion();
  }
}

// -----------------------------
// 7) Renderização de questão
// -----------------------------
function getAllIngredients(cocktail) {
  if (isFullExam) {
    const list = cocktailDB.flatMap(c => c.ingredients.map(i => i.ingredient));
    return Array.from(new Set(list.concat(extraIngredients))).sort();
  } else {
    const pageCocktails = cocktailDBPages[cocktail.category || currentCategory]?.[cocktail.page] || [];
    const list = pageCocktails.flatMap(c => c.ingredients.map(i => i.ingredient));
    return Array.from(new Set(list.concat(extraIngredients))).sort();
  }
}
function getAllQuantities() {
  return Array.from(new Set(extraQuantities)).sort();
}
function createDropdown(options, placeholder) {
  const sel = document.createElement("select");
  const def = document.createElement("option");
  def.value = "";
  def.textContent = placeholder;
  sel.appendChild(def);
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
  return sel;
}
function preventDuplicateIngredients(selectEl) {
  selectEl.addEventListener("change", () => {
    const selected = Array.from(document.querySelectorAll(".ingredient"))
      .map(s => s.value)
      .filter(v => v);
    const duplicates = selected.filter((v, i, arr) => arr.indexOf(v) !== i);
    if (duplicates.length > 0) {
      alert(`⚠️ You already selected "${selectEl.value}". Choose a different ingredient.`);
      selectEl.value = "";
    }
  });
}
function createRadio(labelText, nameKey, correctAnswer, sourceOptions) {
  const div = document.createElement("div");
  div.className = "question-block";
  const h3 = document.createElement("h3");
  h3.textContent = labelText;
  div.appendChild(h3);

  // 7 alternativas (6 erradas + 1 correta), embaralhadas
  let pool = sourceOptions.filter(opt => opt !== correctAnswer);
  pool = shuffleArray(pool).slice(0, 6);
  pool.push(correctAnswer);
  pool = shuffleArray(pool);

  pool.forEach(opt => {
    const label = document.createElement("label");
    label.className = "option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = nameKey;
    input.value = opt;
    const span = document.createElement("span");
    span.textContent = opt;
    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(label);
  });

  quizContainer.appendChild(div);
}

function renderQuestion() {
  scrollTop();
  quizContainer.innerHTML = "";
  resultSummary.innerHTML = "";

  const cocktail = cocktailDB[currentCocktailIndex];

  const testInfo = document.createElement("p");
  testInfo.className = "test-info";
  testInfo.textContent = isFullExam
    ? "🏆 Final Exam"
    : `📘 Studying — Page ${cocktail.page}`;
  quizContainer.appendChild(testInfo);

  const title = document.createElement("h2");
  title.innerHTML = `What's the spec for : <span class="cocktail-name">${cocktail.name}</span>`;
  quizContainer.appendChild(title);

  const allIngredients = getAllIngredients(cocktail);
  const allQuantities = getAllQuantities();

  // Linhas de ingredientes/quantidades
  cocktail.ingredients.forEach(() => {
    const row = document.createElement("div");
    row.className = "ingredient-row";
    const ingSel = createDropdown(allIngredients, "Choose ingredient");
    ingSel.classList.add("ingredient");
    preventDuplicateIngredients(ingSel);
    const qtySel = createDropdown(allQuantities, "Choose quantity");
    qtySel.classList.add("quantity");
    row.appendChild(ingSel);
    row.appendChild(qtySel);
    quizContainer.appendChild(row);
  });

  // Radios (7 alternativas)
  createRadio("Which glass is used?",   "q-glass",   cocktail.glass,   extraGlassware);
  createRadio("What's the method?",     "q-method",  cocktail.method,  extraMethods);
  createRadio("Which garnish is used?", "q-garnish", cocktail.garnish, extraGarnishes);
  createRadio("Which ice is used?",     "q-ice",     cocktail.ice,     extraIce);

  setupActionButtonsDuringTest();

  // Timer: só no modo estudo (página). No exame, o timer é global.
  if (!isFullExam) startQuestionTimer();
}

// -----------------------------
// 8) Botões de ação (Next / Back / End / Break)
// -----------------------------
function setupActionButtonsDuringTest() {
  clearButtons();
  const container = document.createElement("div");
  container.className = "action-buttons";

  // Break (só no exame, ao lado dos outros botões)
  if (isFullExam) {
    const breakBtn = document.createElement("button");
    breakBtn.textContent = "☕ Break (30 min)";
    if (breakUsed) {
      breakBtn.disabled = true;
      breakBtn.title = "Break already used";
    }
    breakBtn.onclick = () => {
      if (breakUsed) return alert("⚠️ Break already used.");
      const input = prompt("Supervisor password to start the break:");
      if (input === "The Alchemist") {
        startBreak();
      } else {
        alert("❌ Wrong password.");
      }
    };
    container.appendChild(breakBtn);
  }

  // End Test (aparece só após confirmar 1 cocktail)
  if (hasAnswered) {
    const endBtn = document.createElement("button");
    endBtn.textContent = "🚪 End Test";
    endBtn.onclick = () => { scrollTop(); endTest(); };
    container.appendChild(endBtn);
  }

  // Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "⏭️ Next";
  nextBtn.onclick = () => { scrollTop(); handleNext(); };

  // Back to Home
  const homeBtn = document.createElement("button");
  homeBtn.textContent = "🔙 Back to Home";
  homeBtn.onclick = () => { scrollTop(); backToHome(); };

  container.append(nextBtn, homeBtn);
  document.getElementById("quiz-section").appendChild(container);
}

// -----------------------------
// 9) Timers — questão, global e break
// -----------------------------
function startQuestionTimer() {
  clearTimer();
  let timeLeft = QUESTION_TIME;
  timerDiv.textContent = `Time left: ${formatMinutes(timeLeft)}`;
  timerRef = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Time left: ${formatMinutes(timeLeft)}`;
    if (timeLeft <= 0) {
      clearTimer();
      alert("⏰ Time is up! Moving to the next cocktail...");
      handleNext();
    }
  }, 1000);
}

function startGlobalTimer() {
  clearTimer();
  if (isOnBreak) return; // se estiver em break, não conta

  timerDiv.textContent = `Exam time left: ${formatMinutes(globalTimeLeft)}`;
  timerRef = setInterval(() => {
    globalTimeLeft--;
    timerDiv.textContent = `Exam time left: ${formatMinutes(globalTimeLeft)}`;
    if (globalTimeLeft <= 0) {
      clearTimer();
      alert("⏰ Exam time is over!");
      endTest();
    }
  }, 1000);
}

function startBreak() {
  // pausa exame (sem descontar), mostra contagem do break
  breakUsed = true;
  isOnBreak = true;
  clearTimer(); // para o timer global
  breakTimeLeft = BREAK_TIME;

  timerDiv.textContent = `Break time left: ${formatMinutes(breakTimeLeft)}`;
  timerRef = setInterval(() => {
    breakTimeLeft--;
    timerDiv.textContent = `Break time left: ${formatMinutes(breakTimeLeft)}`;
    if (breakTimeLeft <= 0) {
      clearTimer();
      isOnBreak = false;
      alert("✅ Break finished. Resuming the exam.");
      startGlobalTimer();
    }
  }, 1000);

  // atualiza botões (desabilita o break visualmente)
  setupActionButtonsDuringTest();
}

// -----------------------------
// 10) Avaliação da questão
// -----------------------------
function evaluateCurrentQuestion() {
  hasAnswered = true; // usuário confirmou pelo menos 1 cocktail

  const cocktail = cocktailDB[currentCocktailIndex];
  let cocktailResults = [];
  let correctCount = 0;

  // inputs do usuário
  const ingredientSelects = document.querySelectorAll(".ingredient");
  const quantitySelects = document.querySelectorAll(".quantity");
  const userPairs = Array.from(ingredientSelects).map((sel, idx) => ({
    ingredient: sel.value,
    quantity: quantitySelects[idx].value
  }));

  // matching flexível (ordem livre)
  let remainingCorrect = [...cocktail.ingredients];
  const pending = [];
  const wrongOrBlankPairs = [];

  // 1) matches exatos
  userPairs.forEach(up => {
    if (!up.ingredient || !up.quantity) {
      wrongOrBlankPairs.push(up);
      return;
    }
    const matchIdx = remainingCorrect.findIndex(
      ci => ci.ingredient === up.ingredient && ci.quantity === up.quantity
    );
    if (matchIdx !== -1) {
      correctCount++;
      totalCorrect++;
      remainingCorrect.splice(matchIdx, 1);
      cocktailResults.push({ correct: true, type: "ingredient" });
    } else {
      pending.push(up);
    }
  });

  // 2) ingrediente certo, quantidade errada
  pending.forEach(up => {
    const sameIngIdx = remainingCorrect.findIndex(ci => ci.ingredient === up.ingredient);
    if (sameIngIdx !== -1) {
      const right = remainingCorrect[sameIngIdx];
      cocktailResults.push({
        correct: false,
        type: "ingredient",
        user: `${up.ingredient} - ${up.quantity}`,
        correctAnswer: `${right.ingredient} - ${right.quantity}`
      });
      remainingCorrect.splice(sameIngIdx, 1);
    } else {
      wrongOrBlankPairs.push(up);
    }
  });

  // 3) ingrediente errado ou em branco
  wrongOrBlankPairs.forEach(up => {
    const right = remainingCorrect.shift();
    cocktailResults.push({
      correct: false,
      type: "ingredient",
      user: `${up.ingredient || "none"} - ${up.quantity || "none"}`,
      correctAnswer: right ? `${right.ingredient} - ${right.quantity}` : "N/A"
    });
  });

  // Radios
  const radioSpec = [
    { key: "q-glass",   type: "glass",   correct: cocktail.glass },
    { key: "q-method",  type: "method",  correct: cocktail.method },
    { key: "q-garnish", type: "garnish", correct: cocktail.garnish },
    { key: "q-ice",     type: "ice",     correct: cocktail.ice }
  ];

  radioSpec.forEach(({key, type, correct}) => {
    totalQuestions++;
    const sel = document.querySelector(`input[name="${key}"]:checked`);
    const val = sel ? sel.value : "";
    if (val === correct) {
      correctCount++;
      totalCorrect++;
      cocktailResults.push({ correct: true, type });
    } else {
      cocktailResults.push({
        correct: false,
        type,
        user: val || "none",
        correctAnswer: correct
      });
    }
  });

  results.push({
    cocktail: cocktail.name,
    page: cocktail.page,
    answers: cocktailResults,
    correct: correctCount === (cocktail.ingredients.length + 4)
  });
}

// -----------------------------
// 11) Resultados
// -----------------------------
function showResults() {
  scrollTop();
  quizContainer.innerHTML = "";
  timerDiv.textContent = "";
  clearButtons();
  clearTimer();

  // Se tentar encerrar sem confirmar nada
  if (!hasAnswered) {
    resultSummary.innerHTML = `<p class="fail">⚠️ You haven’t confirmed any cocktails yet. Nothing to show in the results.</p>`;
    return;
  }

  resultSummary.innerHTML = `<h2>📊 Results</h2>`;

  // Agrupa por página (para o usuário saber onde estudar)
  const groupedByPage = {};
  results.forEach(r => {
    if (!groupedByPage[r.page]) groupedByPage[r.page] = [];
    groupedByPage[r.page].push(r);
  });

  Object.entries(groupedByPage).forEach(([page, cocktails]) => {
    const pageContainer = document.createElement("div");
    pageContainer.className = "page-results";

    const header = document.createElement("h3");
    header.textContent = `📖 Page ${page}`;
    pageContainer.appendChild(header);

    cocktails.forEach(r => {
      const card = document.createElement("div");
      card.className = "cocktail-card";

      const title = document.createElement("h2");
      title.textContent = `${r.cocktail} — ${r.correct ? "✅ Correct!" : "❌ Wrong"}`;
      title.className = r.correct ? "correct-title" : "incorrect-title";
      card.appendChild(title);

      const categories = {
        "Ingredients": r.answers.filter(a => a.type === "ingredient" && !a.correct),
        "Method":     r.answers.filter(a => a.type === "method" && !a.correct),
        "Ice":        r.answers.filter(a => a.type === "ice" && !a.correct),
        "Garnish":    r.answers.filter(a => a.type === "garnish" && !a.correct),
        "Glassware":  r.answers.filter(a => a.type === "glass" && !a.correct)
      };

      Object.entries(categories).forEach(([label, wrongs]) => {
        if (wrongs.length > 0) {
          const section = document.createElement("div");
          section.className = "feedback-section";

          const h4 = document.createElement("h4");
          h4.textContent = label;
          section.appendChild(h4);

          const ul = document.createElement("ul");
          wrongs.forEach(ans => {
            const li = document.createElement("li");
            li.innerHTML = `❌ <span class="wrong">${ans.user || "none"}</span> → ✅ <span class="correct">${ans.correctAnswer}</span>`;
            ul.appendChild(li);
          });

          section.appendChild(ul);
          card.appendChild(section);
        }
      });

      pageContainer.appendChild(card);
    });

    resultSummary.appendChild(pageContainer);
  });

  if (isFullExam) {
    const percent = Math.round((totalCorrect / totalQuestions) * 100);
    const finalMsg = document.createElement("p");
    finalMsg.className = percent >= 85 ? "pass" : "fail";
    finalMsg.innerHTML = percent >= 85
      ? `🎉 Congratulations, ${currentUserName}! You passed with <b>${percent}%</b> ✨`
      : `😢 ${currentUserName}, not this time... You scored <b>${percent}%</b>. You need at least 85% to pass.`;
    resultSummary.appendChild(finalMsg);
  }

  setupResultButtons();
}

// -----------------------------
// 12) Navegação (Results/Home/Next/End)
// -----------------------------
function endTest() {
  clearTimer();
  currentCocktailIndex = cocktailDB.length; // força fim
  showResults();
}

function handleNext() {
  clearTimer();
  evaluateCurrentQuestion();
  currentCocktailIndex++;
  if (currentCocktailIndex < cocktailDB.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function setupResultButtons() {
  clearButtons();
  const container = document.createElement("div");
  container.className = "result-buttons";

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "🔙 Back to Home";
  homeBtn.onclick = () => { scrollTop(); backToHome(); };

  const retryBtn = document.createElement("button");
  retryBtn.textContent = "🔁 Try Again";
  retryBtn.onclick = () => { resetQuiz(); renderQuestion(); };

  container.append(homeBtn, retryBtn);
  resultSummary.appendChild(container);
}

function backToHome() {
  scrollTop();
  clearTimer();
  document.getElementById("quiz-section").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  resultSummary.innerHTML = "";
  clearButtons();
  resetQuiz();
  isFullExam = false;
  breakUsed = false;
  isOnBreak = false;
}

// -----------------------------
// 13) Boot
// -----------------------------
window.addEventListener("DOMContentLoaded", async () => {
  await loadCocktails();
  console.log("🔥 Cocktails ready for quiz!");
});
