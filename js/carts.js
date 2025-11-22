class CartService {
    constructor() {
        this.carrito = this.cargarCarrito();
        this.COSTO_ENVIO_NORMAL = 800;
        this.MINIMO_ENVIO_GRATIS = 10000;
    }

    cargarCarrito() {
        try {
            return JSON.parse(localStorage.getItem('carritoPuntoAlmacen')) || [];
        } catch (error) {
            console.error('Error cargando carrito:', error);
            return [];
        }
    }

    guardarCarrito() {
        try {
            localStorage.setItem('carritoPuntoAlmacen', JSON.stringify(this.carrito));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    }

    agregarProducto(producto) {
        const existente = this.carrito.find(item => item.id === producto.id);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.actualizarUI();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }

    eliminarProducto(id) {
        const producto = this.carrito.find(item => item.id === id);
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarUI();
        
        if (producto) {
            this.mostrarNotificacion(`${producto.nombre} eliminado del carrito`);
        }
    }

    actualizarCantidad(id, nuevaCantidad) {
        const item = this.carrito.find(item => item.id === id);
        if (item) {
            if (nuevaCantidad <= 0) {
                this.eliminarProducto(id);
            } else {
                item.cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.actualizarUI();
            }
        }
    }

    limpiarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarUI();
        this.mostrarNotificacion('Carrito vaciado');
    }

    getTotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    getCantidadTotal() {
        return this.carrito.reduce((total, item) => total + item.cantidad, 0);
    }

    // 🔥 NUEVO: Calcular costo de envío
    getCostoEnvio() {
        const subtotal = this.getTotal();
        
        if (subtotal >= this.MINIMO_ENVIO_GRATIS || subtotal === 0) {
            return 0;
        }
        return this.COSTO_ENVIO_NORMAL;
    }

    // 🔥 NUEVO: Obtener total con envío
    getTotalConEnvio() {
        return this.getTotal() + this.getCostoEnvio();
    }

    // 🔥 NUEVO: Calcular cuánto falta para envío gratis
    getFaltanteEnvioGratis() {
        const subtotal = this.getTotal();
        if (subtotal >= this.MINIMO_ENVIO_GRATIS) {
            return 0;
        }
        return this.MINIMO_ENVIO_GRATIS - subtotal;
    }

    // 🔥 NUEVO: Verificar si aplica envío gratis
    aplicaEnvioGratis() {
        return this.getTotal() >= this.MINIMO_ENVIO_GRATIS;
    }

    actualizarUI() {
        // Actualizar contador del carrito
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            const total = this.getCantidadTotal();
            contador.textContent = total;
            contador.style.display = total > 0 ? 'flex' : 'none';
        }

        // Actualizar display de envío y totales
        this.actualizarDisplayEnvio();
        
        // Actualizar lista de productos en el modal
        this.actualizarListaCarrito();
    }

    // 🔥 NUEVO: Actualizar la interfaz de envío
    actualizarDisplayEnvio() {
        const envioElement = document.getElementById('costo-envio');
        const envioGratisElement = document.getElementById('envio-gratis-msg');
        const subtotalElement = document.getElementById('subtotal-carrito');
        const totalElement = document.getElementById('total-carrito');
        
        const subtotal = this.getTotal();
        const envio = this.getCostoEnvio();
        const totalConEnvio = this.getTotalConEnvio();

        // Actualizar subtotal
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal}`;
        }

        // Actualizar envío
        if (envioElement) {
            if (envio === 0 && subtotal > 0) {
                envioElement.textContent = 'GRATIS';
                envioElement.className = 'text-success fw-bold';
            } else {
                envioElement.textContent = `$${envio}`;
                envioElement.className = '';
            }
        }

        // Actualizar mensaje de envío gratis
        if (envioGratisElement) {
            const faltante = this.getFaltanteEnvioGratis();
            if (faltante > 0 && subtotal > 0) {
                envioGratisElement.innerHTML = `¡Faltan <span class="text-success fw-bold">$${faltante}</span> para ENVÍO GRATIS!`;
                envioGratisElement.style.display = 'block';
            } else {
                envioGratisElement.style.display = 'none';
            }
        }

        // Actualizar total
        if (totalElement) {
            totalElement.textContent = `$${totalConEnvio}`;
        }
    }

    // 🔥 NUEVO: Actualizar lista de productos en el modal
    actualizarListaCarrito() {
        const listaCarrito = document.getElementById('listaCarrito');
        if (!listaCarrito) return;

        if (this.carrito.length === 0) {
            listaCarrito.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">Tu carrito está vacío</p>
                    <button class="btn btn-outline-primary mt-2" onclick="cerrarModal('modalCarrito')">
                        Seguir comprando
                    </button>
                </div>
            `;
            return;
        }

        listaCarrito.innerHTML = this.carrito.map(item => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.imagen}" alt="${item.nombre}" 
                                 class="img-fluid rounded" 
                                 onerror="this.src='https://via.placeholder.com/80x80/25D366/ffffff?text=P'">
                        </div>
                        <div class="col-6">
                            <h6 class="mb-1">${item.nombre}</h6>
                            <p class="mb-1 text-success">$${item.precio} c/u</p>
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary" type="button" 
                                        onclick="cart.actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                                <input type="number" class="form-control text-center" 
                                       value="${item.cantidad}" min="1"
                                       onchange="cart.actualizarCantidad(${item.id}, parseInt(this.value))">
                                <button class="btn btn-outline-secondary" type="button" 
                                        onclick="cart.actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                            </div>
                        </div>
                        <div class="col-3 text-end">
                            <p class="fw-bold mb-1">$${item.precio * item.cantidad}</p>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="cart.eliminarProducto(${item.id})">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 🔥 NUEVO: Mostrar notificaciones
    mostrarNotificacion(mensaje) {
        // Crear notificación si no existe
        let notificacion = document.getElementById('notificacion-carrito');
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.id = 'notificacion-carrito';
            notificacion.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #25D366;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                font-weight: bold;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;
            document.body.appendChild(notificacion);
        }

        notificacion.textContent = mensaje;
        notificacion.style.transform = 'translateX(0)';

        // Ocultar después de 3 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(400px)';
        }, 3000);
    }

    // 🔥 NUEVO: Generar mensaje de WhatsApp con envío
    generarMensajeWhatsApp(infoCliente = {}) {
        const subtotal = this.getTotal();
        const envio = this.getCostoEnvio();
        const total = this.getTotalConEnvio();
        
        let mensaje = `¡Hola! Quiero hacer este pedido:\n\n`;
        
        this.carrito.forEach(item => {
            mensaje += `➡ ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}\n`;
        });
        
        mensaje += `\n📦 Subtotal: $${subtotal}`;
        
        if (envio === 0 && subtotal > 0) {
            mensaje += `\n🚚 Envío: GRATIS`;
        } else if (envio > 0) {
            mensaje += `\n🚚 Envío: $${envio}`;
        }
        
        mensaje += `\n💵 Total: $${total}`;
        
        // Mensaje de envío gratis
        if (subtotal < this.MINIMO_ENVIO_GRATIS && subtotal > 0) {
            const faltante = this.getFaltanteEnvioGratis();
            mensaje += `\n\n🎉 ¡Faltan $${faltante} para ENVÍO GRATIS!`;
        }
        
        // Información del cliente
        if (infoCliente.nombre) {
            mensaje += `\n\n👤 Cliente: ${infoCliente.nombre}`;
        }
        if (infoCliente.telefono) {
            mensaje += `\n📞 Teléfono: ${infoCliente.telefono}`;
        }
        if (infoCliente.direccion) {
            mensaje += `\n📍 Dirección: ${infoCliente.direccion}`;
        } else {
            mensaje += `\n\n📍 Dirección de envío: [COMPLETAR]`;
        }
        
        mensaje += `\n\n¡Gracias!`;
        
        return encodeURIComponent(mensaje);
    }

    // 🔥 NUEVO: Enviar pedido por WhatsApp
    enviarPorWhatsApp() {
        const modalCliente = document.getElementById('modalInfoCliente');
        if (modalCliente) {
            // Mostrar modal para datos del cliente primero
            modalCliente.style.display = 'block';
        } else {
            // Enviar directamente si no hay modal
            const mensaje = this.generarMensajeWhatsApp();
            const whatsappURL = `https://wa.me/5491112345678?text=${mensaje}`;
            window.open(whatsappURL, '_blank');
        }
    }

    // 🔥 NUEVO: Confirmar pedido con datos del cliente
    confirmarPedidoConCliente() {
        const nombre = document.getElementById('clienteNombre')?.value || '';
        const telefono = document.getElementById('clienteTelefono')?.value || '';
        const direccion = document.getElementById('clienteDireccion')?.value || '';
        
        const infoCliente = { nombre, telefono, direccion };
        const mensaje = this.generarMensajeWhatsApp(infoCliente);
        const whatsappURL = `https://wa.me/5491112345678?text=${mensaje}`;
        
        // Cerrar modal
        const modalCliente = document.getElementById('modalInfoCliente');
        if (modalCliente) {
            modalCliente.style.display = 'none';
        }
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Opcional: limpiar carrito después de enviar
        // this.limpiarCarrito();
    }

    // Enviar pedido a Back4App (mantener existente)
    async enviarPedido(infoCliente) {
        try {
            const pedidoData = {
                cliente: infoCliente.nombre || 'Cliente Web',
                telefono: infoCliente.telefono || 'No especificado',
                direccion: infoCliente.direccion || 'No especificada',
                productos: this.carrito,
                subtotal: this.getTotal(),
                envio: this.getCostoEnvio(),
                total: this.getTotalConEnvio(),
                estado: 'pendiente',
                fecha: new Date().toISOString()
            };

            const resultado = await back4app.crearPedido(pedidoData);
            
            if (resultado) {
                this.limpiarCarrito();
                return { success: true, id: resultado.id };
            } else {
                return { success: false, error: 'Error creando pedido' };
            }
        } catch (error) {
            console.error('Error enviando pedido:', error);
            return { success: false, error: error.message };
        }
    }
}

// Instancia global del carrito
const cart = new CartService();

// 🔥 NUEVO: Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cart.actualizarUI();
    
    // Agregar evento para el botón de WhatsApp
    const btnWhatsApp = document.getElementById('btnEnviarWhatsApp');
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', function() {
            cart.enviarPorWhatsApp();
        });
    }
});

// 🔥 NUEVO: Función para cerrar modales
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 🔥 NUEVO: Función para abrir el carrito
function abrirCarrito() {
    const modal = document.getElementById('modalCarrito');
    if (modal) {
        modal.style.display = 'block';
        cart.actualizarUI();
    }
}