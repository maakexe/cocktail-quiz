// -----------------------------
// script.js — Cocktail Quiz (Firestore integration)
// -----------------------------

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// === 🔹 Banco de dados em memória ===
let cocktailDBPages = {};   // { category: { page: [cocktails...] } }
let cocktailDB = [];        // cocktails do teste atual

// === 🔹 Variáveis globais ===
let currentUserName = "";
let currentCocktailIndex = 0;
let results = [];
let totalQuestions = 0;
let totalCorrect = 0;
let isFullExam = false;
const QUESTION_TIME = 120;
let timerRef = null;

// === 🔹 Referências DOM ===
const quizContainer = document.getElementById("quiz-container");
const resultSummary = document.getElementById("result-summary");
const timerDiv = document.getElementById("timer");

// -----------------------------
// 1. Carregar dados do Firestore
// -----------------------------
async function loadCocktails() {
  const querySnapshot = await getDocs(collection(window.db, "cocktails"));
  let cocktails = {};

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const category = data.category || "classics"; // fallback
    const page = data.page;

    if (!cocktails[category]) cocktails[category] = {};
    if (!cocktails[category][page]) cocktails[category][page] = [];
    cocktails[category][page].push(data);
  });

  cocktailDBPages = cocktails;
  console.log("✅ Cocktails carregados do Firestore:", cocktailDBPages);
}

// -----------------------------
// 2. Distratores (opções erradas)
// -----------------------------
const extraIngredients = [
  "BSC Simple 1:1","Buffalo Trace","Bitter Truth Jerry Thomas Bitters","Lime Juice",
  "Cranberry Juice Eager","Lemon Mix","Ketel One","Dutch Barn Vodka",
  "Briottet Crème De Peche","Mr Blacks Coffee","Bacardi Carta Blanca","Millers Gin",
  "Carpano Dry Vermouth","Whole Milk","Whipping Cream","Oggs",
  "Demerara Sugar","Orange Zest","Pineapple Juice","MK Dark Berries",
  "Goslings Black Seal Rum","Mint Leaves","Artisan Ginger Beer","Caster Sugar","Lime Sq",
  "Sagatiba Pura","Honey","BSC Disco Grenadine","BSC Orgeat","Appleton Estate 8 Year",
  "Martini Rubino Vermouth","Briottet Marasquin","Campari","Courvoisier VS","Cointreau",
  "Tanqueray","Briottet Crème De Cacao Brown","La Fee Absinthe","Peychaud Bitters",
  "Woodford Rye","Briottet Violette","Laphroaig","Johnnie Walker Black","Kaveri Ginger",
  "Luxardo Amaretto","Lemon Zest","Herno Old Tom Gin","Soda Pm","Benedictine",
  "Lillet Blanc","Bacardi Coconut","Midori","Giffard Banane du Brésil"
];

const extraQuantities = [
  "1 Count","2 Counts","3 Counts","4 Counts","5 Counts","6 Counts","8 Counts","12 Counts",
  "15 ml Jig","25 ml Jig","50 ml Jig","1 Barspn","2 Barspns","1 Dash","2 Dashes","3 Dashes",
  "1 Unit","2 Units","3 Units","8 Leaves","1/2 Can","Top"
];

const extraGlassware = ["Sexy Rocks","Coupe","Highball","Nick and Nora","Rocks","Tall Highball"];
const extraGarnishes = ["Orange Zest","Lime Sq","Olive","None","Orange Sq & Cherry","Small Mint Sprig",
  "Lemon Zest","Lime Wheel","Mint Sprig, Lime Sq, Cherry","Orange Zest & Cherry",
  "Sugar Rim","Grapefruit Zest","Cinnamon Dust","Luxardo Cherries","Flamed Orange Zest",
  "Banana Leaf"];
const extraMethods = ["Stir & Strain","Shake & Fine Strain","Shake and Strain","Build","Build & Quick Stir",
  "Shake & Double Strain","Muddle Shake & Pour","Blend","Rinse / Stir & Strain","Build Over Ice Ball",
  "Build and Churn","Shake, Strain & Top"];
const extraIce = ["Crushed","Cubed","Iceball","None","7 Cubes","Dry Ice"];

// -----------------------------
// 3. Utils helpers
// -----------------------------
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function resetQuiz() {
  currentCocktailIndex = 0;
  results = [];
  totalQuestions = 0;
  totalCorrect = 0;
}

function clearButtons() {
  document.querySelectorAll(".action-buttons, .result-buttons").forEach(el => el.remove());
}

