class UserAppBar extends HTMLElement {
  constructor() {
    super();

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

const renderer = new marked.Renderer()

renderer.heading = function(text, level) {
  const id = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")

  return `<h${level} id="${id}">${text}</h${level}>`
}

marked.setOptions({ renderer })

function renderTopics(md){

  const lines = md.split("\n")

  const topics = lines
    .filter(l => l.trim().startsWith("#"))
    .map(l => {

        const level = l.match(/^#+/)[0].length
        const title = l.replace(/^#+\s*/, "")

        const id = title
          .toLowerCase()
          .replace(/[^\w\s]/g,"")
          .replace(/\s+/g,"-")

        return { level, title, id }
    })

  const container = document.querySelector(".c-topics")

  container.innerHTML = topics.map(t =>
    `<a class="topic level-${t.level}" href="#${t.id}">${t.title}</a>`
  ).join("")
}

document.addEventListener("DOMContentLoaded", () => {

  fetch("/content/main.md")
    .then(r => r.text())
    .then(md => {

      const html = marked.parse(md)

      const el = document.getElementById("markdown")
      if(!el) return

      el.innerHTML = html

      renderTopics(md)

    })

})