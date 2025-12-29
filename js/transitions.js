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
