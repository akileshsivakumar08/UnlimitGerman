// Load the exercise data
fetch("exercise.json")
  .then(response => response.json())
  .then(data => {
    // Show the filled text on page load
    showOriginalText(data[0]);

    // Start practice button
    document.getElementById("start-btn").addEventListener("click", () => {
      renderQuestions(data);   // switch to practice mode
      document.getElementById("start-btn").style.display = "none";
      document.getElementById("back-btn").style.display = "inline";
    });

    // Back to original text button
    document.getElementById("back-btn").addEventListener("click", () => {
      showOriginalText(data[0]); // back to filled text
      document.getElementById("back-btn").style.display = "none";
      document.getElementById("start-btn").style.display = "inline";
    });
  })
  .catch(err => {
    console.error("Failed to load questions:", err);
    document.getElementById("quiz-container").textContent = "Failed to load questions.";
  });

function fadeSwap(callback) {
  const container = document.getElementById("quiz-container");
  container.classList.remove("show"); // fade out

  setTimeout(() => {
    callback();                        // swap content
    container.classList.add("show");   // fade in
  }, 100); // small delay so CSS transition triggers
}

function showOriginalText(q) {
  fadeSwap(() => {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const words = q.question.split(" ");
    let articleIndex = 0;
    let adjectiveIndex = 0;

    const div = document.createElement("div");
    div.className = "original-text";

    words.forEach(word => {
      if (word.includes("_ART")) {
        const prefix = word.split("_ART")[0];
        const correct = q.articles[articleIndex][1];
        div.appendChild(document.createTextNode(prefix + correct + " "));
        articleIndex++;
      } else if (word.includes("_ADJA")) {
        const prefix = word.split("_ADJA")[0];
        const correct = q.adjectives[adjectiveIndex][1];
        div.appendChild(document.createTextNode(prefix + correct + " "));
        adjectiveIndex++;
      } else {
        div.appendChild(document.createTextNode(word + " "));
      }
    });

    container.appendChild(div);
  });
}

function renderQuestions(data) {
  fadeSwap(() => {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";
    const q = data[0];
    const words = q.question.split(" ");

    let articleIndex = 0;
    let adjectiveIndex = 0;

    const div = document.createElement("div");
    div.className = "question";

    words.forEach(word => {
      if (word.includes("_ART")) {
        const prefix = word.split("_ART")[0];
        div.appendChild(document.createTextNode(prefix));

        const correct = q.articles[articleIndex][1].toLowerCase();
        const input = document.createElement("input");
        input.type = "text";
        input.size = correct.length;
        input.dataset.answer = correct;

        input.addEventListener("input", () => {
          const user = input.value.trim().toLowerCase();
          input.classList.toggle("correct", user === correct);
          input.classList.toggle("incorrect", user !== "" && user !== correct);
        });

        div.appendChild(input);
        div.appendChild(document.createTextNode(" "));
        articleIndex++;
      } else if (word.includes("_ADJA")) {
        const prefix = word.split("_ADJA")[0];
        div.appendChild(document.createTextNode(prefix));

        const correct = q.adjectives[adjectiveIndex][1].toLowerCase();
        const input = document.createElement("input");
        input.type = "text";
        input.size = correct.length;
        input.dataset.answer = correct;

        input.addEventListener("input", () => {
          const user = input.value.trim().toLowerCase();
          input.classList.toggle("correct", user === correct);
          input.classList.toggle("incorrect", user !== "" && user !== correct);
        });

        div.appendChild(input);
        div.appendChild(document.createTextNode(" "));
        adjectiveIndex++;
      } else {
        div.appendChild(document.createTextNode(word + " "));
      }
    });

    container.appendChild(div);
  });
}
