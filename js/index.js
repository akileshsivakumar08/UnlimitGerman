// ---------------------------------------------
// EXPAND TEXTAREA ON CLICK
// ---------------------------------------------
const inputText = document.getElementById("input-text");

inputText.addEventListener("click", () => {
  inputText.classList.add("expanded");
});


// ---------------------------------------------
// CREATE EXERCISE BUTTON
// ---------------------------------------------
document.getElementById("create-ex-btn").addEventListener("click", () => {
  const text = inputText.value.trim();

  if (!text) {
    alert("Please enter some text.");
    return;
  }

  // Send text to backend (Flask endpoint)
  fetch("/create-exercise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(result => {
      alert("Exercise created successfully!");

      // Reload the cards so the new exercise appears
      loadExerciseCards();
    })
    .catch(err => {
      console.error("Error creating exercise:", err);
      alert("Failed to create exercise.");
    });
});


// ---------------------------------------------
// LOAD EXERCISE CARDS FROM index.json
// ---------------------------------------------
function loadExerciseCards() {
  fetch("Exercises/index.json")
    .then(res => res.json())
    .then(list => {
      const container = document.getElementById("card-container");
      container.innerHTML = "";

      list.forEach(ex => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h3>${ex.title}</h3>
          <p>${ex.date}</p>
        `;

        card.addEventListener("click", () => {
          window.location.href = `exercise.html?file=Exercises/${ex.file}`;
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load exercise list:", err);
    });
}


// ---------------------------------------------
// INITIAL LOAD
// ---------------------------------------------
loadExerciseCards();
