class UserAppBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <header id="appbar">
        <div class="appbar-wrap">
          <a href="#" class="logo">
            <img src="/logotipo.ico" alt="logotipo">
          </a>
          <nav class="nav">
            <a href="#sec-me" class="nav-i">Acerca de Mi</a>
            <a href="#sec-port" class="nav-i active">Portafolio</a>
            <a href="#sec-ser" class="nav-i">Servicios</a>
          </nav>
          <div class="status-area">
            <div class="status-dot"></div>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define("app-bar", UserAppBar);

const md = window.markdownit({ html: true, linkify: true, typographer: true });
const MARKDOWN_PATH = "/content/main.md";

async function renderMainMarkdown() {
  const container = document.getElementById("markdown");
  const topics = document.querySelector(".c-topics");

  if (!container) {
    console.error("No element found: #markdown");
    return;
  }

  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(MARKDOWN_PATH, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();
    container.innerHTML = md.render(text);

    const headers = container.querySelectorAll("h1,h2,h3,h4");
    topics.innerHTML = "";

    headers.forEach(h => {
      const id = h.textContent
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");

      h.id = id;

      const link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = h.textContent;

      const level = parseInt(h.tagName[1]);
      link.classList.add("level-" + level);

      topics.appendChild(link);
    });
  } catch (err) {
    console.error("Error loading markdown:", err);
    container.innerHTML = "<p>Error loading content.</p>";
  }
}

document.addEventListener("DOMContentLoaded", renderMainMarkdown);