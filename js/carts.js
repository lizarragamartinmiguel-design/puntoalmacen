class CartService {
    constructor() {
        this.carrito = this.cargarCarrito();
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
    }

    eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarUI();
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
    }

    getTotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    getCantidadTotal() {
        return this.carrito.reduce((total, item) => total + item.cantidad, 0);
    }

    actualizarUI() {
        // Actualizar contador
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            const total = this.getCantidadTotal();
            contador.textContent = total;
            contador.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    // Enviar pedido a Back4App
    async enviarPedido(infoCliente) {
        try {
            const pedidoData = {
                cliente: infoCliente.nombre || 'Cliente Web',
                telefono: infoCliente.telefono || 'No especificado',
                direccion: infoCliente.direccion || 'No especificada',
                productos: this.carrito,
                total: this.getTotal(),
                estado: 'pendiente'
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

// Instancia global
const cart = new CartService();