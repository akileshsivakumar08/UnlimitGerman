const container = document.getElementById("card-container");

// Load the manifest file
fetch("Exercises/index.json")
  .then(res => res.json())
  .then(list => {
    // Sort by date (newest first)
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Load each exercise file
    list.forEach(entry => {
      const filePath = `Exercises/${entry.file}`;

      fetch(filePath)
        .then(res => res.json())
        .then(data => {
          const title = data[0].title; // use title from JSON

          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `<h2>${title}</h2><p>Click to start</p>`;

          card.addEventListener("click", () => {
            window.location.href = `exercise.html?file=${filePath}`;
          });

          container.appendChild(card);
        })
        .catch(err => console.error("Failed to load:", filePath, err));
    });
  })
  .catch(err => console.error("Failed to load index.json", err));
