const pathContent = "/pages/markdown/"
const enableSchedule = true

const schedule = document.getElementById('schedule')

if (enableSchedule) {
    schedule.style.color = '#14c16d'
    schedule.style.border = '1px solid #2c9a5d'
    schedule.style.background = '#21df733a'
    schedule.textContent = 'Disponible para trabajar - Agenda Abierta'
} else {
    schedule.style.color = '#ff3a4b'
    schedule.style.border = '1px solid #c12b2b'
    schedule.style.background = '#ff293b6a'
    schedule.textContent = 'Ocupado, no disponible - Agenda en curso'
}

class MarkdownView extends HTMLElement {

    async connectedCallback() {
        const file = this.getAttribute("src")

        if (!file) {
            this.innerHTML = "markdown no especificado"
            return
        }

        const url = pathContent + file
        const res = await fetch(url)

        if (!res.ok) {
            this.innerHTML = "<h2>archivo no encontrado</h2>"
            return
        }

        const md = await res.text()
        this.innerHTML = marked.parse(md)
    }
}

customElements.define("markdown-l", MarkdownView)