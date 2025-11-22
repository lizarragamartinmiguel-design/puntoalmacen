class PuntoAlmacenApp {
    constructor() {
        this.productos = [];
        this.config = {};
        this.filtroActual = 'todos';
        this.terminoBusqueda = '';
    }

    async init() {
        try {
            // Inicializar Back4App
            await this.inicializarBack4App();
            
            // Cargar datos
            await this.cargarDatosIniciales();
            
            // Inicializar eventos
            this.inicializarEventos();
            
            // Cargar productos
            await this.cargarProductos();
            
            console.log('✅ PuntoAlmacen App inicializada');
        } catch (error) {
            console.error('Error inicializando app:', error);
            this.mostrarError('Error cargando la tienda. Recarga la página.');
        }
    }

    async inicializarBack4App() {
        // Configuración Back4App - CON TUS CREDENCIALES REALES
        const config = {
            appId: 'sbbQLlkupAVhCVM3ZYz29GD18w4PeZa9em3brji9',
            javascriptKey: 'yLu8MFWZbeBVn1tTIBIUWXECaVLG81531xWul4Tk',
            serverURL: 'https://parseapi.back4app.com/'
        };
        
        back4app.init(config);
        
        // Verificar conexión
        const conectado = await back4app.testConnection();
        if (!conectado) {
            throw new Error('No se pudo conectar con Back4App');
        }

        // Test de conexión adicional
        await this.testBack4AppConnection();
    }

    async testBack4AppConnection() {
        try {
            console.log('🔗 Probando conexión con Back4App...');
            
            // Probar obteniendo productos
            const productos = await back4app.getProductos();
            console.log('✅ Conexión exitosa. Productos encontrados:', productos.length);
            
            // Crear configuración inicial si no existe
            const config = await back4app.getConfiguracion();
            if (!config) {
                const configInicial = {
                    nombreTienda: 'PuntoAlmacen',
                    whatsapp: '5493624840349',
                    direccion: 'Calle Falsa 123, Ciudad',
                    horarios: 'Lunes a Viernes 9-18 hs',
                    mensajeWhatsApp: 'Hola PuntoAlmacen, quiero hacer un pedido'
                };
                await back4app.guardarConfiguracion(configInicial);
                console.log('✅ Configuración inicial creada');
            }
            
        } catch (error) {
            console.error('❌ Error en test de conexión:', error);
            // No lanzamos error para no bloquear la app
        }
    }

    async cargarDatosIniciales() {
        try {
            // Cargar configuración
            this.config = await back4app.getConfiguracion() || {};
            this.actualizarConfiguracionUI();
            
            // Cargar banners
            this.cargarBannersPersonalizados();
            
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            // Usar configuración por defecto si hay error
            this.config = {
                nombreTienda: 'PuntoAlmacen',
                whatsapp: '5493624840349',
                direccion: 'Calle Falsa 123, Ciudad',
                horarios: 'Lunes a Viernes 9-18 hs'
            };
            this.actualizarConfiguracionUI();
        }
    }

    async cargarProductos() {
        try {
            this.mostrarLoading(true);
            
            if (this.filtroActual === 'todos') {
                this.productos = await back4app.getProductos();
            } else {
                this.productos = await back4app.getProductosPorCategoria(this.filtroActual);
            }
            
            this.renderizarProductos();
            this.mostrarLoading(false);
            
        } catch (error) {
            console.error('Error cargando productos:', error);
            this.mostrarError('Error cargando productos. Intenta recargar la página.');
            this.mostrarLoading(false);
            
            // Mostrar productos vacíos para que la interfaz no se rompa
            this.productos = [];
            this.renderizarProductos();
        }
    }

    renderizarProductos() {
        const secciones = {
            almacen: document.getElementById('almacen'),
            indumentaria: document.getElementById('indumentaria'),
            electro: document.getElementById('electro'),
            libreria: document.getElementById('libreria')
        };

        // Limpiar secciones
        Object.values(secciones).forEach(seccion => {
            if (seccion) seccion.innerHTML = '';
        });

        // Filtrar productos según búsqueda
        let productosFiltrados = this.productos;
        if (this.terminoBusqueda) {
            productosFiltrados = this.productos.filter(producto =>
                producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
                (producto.descripcion && producto.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase()))
            );
        }

        // Agrupar por categoría
        const productosPorCategoria = {};
        productosFiltrados.forEach(producto => {
            if (!productosPorCategoria[producto.categoria]) {
                productosPorCategoria[producto.categoria] = [];
            }
            productosPorCategoria[producto.categoria].push(producto);
        });

        // Ocultar todas las secciones primero
        document.querySelectorAll('.titulo-seccion').forEach(titulo => {
            titulo.style.display = 'none';
        });
        document.querySelectorAll('.grilla').forEach(grilla => {
            grilla.style.display = 'none';
        });

        // Renderizar en secciones
        Object.keys(productosPorCategoria).forEach(categoria => {
            const seccion = secciones[categoria];
            if (seccion) {
                seccion.style.display = 'grid';
                if (seccion.previousElementSibling) {
                    seccion.previousElementSibling.style.display = 'block';
                }
                
                productosPorCategoria[categoria].forEach(producto => {
                    const productoHTML = this.crearProductoHTML(producto);
                    seccion.innerHTML += productoHTML;
                });
            }
        });

        // Mostrar mensaje si no hay productos
        if (productosFiltrados.length === 0) {
            this.mostrarMensajeSinProductos();
        }
    }

    crearProductoHTML(producto) {
        // Verificar si tiene stock (usar 0 si no existe la propiedad)
        const sinStock = producto.stock === 0;
        
        return `
            <div class="producto-card">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}" 
                         onerror="this.src='https://via.placeholder.com/300x200/25D366/ffffff?text=Producto'" 
                         loading="lazy">
                    ${producto.destacado ? '<span class="badge-oferta">🔥 OFERTA</span>' : ''}
                    ${sinStock ? '<span class="badge-sin-stock">SIN STOCK</span>' : ''}
                </div>
                <h3>${producto.nombre}</h3>
                ${producto.talles && producto.talles.length > 0 ? 
                    `<p><small>Talles: ${producto.talles.join(', ')}</small></p>` : ''}
                ${producto.garantia ? `<p><small>🛡️ Garantía: ${producto.garantia}</small></p>` : ''}
                ${producto.descripcion ? `<p><small>${producto.descripcion}</small></p>` : ''}
                <div class="precio">$${producto.precio}</div>
                <button class="btn-agregar" data-id="${producto.id}" 
                        ${sinStock ? 'disabled' : ''}>
                    ${sinStock ? '❌ Sin stock' : '🛒 Agregar al carrito'}
                </button>
            </div>
        `;
    }

    inicializarEventos() {
        // Búsqueda
        const busqueda = document.getElementById('busqueda');
        if (busqueda) {
            busqueda.addEventListener('input', (e) => {
                this.terminoBusqueda = e.target.value;
                this.renderizarProductos();
            });
        }

        // Filtros
        const filtros = document.querySelectorAll('.btn-filtro');
        filtros.forEach(filtro => {
            filtro.addEventListener('click', () => {
                filtros.forEach(f => f.classList.remove('active'));
                filtro.classList.add('active');
                this.filtroActual = filtro.dataset.categoria;
                this.cargarProductos(); // Recargar desde Back4App
            });
        });

        // Delegación de eventos para botones "Agregar al carrito"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar') && !e.target.disabled) {
                const idProducto = e.target.dataset.id;
                const producto = this.productos.find(p => p.id === idProducto);
                if (producto) {
                    cart.agregarProducto(producto);
                    this.mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
                    
                    // Feedback visual del botón
                    const btn = e.target;
                    const originalText = btn.textContent;
                    btn.textContent = '✅ ¡Agregado!';
                    btn.style.background = '#128C7E';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '#25D366';
                    }, 1500);
                }
            }
        });

        // Botón admin
        const btnAdmin = document.getElementById('btnAdmin');
        if (btnAdmin) {
            btnAdmin.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }

        // Sincronización automática cada 30 segundos
        setInterval(() => {
            this.sincronizarDatos();
        }, 30000);
    }

    async sincronizarDatos() {
        try {
            // Recargar configuración y productos en background
            const nuevaConfig = await back4app.getConfiguracion();
            if (nuevaConfig && JSON.stringify(nuevaConfig) !== JSON.stringify(this.config)) {
                this.config = nuevaConfig;
                this.actualizarConfiguracionUI();
                console.log('🔄 Configuración actualizada desde Back4App');
            }
        } catch (error) {
            console.log('⚠️ Error en sincronización automática:', error);
        }
    }

    actualizarConfiguracionUI() {
        // Actualizar información de contacto
        if (this.config.whatsapp) {
            this.actualizarContactoWhatsApp(this.config.whatsapp);
        }

        // Actualizar nombre de la tienda
        if (this.config.nombreTienda) {
            const logoText = document.querySelector('.logo-text');
            if (logoText) logoText.textContent = this.config.nombreTienda;
        }

        // Actualizar footer
        if (this.config.horarios) {
            const footerInfo = document.getElementById('footer-info');
            if (footerInfo) {
                footerInfo.textContent = `© 2025 ${this.config.nombreTienda || 'PuntoAlmacen'} – Horarios: ${this.config.horarios}`;
            }
        }

        if (this.config.direccion) {
            const footerContacto = document.getElementById('footer-contacto');
            if (footerContacto) {
                const whatsapp = this.config.whatsapp || '5493624840349';
                footerContacto.innerHTML = `📍 ${this.config.direccion} – 
                    <a href="https://wa.me/${whatsapp}" rel="noopener">
                        WhatsApp: ${whatsapp}
                    </a>`;
            }
        }
    }

    actualizarContactoWhatsApp(telefono) {
        const enlacesWhatsApp = document.querySelectorAll('a[href*="wa.me"]');
        enlacesWhatsApp.forEach(enlace => {
            const hrefActual = enlace.href;
            const nuevoHref = hrefActual.replace(/wa\.me\/\d+/, `wa.me/${telefono}`);
            enlace.href = nuevoHref;
        });

        // Actualizar también el enlace flotante
        const btnWspFloat = document.querySelector('.btn-wsp-float');
        if (btnWspFloat) {
            btnWspFloat.href = `https://wa.me/${telefono}?text=Hola%20PuntoAlmacen,%20quiero%20hacer%20un%20pedido`;
        }

        // Actualizar enlace de oferta
        const btnOferta = document.querySelector('.btn-oferta');
        if (btnOferta) {
            btnOferta.href = `https://wa.me/${telefono}?text=Quiero%20la%20oferta%20del%20día`;
        }
    }

    cargarBannersPersonalizados() {
        // Los banners ahora se cargan desde la configuración de Back4App
        // Esta función se puede expandir según necesidades
        console.log('🎯 Banners personalizados cargados');
    }

    mostrarLoading(mostrar) {
        const loadings = document.querySelectorAll('.loading');
        loadings.forEach(loading => {
            loading.style.display = mostrar ? 'block' : 'none';
        });
    }

    mostrarError(mensaje) {
        this.mostrarNotificacion(mensaje, 'error');
    }

    mostrarNotificacion(mensaje, tipo = 'success') {
        // Eliminar notificación anterior si existe
        const notificacionAnterior = document.querySelector('.notificacion');
        if (notificacionAnterior) {
            document.body.removeChild(notificacionAnterior);
        }

        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        
        if (tipo === 'error') {
            notificacion.style.background = '#ff4444';
        } else if (tipo === 'warning') {
            notificacion.style.background = '#ff9800';
        }
        
        document.body.appendChild(notificacion);

        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 3000);
    }

    mostrarMensajeSinProductos() {
        const container = document.querySelector('.container');
        const mensajeExistente = document.querySelector('.sin-productos-global');
        
        if (!mensajeExistente) {
            const mensaje = document.createElement('div');
            mensaje.className = 'sin-productos sin-productos-global';
            mensaje.innerHTML = `
                <h3>😔 No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o cambia de categoría</p>
                <button class="btn-agregar" onclick="app.cargarProductos()" style="margin-top: 15px; max-width: 200px;">
                    Reintentar carga
                </button>
            `;
            container.appendChild(mensaje);
        }
    }
}

// Inicializar app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new PuntoAlmacenApp();
    await window.app.init();
});