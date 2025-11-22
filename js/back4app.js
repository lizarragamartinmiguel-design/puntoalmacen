// Configuración Back4App
class Back4AppService {
    constructor() {
        this.initialized = false;
        this.config = {
            appId: '',
            javascriptKey: '',
            serverURL: 'https://parseapi.back4app.com/'
        };
    }

    // Inicializar Parse SDK
    init(config) {
        if (this.initialized) return;
        
        this.config = { ...this.config, ...config };
        Parse.initialize(this.config.appId, this.config.javascriptKey);
        Parse.serverURL = this.config.serverURL;
        this.initialized = true;
        
        console.log('✅ Back4App inicializado');
    }

    // ========== PRODUCTOS ==========
    
    // Obtener todos los productos
    async getProductos() {
        try {
            const Productos = Parse.Object.extend('Productos');
            const query = new Parse.Query(Productos);
            query.equalTo('activo', true);
            query.ascending('nombre');
            
            const results = await query.find();
            return results.map(item => this.parseToJSON(item));
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            throw error;
        }
    }

    // Obtener productos por categoría
    async getProductosPorCategoria(categoria) {
        try {
            const Productos = Parse.Object.extend('Productos');
            const query = new Parse.Query(Productos);
            query.equalTo('categoria', categoria);
            query.equalTo('activo', true);
            
            const results = await query.find();
            return results.map(item => this.parseToJSON(item));
        } catch (error) {
            console.error('Error obteniendo productos por categoría:', error);
            throw error;
        }
    }

    // Crear nuevo producto
    async crearProducto(productoData) {
        try {
            const Productos = Parse.Object.extend('Productos');
            const producto = new Productos();
            
            // Asignar propiedades
            Object.keys(productoData).forEach(key => {
                producto.set(key, productoData[key]);
            });
            
            producto.set('activo', true);
            const result = await producto.save();
            return this.parseToJSON(result);
        } catch (error) {
            console.error('Error creando producto:', error);
            throw error;
        }
    }

    // Actualizar producto
    async actualizarProducto(id, updates) {
        try {
            const Productos = Parse.Object.extend('Productos');
            const query = new Parse.Query(Productos);
            const producto = await query.get(id);
            
            Object.keys(updates).forEach(key => {
                producto.set(key, updates[key]);
            });
            
            const result = await producto.save();
            return this.parseToJSON(result);
        } catch (error) {
            console.error('Error actualizando producto:', error);
            throw error;
        }
    }

    // Eliminar producto (soft delete)
    async eliminarProducto(id) {
        try {
            const Productos = Parse.Object.extend('Productos');
            const query = new Parse.Query(Productos);
            const producto = await query.get(id);
            
            producto.set('activo', false);
            await producto.save();
            return true;
        } catch (error) {
            console.error('Error eliminando producto:', error);
            throw error;
        }
    }

    // ========== PEDIDOS ==========
    
    // Crear nuevo pedido
    async crearPedido(pedidoData) {
        try {
            const Pedidos = Parse.Object.extend('Pedidos');
            const pedido = new Pedidos();
            
            Object.keys(pedidoData).forEach(key => {
                pedido.set(key, pedidoData[key]);
            });
            
            pedido.set('estado', 'pendiente');
            pedido.set('fecha', new Date().toLocaleString('es-AR'));
            pedido.set('timestamp', Date.now());
            
            const result = await pedido.save();
            return this.parseToJSON(result);
        } catch (error) {
            console.error('Error creando pedido:', error);
            throw error;
        }
    }

    // Obtener todos los pedidos
    async getPedidos() {
        try {
            const Pedidos = Parse.Object.extend('Pedidos');
            const query = new Parse.Query(Pedidos);
            query.descending('timestamp');
            
            const results = await query.find();
            return results.map(item => this.parseToJSON(item));
        } catch (error) {
            console.error('Error obteniendo pedidos:', error);
            throw error;
        }
    }

    // Actualizar estado del pedido
    async actualizarEstadoPedido(id, nuevoEstado) {
        try {
            const Pedidos = Parse.Object.extend('Pedidos');
            const query = new Parse.Query(Pedidos);
            const pedido = await query.get(id);
            
            pedido.set('estado', nuevoEstado);
            const result = await pedido.save();
            return this.parseToJSON(result);
        } catch (error) {
            console.error('Error actualizando pedido:', error);
            throw error;
        }
    }

    // ========== CONFIGURACIÓN ==========
    
    // Obtener configuración
    async getConfiguracion() {
        try {
            const Configuracion = Parse.Object.extend('Configuracion');
            const query = new Parse.Query(Configuracion);
            
            const results = await query.find();
            return results.length > 0 ? this.parseToJSON(results[0]) : null;
        } catch (error) {
            console.error('Error obteniendo configuración:', error);
            throw error;
        }
    }

    // Guardar configuración
    async guardarConfiguracion(configData) {
        try {
            const Configuracion = Parse.Object.extend('Configuracion');
            const query = new Parse.Query(Configuracion);
            
            let config = await query.first();
            if (!config) {
                config = new Configuracion();
            }
            
            Object.keys(configData).forEach(key => {
                config.set(key, configData[key]);
            });
            
            const result = await config.save();
            return this.parseToJSON(result);
        } catch (error) {
            console.error('Error guardando configuración:', error);
            throw error;
        }
    }

    // ========== UTILIDADES ==========
    
    // Convertir Parse Object a JSON
    parseToJSON(parseObject) {
        if (!parseObject) return null;
        
        const json = parseObject.toJSON();
        json.id = parseObject.id;
        return json;
    }

    // Verificar conexión
    async testConnection() {
        try {
            await this.getProductos();
            return true;
        } catch (error) {
            console.error('Error de conexión con Back4App:', error);
            return false;
        }
    }
}

// Instancia global
const back4app = new Back4AppService();