// js/components.js
const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
  <header style="
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1.2rem;
    background: rgba(11, 14, 26, 0.7);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    border-radius: 60px;
    margin: 0.8rem auto 0.2rem;
    max-width: 1200px;
    width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;
    gap: 0.6rem;
  ">
    <div style="display:flex;align-items:center;gap:0.4rem;">
      <span style="font-weight:800;font-size:1.9rem;background:linear-gradient(145deg,#6c3cff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">⚡</span>
      <span style="font-weight:700;font-size:1.7rem;letter-spacing:-0.02em;background:linear-gradient(145deg,#f0f2fa,#b0b8d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">IRON PLAY</span>
    </div>
    <nav style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
      <a href="#" style="color:var(--text-secondary, #b0b8d0);text-decoration:none;font-weight:500;font-size:0.95rem;transition:color 0.2s;">Inicio</a>
      <a href="#productos" style="color:var(--text-secondary, #b0b8d0);text-decoration:none;font-weight:500;font-size:0.95rem;transition:color 0.2s;">Productos</a>
      <a href="admin.html" style="
        background: var(--gradient-accent, linear-gradient(145deg,#f97316,#ec4899));
        padding: 0.4rem 1.2rem;
        border-radius: 40px;
        font-weight: 600;
        font-size: 0.85rem;
        color: #fff;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(249,115,22,0.3);
        transition: transform 0.1s;
        letter-spacing: 0.3px;
      ">👤 Admin</a>
    </nav>
  </header>
`;

const footerTemplate = document.createElement('template');
footerTemplate.innerHTML = `
  <footer style="
    text-align: center;
    padding: 1.8rem 0.8rem;
    margin-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.04);
    color: var(--text-secondary, #b0b8d0);
    font-size: 0.9rem;
    max-width: 1200px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
  ">
    <span style="display:inline-flex;align-items:center;gap:6px;">
      <span style="background:linear-gradient(145deg,#6c3cff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">✦</span>
      Iron Play · Futuro deportivo
      <span style="background:linear-gradient(145deg,#f97316,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">✦</span>
    </span>
    <br>
    <span style="opacity:0.5;font-size:0.75rem;">© 2026 · datos desde JSON</span>
  </footer>
`;

export class IronHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
  }
}

export class IronFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
  }
}