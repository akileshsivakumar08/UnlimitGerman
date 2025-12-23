fetch("exercise.json") 
.then(response => response.json()) 
.then(data => renderQuestions(data)) 
.catch(err => { console.error("Failed to load questions:", err); 
document.getElementById("quiz-container").textContent = "Failed to load questions."; });


function renderQuestions(data) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  const ip_Width=1;
  const q = data[0];
  const words = q.question.split(" ");

  let articleIndex = 0;
  let adjectiveIndex = 0;

  const div = document.createElement("div");
  div.className = "question";

  words.forEach(word => {
    if (word.includes("_ART")) {
      // prefix before _ART
      const prefix = word.split("_ART")[0];
      div.appendChild(document.createTextNode(prefix));

      const input = document.createElement("input");
      input.type = "text";
      input.size = ip_Width; // ensures 5-character width
      const correct = q.articles[articleIndex][1].toLowerCase();
      input.dataset.answer = correct;

      input.addEventListener("input", () => {
        const user = input.value.trim().toLowerCase();
        input.classList.toggle("correct", user === correct);
        input.classList.toggle("incorrect", user !== "" && user !== correct);
      });

      div.appendChild(input);
      div.appendChild(document.createTextNode(" ")); // keep spacing
      articleIndex++;
    } else if (word.includes("_ADJA")) {
      const prefix = word.split("_ADJA")[0];
      div.appendChild(document.createTextNode(prefix));

      const input = document.createElement("input");
      input.type = "text";
      input.size = ip_Width; // ensures 5-character width
      const correct = q.adjectives[adjectiveIndex][1].toLowerCase();
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
}
