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
          <h2 class="title">${extension.name}</h2>
          <p class="desc">${extension.description}</p>
        </div>
      </div>

      <div class="extension-card-options">
        <button type="button" class="remove-btn element" aria-label="Remove extension">Remove</button>
        <label class="mini-switch">
          <input type="checkbox" class="mini-switch__checkbox" ${
            extension.isActive ? "checked" : ""
          } aria-label="Switch extension">
          <span class="slider"></span>
        </label>
      </div>
    `;

    // Evento de switch
    const checkbox = card.querySelector(".mini-switch__checkbox");

    checkbox.addEventListener("change", (e) => {
      const allExtensions = getExtensionsFromStorage();
      const index = allExtensions.findIndex(
        (ext) => ext.name === extension.name
      );

      if (index !== -1) {
        allExtensions[index].isActive = e.target.checked;
        localStorage.setItem("extensions", JSON.stringify(allExtensions));
      }
    });

    // Evento de eliminar
    const removeBtn = card.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      const allExtensions = getExtensionsFromStorage();
      const updated = allExtensions.filter(
        (ext) => ext.name !== extension.name
      );
      localStorage.setItem("extensions", JSON.stringify(updated));

      applyStoredFilter(); // Reaplica el filtro actual
    });

    container.appendChild(card);
  });
};

const applyStoredFilter = () => {
  const storedFilter = localStorage.getItem("activeFilter") || "all";
  const all = getExtensionsFromStorage();

  if (storedFilter === "active") {
    renderExtensions(all.filter((e) => e.isActive));
  } else if (storedFilter === "inactive") {
    renderExtensions(all.filter((e) => !e.isActive));
  } else {
    renderExtensions(all);
  }
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
    applyStoredFilter();
  });

  activeBtn.addEventListener("click", () => {
    updateActiveFilter(activeBtn);
    localStorage.setItem("activeFilter", "active");
    applyStoredFilter();
  });

  inactiveBtn.addEventListener("click", () => {
    updateActiveFilter(inactiveBtn);
    localStorage.setItem("activeFilter", "inactive");
    applyStoredFilter();
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
