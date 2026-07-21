// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // ---------- CONSTANTES Y RUTAS ----------
    const RUTAS = {
        productos: 'data/productos.json',
        inventario: 'data/inventario.json',
        ventas: 'data/ventas.json'
    };

    // ---------- REFERENCIAS DOM ----------
    const elementos = {
        totalProducts: document.getElementById('totalProducts'),
        totalSales: document.getElementById('totalSales'),
        totalRevenue: document.getElementById('totalRevenue'),
        lowStockCount: document.getElementById('lowStockCount'),
        categoryChart: document.getElementById('categoryChart'),
        dailyChart: document.getElementById('dailyChart'),
        lowStockTable: document.querySelector('#lowStockTable tbody'),
        recentSalesTable: document.querySelector('#recentSalesTable tbody'),
        logoutBtn: document.getElementById('logoutBtn'),
        // Nuevos elementos para marketing
        marketingBtn: document.getElementById('marketingBtn'),
        modal: document.getElementById('marketingModal'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        marketingForm: document.getElementById('marketingForm'),
        marketingMessage: document.getElementById('marketingMessage')
    };

    // ---------- FUNCIONES AUXILIARES ----------
    const formatearMoneda = (valor) => {
        return '$' + Number(valor).toLocaleString('es-CO');
    };

    // ---------- CARGA DE DATOS ----------
    async function cargarDatos() {
        try {
            const [respProductos, respInventario, respVentas] = await Promise.all([
                fetch(RUTAS.productos),
                fetch(RUTAS.inventario),
                fetch(RUTAS.ventas)
            ]);

            if (!respProductos.ok || !respInventario.ok || !respVentas.ok) {
                throw new Error('Error al cargar uno o más archivos JSON');
            }

            const productosData = await respProductos.json();
            const inventarioData = await respInventario.json();
            const ventasData = await respVentas.json();

            return { productosData, inventarioData, ventasData };
        } catch (error) {
            console.error('Error en la carga de datos:', error);
            document.querySelector('.dashboard').innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--text-secondary);">
          <h2>⚠️ No se pudieron cargar los datos</h2>
          <p>Verifica que los archivos JSON estén disponibles en las rutas especificadas.</p>
        </div>
      `;
            return null;
        }
    }

    // ---------- PROCESAMIENTO DE DATOS ----------
    function procesarDatos({ productosData, inventarioData, ventasData }) {
        // 1. Mapa de productos por id para acceder a nombre y categoría
        const mapaProductos = new Map();
        for (const categoria of productosData.categorias) {
            for (const prod of categoria.productos) {
                mapaProductos.set(prod.id, {
                    nombre: prod.nombre,
                    categoria: categoria.nombre,
                    marca: prod.marca || '',
                    precio: prod.precio || 0
                });
            }
        }

        const inventario = inventarioData.inventario || [];
        const ventas = ventasData.ventas || [];

        // KPIs
        const totalProductos = mapaProductos.size;
        const totalVentas = ventas.length;
        const ingresosTotales = ventas.reduce((acc, v) => acc + (v.total || 0), 0);

        const productosBajoStock = inventario.filter(item => {
            const bajoPorEstado = item.estado === 'Stock Bajo';
            const bajoPorMinimo = item.stock < item.stockMinimo;
            return bajoPorEstado || bajoPorMinimo;
        });

        // Ingresos por categoría
        const ingresosPorCategoria = {};
        for (const venta of ventas) {
            for (const prodVenta of venta.productos) {
                const prodId = prodVenta.productoId;
                const productoInfo = mapaProductos.get(prodId);
                if (!productoInfo) continue;
                const categoria = productoInfo.categoria;
                const subtotal = prodVenta.cantidad * prodVenta.precioUnitario;
                ingresosPorCategoria[categoria] = (ingresosPorCategoria[categoria] || 0) + subtotal;
            }
        }
        const categoriasOrdenadas = Object.entries(ingresosPorCategoria)
            .sort((a, b) => b[1] - a[1]);

        // Ventas por día (últimos 7 días)
        const ventasPorDia = {};
        for (const venta of ventas) {
            const fecha = new Date(venta.fecha);
            const clave = fecha.toISOString().slice(0, 10);
            ventasPorDia[clave] = (ventasPorDia[clave] || 0) + (venta.total || 0);
        }

        const hoy = new Date();
        const ultimos7Dias = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(hoy);
            d.setDate(d.getDate() - i);
            ultimos7Dias.push(d.toISOString().slice(0, 10));
        }

        const ventasUltimos7 = ultimos7Dias.map(dia => ({
            dia,
            total: ventasPorDia[dia] || 0
        }));

        const ventasRecientes = [...ventas]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 5);

        const productosBajoConNombre = productosBajoStock.map(item => {
            const info = mapaProductos.get(item.productoId);
            return {
                ...item,
                nombre: info ? info.nombre : 'Producto desconocido'
            };
        });

        return {
            kpis: {
                totalProductos,
                totalVentas,
                ingresosTotales,
                cantidadBajoStock: productosBajoStock.length
            },
            ingresosPorCategoria: categoriasOrdenadas,
            ventasUltimos7,
            productosBajoStock: productosBajoConNombre,
            ventasRecientes
        };
    }

    // ---------- RENDERIZADO ----------
    function renderizarDashboard(datos) {
        if (!datos) return;
        const { kpis, ingresosPorCategoria, ventasUltimos7, productosBajoStock, ventasRecientes } = datos;

        elementos.totalProducts.textContent = kpis.totalProductos;
        elementos.totalSales.textContent = kpis.totalVentas;
        elementos.totalRevenue.textContent = formatearMoneda(kpis.ingresosTotales);
        elementos.lowStockCount.textContent = kpis.cantidadBajoStock;

        // Categorías
        const maxCategoria = ingresosPorCategoria.length > 0 ? ingresosPorCategoria[0][1] : 1;
        let htmlCategoria = '';
        for (const [categoria, total] of ingresosPorCategoria) {
            const porcentaje = (total / maxCategoria) * 100;
            htmlCategoria += `
        <div class="bar-item">
          <span class="bar-label">${categoria}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${porcentaje}%;"></div>
          </div>
          <span class="bar-value">${formatearMoneda(total)}</span>
        </div>
      `;
        }
        if (!htmlCategoria) htmlCategoria = '<p style="color:var(--text-secondary);">Sin datos de ventas.</p>';
        elementos.categoryChart.innerHTML = htmlCategoria;

        // Días
        const maxDia = ventasUltimos7.reduce((max, d) => Math.max(max, d.total), 1);
        let htmlDia = '';
        for (const { dia, total } of ventasUltimos7) {
            const porcentaje = (total / maxDia) * 100;
            const etiqueta = dia.slice(5);
            htmlDia += `
        <div class="bar-item">
          <span class="bar-label">${etiqueta}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${porcentaje}%;"></div>
          </div>
          <span class="bar-value">${formatearMoneda(total)}</span>
        </div>
      `;
        }
        elementos.dailyChart.innerHTML = htmlDia;

        // Stock bajo
        let htmlLowStock = '';
        if (productosBajoStock.length === 0) {
            htmlLowStock = '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);">✅ No hay productos con stock bajo.</td></tr>';
        } else {
            for (const item of productosBajoStock) {
                htmlLowStock += `
          <tr>
            <td>${item.productoId}</td>
            <td>${item.nombre}</td>
            <td>${item.stock}</td>
            <td>${item.stockMinimo}</td>
            <td>${item.ubicacion}</td>
          </tr>
        `;
            }
        }
        elementos.lowStockTable.innerHTML = htmlLowStock;

        // Ventas recientes
        let htmlRecent = '';
        if (ventasRecientes.length === 0) {
            htmlRecent = '<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);">No hay ventas registradas.</td></tr>';
        } else {
            for (const venta of ventasRecientes) {
                const fechaFormateada = new Date(venta.fecha).toLocaleDateString('es-CO');
                htmlRecent += `
          <tr>
            <td>${fechaFormateada}</td>
            <td>${venta.cliente}</td>
            <td>${formatearMoneda(venta.total)}</td>
            <td>${venta.estado}</td>
          </tr>
        `;
            }
        }
        elementos.recentSalesTable.innerHTML = htmlRecent;
    }

    // ---------- LOGOUT ----------
    function cerrarSesion() {
        localStorage.removeItem('ironplay_user');
        window.location.href = 'login.html';
    }

    // ---------- MARKETING (NUEVO) ----------
    function initMarketing() {
        const modal = elementos.modal;
        const closeBtn = elementos.closeModalBtn;
        const form = elementos.marketingForm;
        const msg = elementos.marketingMessage;

        // Abrir modal
        elementos.marketingBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            // Limpiar estado previo
            form.reset();
            msg.textContent = '';
            msg.className = 'marketing-message';
            msg.style.display = 'none';
        });

        // Cerrar modal (botón X)
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('destName').value.trim();
            const emails = document.getElementById('destEmails').value.trim();

            // Validar
            if (!nombre || !emails) {
                msg.textContent = '⚠️ Por favor completa todos los campos.';
                msg.className = 'marketing-message error';
                msg.style.display = 'block';
                return;
            }

            // Mostrar estado de carga
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            msg.style.display = 'none';

            try {
                const response = await fetch('http://localhost:5000/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, emails })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    msg.textContent = '✅ ' + result.message;
                    msg.className = 'marketing-message success';
                    msg.style.display = 'block';
                    form.reset();
                } else {
                    msg.textContent = '❌ Error: ' + (result.message || 'No se pudo enviar el correo.');
                    msg.className = 'marketing-message error';
                    msg.style.display = 'block';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                msg.textContent = '❌ No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en el puerto 5000.';
                msg.className = 'marketing-message error';
                msg.style.display = 'block';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ---------- INICIALIZACIÓN ----------
    async function init() {
        const user = localStorage.getItem('ironplay_user');
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const datosRaw = await cargarDatos();
        if (!datosRaw) return;

        const datosProcesados = procesarDatos(datosRaw);
        renderizarDashboard(datosProcesados);

        elementos.logoutBtn.addEventListener('click', cerrarSesion);

        // Inicializar funcionalidad de marketing
        initMarketing();
    }

    init();
});