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