// 🔹 Sempre rola para o topo ao trocar de tela/questão
function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// -----------------------------
// 4. Eventos da tela inicial
// -----------------------------
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    const container = document.getElementById(`${category}-pages`);
    container.style.display = container.style.display === "none" ? "block" : "none";
  });
});

document.querySelectorAll(".page-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    isFullExam = false;
    currentUserName = document.getElementById("username").value.trim() || "Guest";
    const selectedCategory = btn.dataset.category;
    const selectedPage = btn.dataset.page;
    cocktailDB = cocktailDBPages[selectedCategory]?.[selectedPage] || [];
    startQuiz();
  });
});

document.querySelectorAll(".full-test-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    isFullExam = true;
    currentUserName = document.getElementById("username").value.trim() || "Guest";
    const selectedCategory = btn.dataset.category;
    cocktailDB = Object.values(cocktailDBPages[selectedCategory] || {}).flat();
    startQuiz();
  });
});

// -----------------------------
// 5. Inicializar quiz
// -----------------------------
function startQuiz() {
  resetQuiz();
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  scrollTop();
  renderQuestion();
}

// -----------------------------
// 6. Renderizar questão
// -----------------------------
function renderQuestion() {
  quizContainer.innerHTML = "";
  resultSummary.innerHTML = "";
  scrollTop();

  const cocktail = cocktailDB[currentCocktailIndex];

  const testInfo = document.createElement("p");
  testInfo.className = "test-info";
  testInfo.textContent = isFullExam ? "🏆 Final Exam" : `📘 Studying — Page ${cocktail.page}`;
  quizContainer.appendChild(testInfo);

  const title = document.createElement("h2");
  title.innerHTML = `What's the spec for : <span class="cocktail-name">${cocktail.name}</span>`;
  quizContainer.appendChild(title);

  // Ingredientes
  const allIngredients = Array.from(new Set(cocktailDB.flatMap(c => c.ingredients.map(i => i.ingredient)).concat(extraIngredients))).sort();
  const allQuantities = Array.from(new Set(extraQuantities)).sort();

  cocktail.ingredients.forEach(() => {
    const row = document.createElement("div");
    row.className = "ingredient-row";

    const ingSel = createDropdown(allIngredients, "Choose ingredient");
    ingSel.classList.add("ingredient");

    const qtySel = createDropdown(allQuantities, "Choose quantity");
    qtySel.classList.add("quantity");

    row.appendChild(ingSel);
    row.appendChild(qtySel);
    quizContainer.appendChild(row);
  });

  // Radios (7 opções: 1 correta + 6 erradas embaralhadas)
  createRadio("Which glass is used?", "q-glass", cocktail.glass, extraGlassware);
  createRadio("What's the method?", "q-method", cocktail.method, extraMethods);
  createRadio("Which garnish is used?", "q-garnish", cocktail.garnish, extraGarnishes);
  createRadio("Which ice is used?", "q-ice", cocktail.ice, extraIce);

  setupActionButtonsDuringTest();
  startTimer();
}

// Cria dropdown
function createDropdown(options, placeholder) {
  const sel = document.createElement("select");
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
  return sel;
}

// Cria radios (7 opções fixas)
function createRadio(labelText, nameKey, correctAnswer, pool) {
  const div = document.createElement("div");
  div.className = "question-block";

  const h3 = document.createElement("h3");
  h3.textContent = labelText;
  div.appendChild(h3);

  let shuffled = shuffleArray(pool.filter(opt => opt !== correctAnswer)).slice(0, 6);
  shuffled.push(correctAnswer);
  shuffled = shuffleArray(shuffled);

  shuffled.forEach(opt => {
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

// -----------------------------
// 7. Timer
// -----------------------------
function startTimer() {
  clearInterval(timerRef);
  let timeLeft = QUESTION_TIME;
  timerDiv.textContent = `Time left: ${timeLeft}s`;

  timerRef = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerRef);
      alert("⏰ Time is up!");
      handleNext();
    }
  }, 1000);
}

// -----------------------------
// 8. Botões durante o teste
// -----------------------------
function setupActionButtonsDuringTest() {
  clearButtons();
  const container = document.createElement("div");
  container.className = "action-buttons";

  const endBtn = document.createElement("button");
  endBtn.textContent = "🚪 End Test";
  endBtn.onclick = endTest;

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "⏭️ Next";
  nextBtn.onclick = handleNext;

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "🔙 Back to Home";
  homeBtn.onclick = backToHome;

  container.append(endBtn, nextBtn, homeBtn);
  document.getElementById("quiz-section").appendChild(container);
}

