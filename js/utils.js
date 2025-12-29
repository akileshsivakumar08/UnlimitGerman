// -----------------------------
// MODE HELPER
// -----------------------------
function getMode() {
  return document.getElementById("mode").value;
}

// -----------------------------
// INPUT FIELD CREATOR
// -----------------------------
function createInput(correct) {
  const input = document.createElement("input");
  input.type = "text";
  input.size = correct.length;
  input.dataset.answer = correct;

  input.addEventListener("input", () => {
    const user = input.value.trim().toLowerCase();
    input.classList.toggle("correct", user === correct);
    input.classList.toggle("incorrect", user !== "" && user !== correct);
  });

  return input;
}
