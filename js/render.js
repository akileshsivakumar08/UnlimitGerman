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
          div.append(createInput(correct), " ");
          ai++;
          return;
        }

        if (word.includes("_ADJA")) {
          const prefix = word.split("_ADJA")[0];
          div.append(prefix);
          const correct = q.adjectives[aj][1].toLowerCase();
          div.append(createInput(correct), " ");
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
          div.append(createInput(correct), " ");
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
          div.append(createInput(correct), " ");
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

      // Normal word
      div.append(word + " ");
    });

    container.appendChild(div);
  });
}
