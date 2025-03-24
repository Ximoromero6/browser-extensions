export function toggleTheme() {
  const body = document.body;
  const toggleButton = document.getElementById("theme-toggle");
  const toggleButtonIcon = toggleButton.querySelector("i");

  // Aplicar el tema almacenado en localStorage
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleButtonIcon.className = "fi fi-rr-brightness";
  } else {
    toggleButtonIcon.className = "fi fi-rc-moon";
  }

  // Evento para cambiar de tema
  toggleButton?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    //Cambiar icono, luna o sol
    toggleButtonIcon.className = body.classList.contains("dark-mode")
      ? "fi fi-rr-brightness"
      : "fi fi-rc-moon";

    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
  });
}
