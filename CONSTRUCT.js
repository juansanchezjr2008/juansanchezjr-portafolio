const md = window.markdownit();

const tabMap = {
  tab1: "/content/sobre-mi.md",
  tab2: "/content/educacion.md",
  tab3: "/content/habilidades.md",
  tab4: "/content/certificado.md",
  tab5: "/content/contacto.md"
};

async function loadMarkdown(tabId) {
  const container = document
    .getElementById(tabId)
    .querySelector(".markdown-body");

  if (!container) return;

  const path = tabMap[tabId];
  if (!path) return;

  try {
    const response = await fetch(path);
    const text = await response.text();
    container.innerHTML = md.render(text);
  } catch (error) {
    container.innerHTML = "<p>Error cargando contenido.</p>";
  }
}

function openTab(event, tabId) {
  document.querySelectorAll(".tab-content")
    .forEach(tab => tab.classList.remove("active"));

  document.querySelectorAll(".tab-link")
    .forEach(link => link.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");

  loadMarkdown(tabId);
}

document.addEventListener("DOMContentLoaded", () => {
  loadMarkdown("tab1");
});