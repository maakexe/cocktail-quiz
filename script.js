// -----------------------------
// script.js — Cocktail Quiz (Firestore integration)
// -----------------------------

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =============================
// 🔹 Variáveis globais
// =============================
let cocktailDBPages = {};   // Dados organizados por categoria e página
let cocktailDB = [];        // Coquetéis do teste em andamento
let currentUserName = "";
let currentCocktailIndex = 0;
let results = [];
let totalQuestions = 0;
let totalCorrect = 0;
let isFullExam = false;
const QUESTION_TIME = 120;
let timerRef = null;

// =============================
// 🔹 Referências DOM
// =============================
const quizContainer = document.getElementById("quiz-container");
const resultSummary = document.getElementById("result-summary");
const timerDiv = document.getElementById("timer");

// =============================
// 🔹 Carregar coquetéis do Firestore
// =============================
async function loadCocktails() {
  const querySnapshot = await getDocs(collection(window.db, "cocktails"));
  let cocktails = {};

  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (!cocktails[data.category]) cocktails[data.category] = {};
    if (!cocktails[data.category][data.page]) cocktails[data.category][data.page] = [];
    cocktails[data.category][data.page].push(data);
  });

  cocktailDBPages = cocktails;
  console.log("✅ Cocktails carregados do Firestore:", cocktailDBPages);
}

// =============================
// 🔹 Inicialização de Eventos
// =============================
function initEvents() {
  // Expande/recolhe categorias
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      const container = document.getElementById(`${category}-pages`);
      container.style.display = container.style.display === "none" ? "block" : "none";
    });
  });

  // Seleção de página
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

  // Exame completo (Full Exam)
  document.querySelectorAll(".full-test-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      isFullExam = true;
      currentUserName = document.getElementById("username").value.trim() || "Guest";
      const selectedCategory = btn.dataset.category;
      cocktailDB = Object.values(cocktailDBPages[selectedCategory] || {}).flat();
      startQuiz();
    });
  });
}

// =============================
// 🔹 Utilidades
// =============================
function uniqueOptions(correct, extras) {
  return Array.from(new Set([correct, ...extras]));
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

// =============================
// 🔹 Iniciar Quiz
// =============================
function startQuiz() {
  resetQuiz();
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  renderQuestion();
}

// =============================
// 🔹 Criar Perguntas
// =============================
function createDropdown(options, placeholder) {
  const sel = document.createElement("select");
  sel.className = "centered-select"; // 👉 centralizado no CSS
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

function createRadio(labelText, nameKey, correctAnswer, options) {
  const div = document.createElement("div");
  div.className = "question-block";

  const h3 = document.createElement("h3");
  h3.textContent = labelText;
  h3.className = "centered-label"; // 👉 centralizado no CSS
  div.appendChild(h3);

  // 🔹 Garante 6 opções (1 correta + 5 aleatórias)
  let shuffled = options.filter(opt => opt !== correctAnswer);
  shuffled = shuffled.sort(() => Math.random() - 0.5).slice(0, 5);
  shuffled.push(correctAnswer);
  shuffled = shuffled.sort(() => Math.random() - 0.5);

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

// =============================
// 🔹 Renderizar Questão
// =============================
function renderQuestion() {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
  title.className = "centered-label"; // 👉 centralizado
  quizContainer.appendChild(title);

  // Ingredients
  const allIngredients = cocktailDB.flatMap(c => c.ingredients.map(i => i.ingredient));
  const allQuantities = ["1 Count", "2 Counts", "3 Counts", "4 Counts", "5 Counts"]; // simplificado

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

  // Outras perguntas
  createRadio("Which glass is used?", "q-glass", cocktail.glass, uniqueOptions(cocktail.glass, ["Sexy Rocks", "Coupe", "Highball", "Nick and Nora"]));
  createRadio("What's the method?", "q-method", cocktail.method, uniqueOptions(cocktail.method, ["Shake", "Build", "Stir", "Blend"]));
  createRadio("Which garnish is used?", "q-garnish", cocktail.garnish, uniqueOptions(cocktail.garnish, ["Orange Zest", "Lime Sq", "Cherry", "None"]));
  createRadio("Which ice is used?", "q-ice", cocktail.ice, uniqueOptions(cocktail.ice, ["Cubed", "Crushed", "Iceball", "None"]));

  setupActionButtonsDuringTest();
}

// =============================
// 🔹 Botões durante o teste
// =============================
function setupActionButtonsDuringTest() {
  clearButtons();
  const container = document.createElement("div");
  container.className = "action-buttons";

  ["🚪 End Test", "⏭️ Next", "🔙 Back to Home"].forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.className = "uniform-btn"; // 👉 mesmo tamanho no CSS
    if (i === 0) btn.onclick = endTest;
    if (i === 1) btn.onclick = handleNext;
    if (i === 2) btn.onclick = backToHome;
    container.appendChild(btn);
  });

  document.getElementById("quiz-section").appendChild(container);
}

// =============================
// 🔹 Carregar dados ao iniciar
// =============================
window.addEventListener("DOMContentLoaded", async () => {
  await loadCocktails();
  initEvents();
  console.log("🔥 Cocktails prontos para usar no quiz!");
});
