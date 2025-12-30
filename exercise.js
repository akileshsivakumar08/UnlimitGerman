// -----------------------------
// GET CURRENT FILE FROM URL
// -----------------------------
const params = new URLSearchParams(window.location.search);
const currentFile = params.get("file");

// Global list of exercises (from index.json)
let exerciseList = [];


// -----------------------------
// LOAD INDEX.JSON FIRST
// -----------------------------
fetch("Exercises/index.json")
  .then(res => res.json())
  .then(list => {
    exerciseList = list;

    return fetch(currentFile);
  })
  .then(res => res.json())
  .then(data => {
    const title = data[0].title;

    document.getElementById("title").innerHTML = `<h2><b>${title}</b></h2>`;

    // Default view: original text
    showOriginalText(data[0]);

    // Set filter button
    document.getElementById("filter-btn").addEventListener("click", () => {
      applyMode(data);
    });

    // Back button
    document.getElementById("back-btn").addEventListener("click", () => {
      showOriginalText(data[0]);
    });

    setupNextButton();
  })
  .catch(err => {
    console.error("Failed to load exercise:", err);
    document.getElementById("quiz-container").textContent = "Failed to load exercise.";
  });


// -----------------------------
// FADE TRANSITION
// -----------------------------
function fadeSwap(callback) {
  const container = document.getElementById("quiz-container");
  container.classList.remove("show");

  setTimeout(() => {
    callback();
    container.classList.add("show");
  }, 100);
}


// -----------------------------
// GET CURRENT MODE
// -----------------------------
function getMode() {
  return document.getElementById("mode").value;
}


// -----------------------------
// APPLY MODE
// -----------------------------
function applyMode(data) {
  const mode = getMode();

  if (mode === "original") {
    showOriginalText(data[0]);
  } else {
    renderQuestions(data, mode);
  }
}


// -----------------------------
// SHOW ORIGINAL TEXT
// -----------------------------
function showOriginalText(q) {
  fadeSwap(() => {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const words = q.question.split(" ");
    let ai = 0;
    let aj = 0;

    const div = document.createElement("div");

    words.forEach(word => {
      if (word.includes("_ART")) {
        const prefix = word.split("_ART")[0];
        div.append(prefix + q.articles[ai][1] + " ");
        ai++;
      } else if (word.includes("_ADJA")) {
        const prefix = word.split("_ADJA")[0];
        div.append(prefix + q.adjectives[aj][1] + " ");
        aj++;
      } else {
        div.append(word + " ");
      }
    });

    container.appendChild(div);
  });
}


// -----------------------------
// PRACTICE MODE (MODE-AWARE)
// -----------------------------
function renderQuestions(data, mode) {
  fadeSwap(() => {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const q = data[0];
    const words = q.question.split(" ");

    let ai = 0;
    let aj = 0;

    const div = document.createElement("div");

    words.forEach(word => {

      // PRACTICE ALL → both inputs
      if (mode === "all") {
        if (word.includes("_ART")) {
          const prefix = word.split("_ART")[0];
          div.append(prefix);
          const correct = q.articles[ai][1].toLowerCase();
          const input = createInput(correct);
          div.append(input, " ");
          ai++;
          return;
        }

        if (word.includes("_ADJA")) {
          const prefix = word.split("_ADJA")[0];
          div.append(prefix);
          const correct = q.adjectives[aj][1].toLowerCase();
          const input = createInput(correct);
          div.append(input, " ");
          aj++;
          return;
        }
      }

      // CASES MODE → only article inputs
      if (mode === "cases") {
        if (word.includes("_ART")) {
          const prefix = word.split("_ART")[0];
          div.append(prefix);
          const correct = q.articles[ai][1].toLowerCase();
          const input = createInput(correct);
          div.append(input, " ");
          ai++;
          return;
        }

        if (word.includes("_ADJA")) {
          const prefix = word.split("_ADJA")[0];
          div.append(prefix + q.adjectives[aj][1] + " ");
          aj++;
          return;
        }
      }

      // ADJECTIVES MODE → only adjective inputs
      if (mode === "adjectives") {
        if (word.includes("_ADJA")) {
          const prefix = word.split("_ADJA")[0];
          div.append(prefix);
          const correct = q.adjectives[aj][1].toLowerCase();
          const input = createInput(correct);
          div.append(input, " ");
          aj++;
          return;
        }

        if (word.includes("_ART")) {
          const prefix = word.split("_ART")[0];
          div.append(prefix + q.articles[ai][1] + " ");
          ai++;
          return;
        }
      }

      div.append(word + " ");
    });

    container.appendChild(div);
  });
}


// -----------------------------
// INPUT FIELD CREATOR
// -----------------------------
function createInput(correct) {
  const input = document.createElement("input");
  input.type = "text";
  input.size = correct.length;
  input.dataset.answer = correct;
  // 🔥 Mobile keyboard fixes
  input.setAttribute("autocapitalize", "none");
  input.setAttribute("autocorrect", "off"); 
  input.setAttribute("autocomplete", "off"); 
  input.setAttribute("spellcheck", "false");

  input.addEventListener("input", () => {
    const user = input.value.trim().toLowerCase();
    input.classList.toggle("correct", user === correct);
    input.classList.toggle("incorrect", user !== "" && user !== correct);
  });

  return input;
}


// -----------------------------
// NEXT EXERCISE BUTTON
// -----------------------------
function setupNextButton() {
  const nextBtn = document.getElementById("next-btn");
  nextBtn.style.display = "inline";

  const index = exerciseList.findIndex(e => `Exercises/${e.file}` === currentFile);
  if (index === -1) return;

  const nextIndex = (index + 1) % exerciseList.length;

  nextBtn.addEventListener("click", () => {
    const nextFile = exerciseList[nextIndex].file;
    window.location.href = `exercise.html?file=Exercises/${nextFile}`;
  });
}
