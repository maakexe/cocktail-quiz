// -----------------------------
// script.js — Cocktail Quiz (refatorado com botões corrigidos)
// -----------------------------

// === Banco de dados local (você preenche com seus coquetéis) ===
// Cocktails grouped by pages
// Cocktails grouped by pages
const cocktailDBPages = {
  1: [
    {
      page: 1,
      name: "Old Fashioned",
      ingredients: [
        { ingredient: "Buffalo Trace", quantity: "8 Counts" },
        { ingredient: "Demerara Sugar", quantity: "2 Barspns" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "2 Dashes" },
        { ingredient: "Orange Zest", quantity: "1 Unit" }
      ],
      glass: "Sexy Rocks",
      method: "Stir & Strain",
      garnish: "Orange Zest",
      ice: "Cubed"
    },
    {
      page: 1,
      name: "Daiquiri",
      ingredients: [
        { ingredient: "Bacardi Carta Blanca", quantity: "8 Counts" },
        { ingredient: "BSC Simple 1:1", quantity: "3 Counts" },
        { ingredient: "Lime Juice", quantity: "3 Counts" }
      ],
      glass: "Coupe",
      method: "Shake & Fine Strain",
      garnish: "None",
      ice: "None"
    },
    {
      page: 1,
      name: "Whiskey Sour",
      ingredients: [
        { ingredient: "Buffalo Trace", quantity: "6 Counts" },
        { ingredient: "Lemon Mix", quantity: "3 Counts" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Dash" },
        { ingredient: "Oggs", quantity: "15 ml Jig" }
      ],
      glass: "Sexy Rocks",
      method: "Shake and Strain",
      garnish: "Lemon Sq",
      ice: "Crushed"
    },
    {
      page: 1,
      name: "Woo Woo",
      ingredients: [
       { ingredient: "Ketel One", quantity: "3 Counts" },
       { ingredient: "Briottet Crème De Peche", quantity: "3 Counts" },
       { ingredient: "Cranberry Juice Eager", quantity: "6 Counts" }
      ],
      glass: "Highball",
      method: "Build",
      garnish: "Lime Sq",
      ice: "Cubed"
    },
    {
      page: 1,
       name: "Vodka Martini",
       ingredients: [
       { ingredient: "Dutch Barn Vodka", quantity: "8 Counts" },
       { ingredient: "Carpano Dry Vermouth", quantity: "1 Count" }
      ],
      glass: "Nick and Nora",
      method: "Stir & Strain",
      garnish: "Lemon/Lime/Grapefruit Zest or Olive",
      ice: "None"
    },
    {
      page: 1,
       name: "White Russian",
       ingredients: [
       { ingredient: "Whole Milk", quantity: "25 ml Jig" },
       { ingredient: "Whipping Cream", quantity: "25 ml Jig" },
       { ingredient: "Ketel One", quantity: "4 Counts" },
       { ingredient: "Mr Blacks Coffee", quantity: "4 Counts" }
      ],
      glass: "Rocks",
      method: "Build & Quick Stir",
      garnish: "None",
      ice: "Cubed"
    }

  ],
  2: [
    {
      page: 2,
      name: "Sex on the Beach",
      ingredients: [
        { ingredient: "Pineapple Juice", quantity: "3 Counts" },
        { ingredient: "Cranberry Juice", quantity: "3 Counts" },
        { ingredient: "Lemon Mix", quantity: "3 Counts" },
        { ingredient: "MK Dark Berries", quantity: "2 Counts" },
        { ingredient: "Briottet Peche", quantity: "2 Counts" },
        { ingredient: "Ketel One", quantity: "2 Counts" }
      ],
      glass: "Highball",
      method: "Hard Shake and Strain",
      garnish: "Orange Sq & Cherry",
      ice: "Cubed"
    },
    {
      page: 2,
      name: "Southside",
      ingredients: [
        { ingredient: "Millers Gin", quantity: "8 Counts" },
        { ingredient: "Mint Leaves", quantity: "8 Leaves" },
        { ingredient: "Lime Juice", quantity: "3 Counts" },
        { ingredient: "BSC Simple 1:1", quantity: "2 Counts" }
      ],
      glass: "Nick and Nora",
      method: "Shake & Double Strain",
      garnish: "Small Mint Sprig",
      ice: "None"
    },
    {
      page: 2,
      name: "Dark'n'Stormy",
      ingredients: [
        { ingredient: "Goslings Black Seal Rum", quantity: "6 Counts" },
        { ingredient: "Lime Juice", quantity: "3 Counts" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Dash" },
        { ingredient: "Artisan Ginger Beer", quantity: "1/2 Can" }
      ],
      glass: "Tall Highball",
      method: "Build",
      garnish: "Lime Wheel",
      ice: "Cubed"
    },
    {
      page: 2,
      name: "Moscow Mule",
      ingredients: [
        { ingredient: "Ketel One", quantity: "6 Counts" },
        { ingredient: "Lime Juice", quantity: "3 Counts" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Dash" },
        { ingredient: "Artisan Ginger Beer", quantity: "1/2 Can" }
      ],
      glass: "Tall Highball",
      method: "Build",
      garnish: "Lime Wheel",
      ice: "Cubed"
    },
    {
      page: 2,
      name: "Caipirinha",
      ingredients: [
        { ingredient: "Sagatiba Pura", quantity: "8 Counts" },
        { ingredient: "Lime Sq", quantity: "6 Units" },
        { ingredient: "Caster Sugar", quantity: "2 Barspns" }
      ],
      glass: "Rocks",
      method: "Muddle Shake & Pour",
      garnish: "None",
      ice: "Cubed"
    },
    {
      page: 2,
      name: "Bees Knees",
      ingredients: [
        { ingredient: "Millers Gin", quantity: "8 Counts" },
        { ingredient: "Lemon Mix", quantity: "2 Counts" },
        { ingredient: "Lemon Sq", quantity: "2 Units" },
        { ingredient: "Honey", quantity: "15 ml Jig" }
      ],
      glass: "Nick and Nora",
      method: "Shake and Double Strain",
      garnish: "Lemon Zest",
      ice: "None"
    },
   
],
3: [
  {
    page: 3,
      name: "French Martini",
      ingredients: [
        { ingredient: "Pineapple Juice", quantity: "4 Counts" },
        { ingredient: "Dutch Barn Vodka", quantity: "5 Counts" },
        { ingredient: "MK Dark Berries", quantity: "2 Counts" }
      ],
      glass: "Coupe",
      method: "Hard Shake & Double Strain",
      garnish: "Diced Freeze dried Raspberries",
      ice: "None"
    },
    {
      page: 3,
      name: "Mai Tai",
      ingredients: [
        { ingredient: "BSC Disco Grenadine",quantity: "1 Count" },
        { ingredient: "BSC Orgeat", quantity: "3 Counts" },
        { ingredient: "Lime Juice", quantity: "3 Counts" },
	      { ingredient: "Appleton Estate 8 Year", quantity: "5 Counts" },
        { ingredient: "Grand Marnier", quantity: "2 Counts" }
      ],
      glass: "Rocks",
      method: "Shake and Strain",
      garnish: "Mint Sprig, Lime Sq, Cherry",
      ice: "Crushed"
    },
    {
      page: 3,
      name: "Martinez",
      ingredients: [
        { ingredient: "Bitter Truth Orange Bitters", quantity: "1 Dash" },
        { ingredient: "Millers Gin", quantity: "6 Counts" },
        { ingredient: "Martini Rubino Vermouth", quantity: "2 Counts" },
	      { ingredient: "Briottet Marasquin", quantity: "1 Count" }

      ],
      glass: "Nick and Nora",
      method: "Stir & Strain",
      garnish: "Orange Zest & Cherry",
      ice: "None"
    },
    {
      page: 3,
      name: "Sazerac",
      ingredients: [
        { ingredient: "La Fee Absinthe", quantity: "1 Count" },
        { ingredient: "BSC Simple 1:1", quantity: "1 Count" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Dash" },
        { ingredient: "Peychaud Bitters", quantity: "3 Dashes" },
        { ingredient: "Woodford Rye", quantity: "3 Counts" },
        { ingredient: "Courvoisier VS", quantity: "3 Counts" }
      ],
      glass: "Nick and Nora",
      method: "Rinse / Stir & Strain",
      garnish: "Lemon zest",
      ice: "None"
    },
    {
      page: 3,
      name: "Aviation",
      ingredients: [
        { ingredient: "Lemon Sq", quantity: "2 Units" },
        { ingredient: "Lemon Mix", quantity: "3 Counts" },
        { ingredient: "Millers Gin", quantity: "6 Counts" },
        { ingredient: "Briottet Violette", quantity: "1 Count" },
        { ingredient: "Briottet Marasquin", quantity: "1 Count" },
        { ingredient: "Lemon Zest Discard", quantity: "1 Unit" }
      ],
      glass: "Coupe",
      method: "Shake & Double Strain",
      garnish: "Luxardo Cherries",
      ice: "None"
    },
    {
      page: 3,
      name: "Manhattan ( Perfect )",
      ingredients: [
        { ingredient: "Buffalo Trace", quantity: "8 Units" },
        { ingredient: "Carpano Dry Vermouth", quantity: "1 Count" },
        { ingredient: "Martini Rubino Vermouth", quantity: "1 Count" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Count" }
      ],
      glass: "Nick and Nora",
      method: "Stir & Strain",
      garnish: "Orange Zest & Cherry",
      ice: "None"
    }
],
4: [
  {
    page: 4,
      name: "Boulevardier",
      ingredients: [
        { ingredient: "Buffalo Trace", quantity: "4 Counts" },
        { ingredient: "Martini Rubino Vermouth", quantity: "4 Counts" },
        { ingredient: "Campari", quantity: "4 Counts" }
      ],
      glass: "Sexy Rocks",
      method: "Stir & Strain",
      garnish: "Orange Zest",
      ice: "Cubed"
    },
    {
      page: 4,
      name: "Sidecar",
      ingredients: [
        { ingredient: "Lemon Mix", quantity: "3 Counts" },
        { ingredient: "Courvoisier VS", quantity: "3 Counts" },
        { ingredient: "Cointreau", quantity: "3 Counts" }
      ],
      glass: "Nick and Nora",
      method: "Shake & Double Strain",
      garnish: "Lemon Zest & Sugar Rim",
      ice: "None"
    },
    {
      page: 4,
      name: "White Lady",
      ingredients: [
        { ingredient: "Lemon Sq", quantity: "3 Units" },
        { ingredient: "Lemon Mix", quantity: "2 Counts" },
        { ingredient: "Oggs", quantity: "15 ml Jig" },
        { ingredient: "Tanqueray", quantity: "4 Counts" },
        { ingredient: "Cointreau", quantity: "2 Counts" }
      ],
      glass: "Coupe",
      method: "Blend 3 cubes & Fine Strain",
      garnish: "Lemon Zest",
      ice: "None"
    },
    {
      page: 4,
      name: "Hemingway Daiquiri",
      ingredients: [
        { ingredient: "Grapefruit Juice", quantity: "2 Counts" },
        { ingredient: "Lime Juice", quantity: "3 Counts" },
        { ingredient: "BSC Simple 1:1", quantity: "2 Counts" },
        { ingredient: "Bacardi Carta Blanca", quantity: "7 Counts" },
        { ingredient: "Briottet Marasquin", quantity: "2 Counts" }
      ],
      glass: "Coupe",
      method: "Shake & Double Strain",
      garnish: "Grapefruit Zest",
      ice: "None"
    },
    {
      page: 4,
      name: "Brandy Alexander",
      ingredients: [
        { ingredient: "Whipping Cream", quantity: "25 ml Jig" },
        { ingredient: "Courvoisier VS", quantity: "4 Counts" },
        { ingredient: "Briottet Crème De Cacao Brown", quantity: "4 Counts" }
      ],
      glass: "Nick and Nora",
      method: "Shake & Double Strain",
      garnish: "Cinnamon and Nutmeg Dust",
      ice: "None"
    },
    {
      page: 4,
      name: "Charlie Chaplin",
      ingredients: [
        { ingredient: "La Fee Absinthe", quantity: "1 Count" },
        { ingredient: "BSC Simple 1:1", quantity: "1 Count" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Dash" },
        { ingredient: "Peychaud Bitters", quantity: "3 Dashes" },
        { ingredient: "Woodford Rye", quantity: "3 Counts" },
        { ingredient: "Courvoisier VS", quantity: "3 Counts" }
      ],
      glass: "Coupe",
      method: "Shake & Double Strain",
      garnish: "Lime Zest",
      ice: "None"
    }
],
5: [
  {
    page: 5,
      name: "Penicillin",
      ingredients: [
        { ingredient: "Laphroaig", quantity: "3 Counts" },
        { ingredient: "Johnnie Walker Black", quantity: "3 Counts" },
        { ingredient: "Kaveri Ginger", quantity: "1 Count" },
        { ingredient: "Lemon Mix", quantity: "3 Counts" },
        { ingredient: "Honey", quantity: "1 Barspn" }
      ],
      glass: "Sexy Rocks",
      method: "Shake and Strain",
      garnish: "Lemon Zest",
      ice: "Cubed"
    },
    {
      page: 5,
      name: "Godfather",
      ingredients: [
        { ingredient: "Johnnie Walker Black", quantity: "4 Counts" },
        { ingredient: "Luxardo Amaretto", quantity: "4 Counts" }
      ],
      glass: "Sexy Rocks",
      method: "Build Over Ice Ball",
      garnish: "Flamed Orange Zest",
      ice: "Iceball"
    },
    {
      page: 5,
      name: "Tom Collins",
      ingredients: [
        { ingredient: "Lemon Zest", quantity: "3 Units" },
        { ingredient: "Herno Old Tom Gin", quantity: "8 Counts" },
        { ingredient: "Soda", quantity: "Top Pm" }
      ],
      glass: "Highball",
      method: "Build and Churn",
      garnish: "Lemon Sq",
      ice: "Cubed"
    },
    {
      page: 5,
      name: "Singapore Sling",
      ingredients: [
        { ingredient: "Tanqueray", quantity: "4 Counts" },
        { ingredient: "Briottet Marasquin", quantity: "2 Counts" },
        { ingredient: "Lemon Mix", quantity: "2 Counts" },
        { ingredient: "Pineapple Juice", quantity: "3 Counts" },
        { ingredient: "Benedictine", quantity: "1 Count" },
        { ingredient: "Bitter Truth Jerry Thomas Bitters", quantity: "1 Dash" },
        { ingredient: "Soda Pm", quantity: "Top" },
        { ingredient: "BSC Disco Grenadine", quantity: "1 Count" }
      ],
      glass: "Tall Highball",
      method: "Shake, Strain & Top",
      garnish: "Lemon Sq & Cherry",
      ice: "Cubed"
    },
    {
      page: 5,
      name: "Vesper Martini",
      ingredients: [
        { ingredient: "Lillet Blanc", quantity: "1 Count" },
        { ingredient: "Dutch Barn Vodka", quantity: "2 Counts" },
        { ingredient: "Millers Gin", quantity: "6 Counts" }
      ],
      glass: "Nick and Nora",
      method: "Shake and Double Strain",
      garnish: "Lemon zest",
      ice: "None"
    },
    {
      page: 5,
      name: "June Bug",
      ingredients: [
        { ingredient: "Pineapple Juice", quantity: "4 Counts" },
        { ingredient: "Lemon Mix", quantity: "3 Counts" },
        { ingredient: "Bacardi Coconut", quantity: "3 Counts" },
        { ingredient: "Midori", quantity: "2 Counts" },
        { ingredient: "Giffard Banane du Brésil", quantity: "2 Counts" }
      ],
      glass: "Tall Highball",
      method: "Shake and Strain",
      garnish: "Banana Leaf",
      ice: "Cubed"
    }
],
};

// === Distratores extras ===
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
  "Herno Old Tom Gin","Soda Pm","Benedictine","Lillet Blanc","Bacardi Coconut","Midori","Giffard Banane du Brésil"
];

const extraQuantities = [
  "1 Count","2 Counts","3 Counts","4 Counts","5 Counts","6 Counts","8 Counts","12 Counts",
  "15 ml Jig","25 ml Jig","50 ml Jig","1 Barspn","2 Barspns","1 Dash","2 Dashes","3 Dashes",
  "1 Unit","2 Units","3 Units","8 Leaves","1/2 Can","6 Units","Top"
];

const extraGlassware = [
 "Sexy Rocks","Coupe","Highball","Nick and Nora","Rocks","Tall Highball"
];

const extraGarnishes = [
  "Orange Zest","Lime Sq","Lemon/Lime/Grapefruit Zest or Olive","None","Orange Sq & Cherry","Small Mint Sprig","Lemon Zest","Lime Wheel","Mint Sprig, Lime Sq, Cherry",
  "Orange Zest & Cherry", "Lemon Zest & Sugar Rim","Grapefruit Zest","Cinnamon and Nutmeg Dust","Luxardo Cherries","Flamed Orange Zest","Lemon Sq & Cherry","Banana Leaf"
];

const extraMethods = ["Stir & Strain","Shake & Fine Strain","Shake and Strain","Build","Build & Quick Stir","Hard Shake and Strain",
  "Shake & Double Strain","Muddle Shake & Pour","Blend 3 cubes & Fine Strain","Rinse / Stir & Strain","Build Over Ice Ball","Build and Churn",
  "Shake, Strain & Top"];

const extraIce = ["Crushed","Cubed","Iceball","None","7 Cubes","Dry Ice"]

// === Variáveis globais ===
let cocktailDB = [];
let currentUserName = "";
let currentCocktailIndex = 0;
let results = [];
let totalQuestions = 0;
let totalCorrect = 0;
let isFullExam = false;
const QUESTION_TIME = 120;
let timerRef = null;

// === Referências DOM ===
const quizContainer = document.getElementById("quiz-container");
const resultSummary = document.getElementById("result-summary");
const timerDiv = document.getElementById("timer");

// === Utilidades ===
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

// === Eventos da tela inicial ===
document.querySelectorAll(".page-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    isFullExam = false;
    currentUserName = document.getElementById("username").value.trim() || "Guest";
    const selectedPage = btn.dataset.page;
    cocktailDB = cocktailDBPages[selectedPage] || [];
    startQuiz();
  });
});
document.getElementById("full-test-btn").addEventListener("click", () => {
  isFullExam = true;
  currentUserName = document.getElementById("username").value.trim() || "Guest";
  cocktailDB = Object.values(cocktailDBPages).flat();
  startQuiz();
});

// === Inicializa quiz ===
function startQuiz() {
  resetQuiz();
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  renderQuestion();
}

// === Helpers ===
function getAllIngredients(cocktail) {
  if (isFullExam) {
    const list = cocktailDB.flatMap(c => c.ingredients.map(i => i.ingredient));
    return Array.from(new Set(list.concat(extraIngredients))).sort();
  } else {
    const pageCocktails = cocktailDBPages[cocktail.page] || [];
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
      .filter(v => v && v.length > 0);
    const duplicates = selected.filter((v, i, arr) => arr.indexOf(v) !== i);
    if (duplicates.length > 0) {
      alert(`⚠️ You already selected "${selectEl.value}". Choose a different ingredient.`);
      selectEl.value = "";
    }
  });
}
function createRadio(labelText, nameKey, correctAnswer, options) {
  const div = document.createElement("div");
  div.className = "question-block";
  const h3 = document.createElement("h3");
  h3.textContent = labelText;
  div.appendChild(h3);

  options.slice().sort(() => Math.random() - 0.5).forEach(opt => {
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

// === Renderiza questão ===
function renderQuestion() {
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

  createRadio("Which glass is used?", "q-glass", cocktail.glass, uniqueOptions(cocktail.glass, extraGlassware));
  createRadio("What's the method?", "q-method", cocktail.method, uniqueOptions(cocktail.method, extraMethods));
  createRadio("Which garnish is used?", "q-garnish", cocktail.garnish, uniqueOptions(cocktail.garnish, extraGarnishes));
  createRadio("Which ice is used?", "q-ice", cocktail.ice, uniqueOptions(cocktail.ice, extraIce));

  setupActionButtonsDuringTest();
  startTimer();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// === Botões durante o teste ===
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

// === Timer ===
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

// === End Test ===
function endTest() {
  clearInterval(timerRef);
  currentCocktailIndex = cocktailDB.length; // força fim
  showResults();
}

// === Handle Next ===
function handleNext() {
  clearInterval(timerRef);

  // avalia pergunta atual
  evaluateCurrentQuestion();

  currentCocktailIndex++;
  if (currentCocktailIndex < cocktailDB.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

// === Avaliar questão ===
function evaluateCurrentQuestion() {
  const cocktail = cocktailDB[currentCocktailIndex];
  let cocktailResults = [];
  let correctCount = 0;

  // Coleta entradas do usuário
  const ingredientSelects = document.querySelectorAll(".ingredient");
  const quantitySelects = document.querySelectorAll(".quantity");

  const userPairs = Array.from(ingredientSelects).map((sel, idx) => ({
    ingredient: sel.value,
    quantity: quantitySelects[idx].value
  }));

  // Copiamos os corretos para ir removendo conforme casamos
  let remainingCorrect = [...cocktail.ingredients];

   // Listas auxiliares para as 3 passagens
  const pending = [];            // pares que não casaram exato
  const wrongQtyPairs = [];      // ingrediente certo, quantidade errada
  const wrongOrBlankPairs = [];  // ingrediente errado OU em branco

  // ---- PASSO 1: match exato (ingrediente + quantidade), ignorando ordem
  userPairs.forEach(up => {
    if (!up.ingredient || !up.quantity) {
      // guarda para tratar depois
      wrongOrBlankPairs.push(up);
      return;
    }
    const matchIdx = remainingCorrect.findIndex(
      ci => ci.ingredient === up.ingredient && ci.quantity === up.quantity
    );
    if (matchIdx !== -1) {
      correctCount++;
      totalCorrect++;
      remainingCorrect.splice(matchIdx, 1); // “consome” este correto
      cocktailResults.push({ correct: true, type: "ingredient" });
    } else {
      pending.push(up);
    }
  });

  // ---- PASSO 2: ingrediente certo mas quantidade errada
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
      // também “consome” para não reutilizar depois
      remainingCorrect.splice(sameIngIdx, 1);
    } else {
      wrongOrBlankPairs.push(up);
    }
  });

  // ---- PASSO 3: ingrediente errado OU em branco
  // mapeia um “correto que faltou” para cada entrada errada/blank
  wrongOrBlankPairs.forEach(up => {
    const right = remainingCorrect.shift(); // pega o próximo que faltou
    cocktailResults.push({
      correct: false,
      type: "ingredient",
      user: `${up.ingredient || "none"} - ${up.quantity || "none"}`,
      correctAnswer: right ? `${right.ingredient} - ${right.quantity}` : "N/A"
    });
  });

  // Radios (vidro, método, garnish, gelo)
  const radioSpec = [
    { key: "q-glass", type: "glass", correct: cocktail.glass },
    { key: "q-method", type: "method", correct: cocktail.method },
    { key: "q-garnish", type: "garnish", correct: cocktail.garnish },
    { key: "q-ice", type: "ice", correct: cocktail.ice }
  ];

  radioSpec.forEach(({key, type, correct}) => {
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

// === Mostrar resultados ===
function showResults() {
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

// === Botões na tela de resultados ===
function setupResultButtons() {
  clearButtons();
  const container = document.createElement("div");
  container.className = "result-buttons";

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "🔙 Back to Home";
  homeBtn.onclick = backToHome;

  const retryBtn = document.createElement("button");
  retryBtn.textContent = "🔁 Try Again";
  retryBtn.onclick = () => {
    resetQuiz();
    renderQuestion();
  };

  const nextPageBtn = document.createElement("button");
  nextPageBtn.textContent = "⏭️ Next Page";
  nextPageBtn.onclick = goToNextPage;

  container.append(homeBtn, retryBtn);
  if (!isFullExam) container.append(nextPageBtn);

  resultSummary.appendChild(container);
}

// === Funções auxiliares ===
function backToHome() {
  document.getElementById("quiz-section").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  resultSummary.innerHTML = "";
  clearButtons();
  resetQuiz();
}
function goToNextPage() {
  const nextPage = (cocktailDB[0]?.page || 1) + 1;
  if (cocktailDBPages[nextPage]) {
    cocktailDB = cocktailDBPages[nextPage];
    resetQuiz();
    renderQuestion();
  } else {
    alert("No more pages available!");
  }
}
