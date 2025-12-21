fetch("exercise.json") 
.then(response => response.json()) 
.then(data => renderQuestions(data)) 
.catch(err => { console.error("Failed to load questions:", err); 
document.getElementById("quiz-container").textContent = "Failed to load questions."; });


function renderQuestions(data) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  const q = data[0]; 
  const text = q.question;
  const answers = q.answers; // array like [ [1,"is"], [2,"ur"], [3,"ue"] ]

  // Split the question into parts around the blanks
  const parts = text.split("__");

  // Number of blanks
  const blankCount = parts.length - 1;

  const div = document.createElement("div");
  div.className = "question";

  for (let i = 0; i < parts.length; i++) {
    div.appendChild(document.createTextNode(parts[i]));

    if (i < blankCount) {
      const input = document.createElement("input");
      input.type = "text";

      // answers[i] = [index, "letters"]
      const correct = answers[i][1].toLowerCase();
      input.dataset.answer = correct;

      input.addEventListener("input", function () {
        const user = input.value.trim().toLowerCase();

        if (user === "") {
          input.classList.remove("correct", "incorrect");
        } else if (user === correct) {
          input.classList.add("correct");
          input.classList.remove("incorrect");
        } else {
          input.classList.add("incorrect");
          input.classList.remove("correct");
        }
      });

      div.appendChild(input);
    }
  }

  container.appendChild(div);
}

