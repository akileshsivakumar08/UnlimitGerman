fetch("questions.json") 
.then(response => response.json()) 
.then(data => renderQuestions(data)) 
.catch(err => { console.error("Failed to load questions:", err); 
document.getElementById("quiz-container").textContent = "Failed to load questions."; });


function renderQuestions(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  questions.forEach(q => {
    const div = document.createElement("div");
    div.className = "question";

    // Split at the blank
    const parts = q.question.split("____");

    // Create input
    const input = document.createElement("input");
    input.type = "text";
    input.dataset.answer = q.answer.toLowerCase();

    input.addEventListener("input", function () {
      const userAnswer = input.value.trim().toLowerCase();
      const correctAnswer = input.dataset.answer;

      if (userAnswer === "") {
        input.classList.remove("correct", "incorrect");
        return;
      }

      if (userAnswer === correctAnswer) {
        input.classList.add("correct");
        input.classList.remove("incorrect");
      } else {
        input.classList.add("incorrect");
        input.classList.remove("correct");
      }
    });

    // Build sentence with input inserted
    div.appendChild(document.createTextNode(parts[0]));
    div.appendChild(input);

    if (parts[1]) {
      div.appendChild(document.createTextNode(parts[1]));
    }

    container.appendChild(div);
  });
}
