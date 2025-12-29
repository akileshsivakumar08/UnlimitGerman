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