// -----------------------------
// 9. Navegação / avaliação
// -----------------------------
function endTest() {
  clearInterval(timerRef);
  currentCocktailIndex = cocktailDB.length;
  scrollTop();
  showResults();
}

function handleNext() {
  clearInterval(timerRef);
  evaluateCurrentQuestion();
  currentCocktailIndex++;
  if (currentCocktailIndex < cocktailDB.length) {
    renderQuestion();
    scrollTop();
  } else {
    scrollTop();
    showResults();
  }
}

// -----------------------------
// 10. Avaliar questão
// -----------------------------
function evaluateCurrentQuestion() {
  const cocktail = cocktailDB[currentCocktailIndex];
  let cocktailResults = [];
  let correctCount = 0;

  // Ingredientes
  const ingredientSelects = document.querySelectorAll(".ingredient");
  const quantitySelects = document.querySelectorAll(".quantity");

  const userPairs = Array.from(ingredientSelects).map((sel, idx) => ({
    ingredient: sel.value,
    quantity: quantitySelects[idx].value
  }));

  let remainingCorrect = [...cocktail.ingredients];
  const pending = [];
  const wrongOrBlankPairs = [];

  // Match exato
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

  // Ingrediente certo + quantidade errada
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

  // Ingrediente errado / vazio
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
    { key: "q-glass", type: "glass", correct: cocktail.glass },
    { key: "q-method", type: "method", correct: cocktail.method },
    { key: "q-garnish", type: "garnish", correct: cocktail.garnish },
    { key: "q-ice", type: "ice", correct: cocktail.ice }
  ];

  radioSpec.forEach(({ key, type, correct }) => {
    totalQuestions++;
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    const val = selected ? selected.value : "";
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
    answers: cocktailResults,
    correct: correctCount === (cocktail.ingredients.length + 4)
  });
}

// -----------------------------
// 11. Resultados
// -----------------------------
function showResults() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  quizContainer.innerHTML = "";
  timerDiv.textContent = "";
  clearButtons();

  resultSummary.innerHTML = `<h2>📊 Results</h2>`;

  results.forEach(r => {
    const card = document.createElement("div");
    card.className = "cocktail-card";

    const title = document.createElement("h2");
    title.textContent = `${r.cocktail} — ${r.correct ? "✅ Correct!" : "❌ Wrong"}`;
    title.className = r.correct ? "correct-title" : "incorrect-title";
    card.appendChild(title);

    const categories = {
      "Ingredients": r.answers.filter(a => a.type === "ingredient" && !a.correct),
      "Method": r.answers.filter(a => a.type === "method" && !a.correct),
      "Ice": r.answers.filter(a => a.type === "ice" && !a.correct),
      "Garnish": r.answers.filter(a => a.type === "garnish" && !a.correct),
      "Glassware": r.answers.filter(a => a.type === "glass" && !a.correct)
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

    resultSummary.appendChild(card);
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
// 12. Botões da tela de resultados
// -----------------------------
function setupResultButtons() {
  clearButtons();
  const container = document.createElement("div");
  container.className = "result-buttons";

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "🔙 Back to Home";
  homeBtn.onclick = () => {
    backToHome();
    scrollTop();
  };

  const retryBtn = document.createElement("button");
  retryBtn.textContent = "🔁 Try Again";
  retryBtn.onclick = () => {
    resetQuiz();
    renderQuestion();
    scrollTop();
  };

  const nextPageBtn = document.createElement("button");
  nextPageBtn.textContent = "⏭️ Next Page";
  nextPageBtn.onclick = () => {
    goToNextPage();
    scrollTop();
  };

  container.append(homeBtn, retryBtn);
  if (!isFullExam) container.append(nextPageBtn);

  resultSummary.appendChild(container);
}

// -----------------------------
// 13. Auxiliares
// -----------------------------
function backToHome() {
  document.getElementById("quiz-section").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  resultSummary.innerHTML = "";
  clearButtons();
  resetQuiz();
  scrollTop();
}

function goToNextPage() {
  const nextPage = (cocktailDB[0]?.page || 1) + 1;
  if (cocktailDBPages.classics?.[nextPage]) {
    cocktailDB = cocktailDBPages.classics[nextPage];
    resetQuiz();
    scrollTop();
    renderQuestion();
  } else {
    alert("No more pages available!");
  }
}

// -----------------------------
// 14. Início
// -----------------------------
window.addEventListener("DOMContentLoaded", async () => {
  await loadCocktails();
  console.log("🔥 Cocktails prontos para usar no quiz!");
});
