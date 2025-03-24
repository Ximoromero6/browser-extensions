import { toggleTheme } from "./theme.js";
import { fetchExtensions } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Aplicación iniciada 🚀");

  toggleTheme();

  const container = document.querySelector(".extensions-container");

  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = "Loading extensions...";
  container.appendChild(loader);

  let extensions = JSON.parse(localStorage.getItem("extensions"));

  if (!extensions) {
    const fetched = await fetchExtensions();
    localStorage.setItem("extensions", JSON.stringify(fetched));
    extensions = fetched;
  }

  loader.remove();

  renderExtensions(extensions);

  setupFilterButtons();
});

/**
 * Renderiza extensiones según filtro
 */
const renderExtensions = (extensions) => {
  const container = document.querySelector(".extensions-container");
  container.innerHTML = "";

  extensions.forEach((extension, index) => {
    const card = document.createElement("div");
    card.className = "extension-card element";

    card.innerHTML = `
      <div class="extension-card-info">
        <img src="${extension.logo}" alt="${extension.name}">
        <div class="text">
          <h3 class="title">${extension.name}</h3>
          <p class="desc">${extension.description}</p>
        </div>
      </div>

      <div class="extension-card-options">
        <button type="button" class="remove-btn element">Remove</button>
        <label class="mini-switch">
          <input type="checkbox" class="mini-switch__checkbox" ${
            extension.isActive ? "checked" : ""
          }>
          <span class="slider"></span>
        </label>
      </div>
    `;

    // Evento de switch
    const checkbox = card.querySelector(".mini-switch__checkbox");
    checkbox.addEventListener("change", (e) => {
      const ext = getExtensionsFromStorage();
      ext[index].isActive = e.target.checked;
      localStorage.setItem("extensions", JSON.stringify(ext));
    });

    // Evento de eliminar
    const removeBtn = card.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      const ext = getExtensionsFromStorage();
      ext.splice(index, 1);
      localStorage.setItem("extensions", JSON.stringify(ext));
      renderExtensions(ext);
    });

    container.appendChild(card);
  });
};

/**
 * Setup de botones de filtro
 */
const setupFilterButtons = () => {
  const allBtn = document.getElementById("filter-all");
  const activeBtn = document.getElementById("filter-active");
  const inactiveBtn = document.getElementById("filter-inactive");

  allBtn.addEventListener("click", () => {
    updateActiveFilter(allBtn);
    localStorage.setItem("activeFilter", "all");
    renderExtensions(getExtensionsFromStorage());
  });

  activeBtn.addEventListener("click", () => {
    updateActiveFilter(activeBtn);
    localStorage.setItem("activeFilter", "active");
    const active = getExtensionsFromStorage().filter((e) => e.isActive);
    renderExtensions(active);
  });

  inactiveBtn.addEventListener("click", () => {
    updateActiveFilter(inactiveBtn);
    localStorage.setItem("activeFilter", "inactive");
    const inactive = getExtensionsFromStorage().filter((e) => !e.isActive);
    renderExtensions(inactive);
  });

  // Al cargar la página, restauramos el filtro guardado
  const storedFilter = localStorage.getItem("activeFilter") || "all";
  switch (storedFilter) {
    case "all":
      allBtn.click();
      break;
    case "active":
      activeBtn.click();
      break;
    case "inactive":
      inactiveBtn.click();
      break;
  }
};

/**
 * Función para acceder al localStorage
 */
const getExtensionsFromStorage = () => {
  return JSON.parse(localStorage.getItem("extensions")) || [];
};

const updateActiveFilter = (activeButton) => {
  document
    .querySelectorAll(".extensions__filter")
    .forEach((btn) => btn.classList.remove("extensions__filter--active"));
  activeButton.classList.add("extensions__filter--active");
};
