// roadmap.js

CONSTRUCT.register('roadmap', {
  container: null,
  data: [],
  colors: [
    { bg: '#fff0e0', border: '#f0a060', text: '#a05010' }, // naranja suave
    { bg: '#d8f5e8', border: '#3dbb7a', text: '#0a6030' }, // verde
    { bg: '#ddeeff', border: '#5599ee', text: '#1144aa' }, // azul
    { bg: '#f5e0ff', border: '#aa55ee', text: '#5010a0' }, // morado

    { bg: '#ffe0e0', border: '#e05555', text: '#801010' }, // rojo suave
    { bg: '#fff5cc', border: '#e6c200', text: '#806600' }, // amarillo
    { bg: '#e0f7ff', border: '#33b5cc', text: '#006680' }, // cyan
    { bg: '#f0f0f0', border: '#999999', text: '#333333' }, // gris neutro

    { bg: '#e6ffe6', border: '#66cc66', text: '#2d7a2d' }, // verde claro
    { bg: '#fff0f5', border: '#ff66a3', text: '#99004d' }, // rosa
    { bg: '#f2e6ff', border: '#9966cc', text: '#4d2d80' }, // lavanda
    { bg: '#fff8e6', border: '#ffb84d', text: '#804d00' }, // ámbar claro
],

  init() {
    this.container = document.getElementById('roadmap-container');
    if (this.container) this.loadData();
  },

  async loadData() {
    try {
      const res  = await fetch('/public/dinamic/roadmap.json');
      this.data  = await res.json();
      this.render();
    } catch {
      this.data = [
        { title: 'Aprendo GIT',            link: '#git' },
        { title: 'Desarrollo\nHolycaster', link: '#holycaster' },
        { title: 'Aprendo Kdenlive',       link: '#kdenlive' },
      ];
      this.render();
    }
  },

  render() {
    if (!this.container || !this.data.length) return;
    this.container.innerHTML = '';

    this.data.forEach((item, i) => {
      const color = this.colors[i % this.colors.length];
      const node  = document.createElement('a');
      node.href      = item.link || '#';
      node.className = 'roadmap-node';
      node.style.setProperty('--node-bg',     color.bg);
      node.style.setProperty('--node-border', color.border);
      node.style.setProperty('--node-text',   color.text);
      node.innerHTML = item.title.replace(/\n/g, '<br>');
      this.container.appendChild(node);

      if (i < this.data.length - 1) {
        const arrow = document.createElement('span');
        arrow.className   = 'roadmap-arrow';
        arrow.textContent = '›';
        this.container.appendChild(arrow);
      }
    });
  },
});