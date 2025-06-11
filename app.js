const extensions = document.querySelector(".extensions");
const modButtons = document.querySelectorAll(".mods div");

let extensionsData = [];
let currentFilter = "all";

(async function fetchData() {
  try {
    const res = await fetch("./data.json");
    extensionsData = await res.json();
    renderExtensions();
  } catch (e) {
    console.error(e);
  }
})();

function renderExtensions() {
  extensions.innerHTML = extensionsData
    .map((d, index) => {
      const isActive = d.isActive;
      if (
        currentFilter === "active" && !isActive ||
        currentFilter === "inactive" && isActive
      ) {
        return ""; 
      }

      return `
        <div class="extension-card" data-index="${index}">
          <div class="extension-top">
            <div class="extension-icon">
              <img draggable="false" src="${d.logo}" alt="">
            </div>
            <div style="padding: 0 20px">
              <div class="extension-title">${d.name}</div>
              <div class="extension-description">${d.description}</div>
            </div>
          </div>
          <div class="extension-bottom">
            <div class="remove-btn">
              <button class="remove">Remove</button>
            </div>
            <div class="mode-bar ${isActive ? "active-mode" : ""}" data-index="${index}">
              <span class="dot"></span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll(".mode-bar").forEach((bar) => {
    bar.addEventListener("click", () => {
      const index = parseInt(bar.getAttribute("data-index"));
      
      extensionsData[index].isActive = !extensionsData[index].isActive;
      
      bar.classList.toggle("active-mode");
    });
  });

  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".extension-card");
      const index = parseInt(card.getAttribute("data-index"));

      card.classList.add("remove-anim");

      setTimeout(() => {
        extensionsData.splice(index, 1);
        renderExtensions(); 
      }, 300);
    });
  });
}

modButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderExtensions();
  });
});

const colorModeToggle = document.querySelector(".color-mode");
const colorModeIcon = colorModeToggle.querySelector("img");
const body = document.body;
const logo = document.querySelector(".logo img");

const LIGHT_ICON = "/BrowserExtensionManagerUI/assets/images/icon-sun.svg"; 
const DARK_ICON = "/BrowserExtensionManagerUI/assets/images/icon-moon.svg";
const LIGHT_LOGO = "/BrowserExtensionManagerUI/assets/images/logo-light.png";
const DARK_LOGO = "/BrowserExtensionManagerUI/assets/images/logo.svg"

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    colorModeIcon.src = DARK_ICON;
    logo.src = DARK_LOGO;
  } else {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    colorModeIcon.src = LIGHT_ICON; 
    logo.src = LIGHT_LOGO;
  }
}

function toggleTheme() {
  const isDark = body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode", !isDark);

  logo.src = isDark ? LIGHT_LOGO : DARK_LOGO;

  colorModeIcon.src = isDark ? LIGHT_ICON : DARK_ICON;

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

applySavedTheme();
colorModeToggle.addEventListener("click", toggleTheme);
