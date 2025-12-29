// -----------------------------
// GET CURRENT FILE FROM URL
// -----------------------------
const params = new URLSearchParams(window.location.search);
const currentFile = params.get("file");

// Global list of exercises
let exerciseList = [];


// -----------------------------
// LOAD INDEX.JSON THEN EXERCISE
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

    // Default view
    showOriginalText(data[0]);

    // Set Filter button
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
