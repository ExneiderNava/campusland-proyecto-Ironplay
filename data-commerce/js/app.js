// js/app.js
import { IronHeader, IronFooter } from './components.js';

customElements.define('iron-header', IronHeader);
customElements.define('iron-footer', IronFooter);

const PRODUCTOS_URL = 'data/productos.json';

let allProducts = [];
let currentCategory = 'todos';

async function loadProducts() {
  try {
    const response = await fetch(PRODUCTOS_URL);
    if (!response.ok) throw new Error('No se pudo cargar productos.json');
    const data = await response.json();
    return data.categorias || [];
  } catch (_) {
    return [];
  }
}

function flattenProducts(categorias) {
  const all = [];
  for (const cat of categorias) {
    const catNombre = cat.nombre || 'Deporte';
    const productos = cat.productos || [];
    for (const p of productos) {
      all.push({
        id: p.id || Date.now() + Math.random(),
        nombre: p.nombre || 'Producto',
        categoria: catNombre,
        marca: p.marca || '',
        precio: p.precio || 0,
        stock: p.stock || 0,
        imagen: p.imagen || '',
        descripcion: `${p.marca || ''} · ${catNombre}`
      });
    }
  }
  return all;
}

function getUniqueCategories(products) {
  const cats = new Set();
  for (const p of products) {
    cats.add(p.categoria);
  }
  return Array.from(cats).sort();
}

function renderFilterButtons(categories) {
  const filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;

  let html = `<button class="filter-btn active" data-categoria="todos">Todos</button>`;
  for (const cat of categories) {
    html += `<button class="filter-btn" data-categoria="${cat}">${cat}</button>`;
  }
  filterBar.innerHTML = html;

  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.categoria;
      renderProducts(filterProducts(allProducts, currentCategory));
    });
  });
}

function filterProducts(products, category) {
  if (category === 'todos') return products;
  return products.filter(p => p.categoria === category);
}

function renderProducts(products) {
  const grid = document.querySelector('.product-grid');
  if (!grid) return;

  if (!products || products.length === 0) {
    grid.innerHTML = `<p style="text-align:center;color:var(--text-secondary);">No hay productos en esta categoría.</p>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <span class="category-badge">${p.categoria}</span>
      <h3>${p.nombre}</h3>
      <div class="price">$${p.precio.toLocaleString()}</div>
      <div class="marca">${p.marca}</div>
      <p class="description">${p.descripcion}</p>
      <button class="btn-buy" aria-label="Añadir al carrito (demo)">➕ Añadir</button>
    </article>
  `).join('');
}

(async function init() {
  const categorias = await loadProducts();
  allProducts = flattenProducts(categorias);
  const uniqueCats = getUniqueCategories(allProducts);
  renderFilterButtons(uniqueCats);
  renderProducts(allProducts);
})();