/**
 * CONSTRUCT.js
 * Orquestador principal → carga módulos externos y gestiona
 * las funciones inmediatas de la página (nav, status, proyectos, modal).
 */

const CONSTRUCT = {

  // ─── Sistema de módulos ──────────────────────────────────

  modules: {},

  /**
   * Registra un módulo externo.
   * Los scripts de /scripts/ llaman esto al cargarse.
   * @param {string} name - Identificador del módulo
   * @param {object} module - Instancia o clase del módulo
   */
  register(name, module) {
    this.modules[name] = module;
    console.log(`[CONSTRUCT] Módulo registrado: ${name}`);
  },

  /**
   * Obtiene un módulo registrado.
   * @param {string} name
   * @returns {object|null}
   */
  get(name) {
    return this.modules[name] ?? null;
  },

  /**
   * Carga e inicializa todos los módulos registrados.
   * Cada módulo debe exponer un método init().
   */
  loadModules() {
    for (const [name, module] of Object.entries(this.modules)) {
      if (typeof module.init === 'function') {
        module.init();
        console.log(`[CONSTRUCT] Módulo iniciado: ${name}`);
      }
    }
  },

  // ─── Init principal ──────────────────────────────────────

  init() {
    this.loadModules();
    this.initNavigation();
    this.initOnlineStatus();
    this.initModal();
    this.loadProjects();
  },

  // ─── Navegación ──────────────────────────────────────────

  initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.navigateTo(item.getAttribute('data-page'));
      });
    });
  },

  navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === page);
    });

    // TODO: cargar contenido por página
    console.log(`[CONSTRUCT] Navegando a: ${page}`);
  },

  // ─── Estado online ───────────────────────────────────────

  initOnlineStatus() {
    this.updateOnlineStatus();
    window.addEventListener('online',  () => { this.isOnline = true;  this.updateOnlineStatus(); });
    window.addEventListener('offline', () => { this.isOnline = false; this.updateOnlineStatus(); });
  },

  isOnline: navigator.onLine,

  updateOnlineStatus() {
    const dot  = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;

    dot.classList.toggle('online',  this.isOnline);
    dot.classList.toggle('offline', !this.isOnline);
    text.textContent = this.isOnline ? 'En línea' : 'Desconectado';
  },

  // ─── Modal ───────────────────────────────────────────────

  initModal() {
    const modal = document.getElementById('project-modal');
    const btnClose = document.getElementById('modal-close');
    if (!modal) return;

    btnClose?.addEventListener('click', () => this.closeModal());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  closeModal() {
    document.getElementById('project-modal')?.classList.remove('active');
  },

  // ─── Proyectos ───────────────────────────────────────────

  async loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
      const res      = await fetch('/public/dinamic/projects.json');
      const projects = await res.json();

      container.innerHTML = '';

      for (const project of projects) {
        const item = document.createElement('div');
        item.className = 'project-item';

        item.innerHTML = `
          <div class="project-item-title">${project.title}</div>
          <span class="project-item-arrow">›</span>
        `;

        item.addEventListener('click', () => {
          this.openProject(project.markdown, project.title);
        });

        container.appendChild(item);
      }
    } catch (err) {
      console.error('[CONSTRUCT] Error cargando proyectos:', err);
      container.innerHTML = '<p class="projects-error">Error al cargar proyectos</p>';
    }
  },

  async openProject(markdownFile, title) {
    const modal     = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody  = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalTitle.textContent = title || 'Proyecto';
    modalBody.innerHTML    = '<p class="projects-error">Cargando...</p>';
    modal.classList.add('active');

    try {
      const res      = await fetch(`/public/markdown/${markdownFile}`);
      const markdown = await res.text();
      const html     = markdownit().render(markdown);

      modalBody.innerHTML = `<div class="markdown-body">${html}</div>`;
    } catch (err) {
      console.error('[CONSTRUCT] Error cargando proyecto:', err);
      modalBody.innerHTML = '<p class="projects-error">Error al cargar el contenido</p>';
    }
  },

};

// ─── Auto-init ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => CONSTRUCT.init());

// Navbar scrolled
window.addEventListener('scroll', () => {
  document.getElementById('main-navbar')?.classList.toggle('scrolled', window.scrollY > 10);
});