# Configuración Back4App para PuntoAlmacen

## 1. Crear App en Back4App
1. Ve a https://www.back4app.com
2. Crea cuenta o inicia sesión
3. Click en "Create New App"
4. Elige "Database" → "Create New App"
5. Nombre: `puntoalmacen`

## 2. Configurar Classes (Tablas)

### Class: Productos
- Columns:
  - `nombre` (String)
  - `precio` (Number)
  - `categoria` (String)
  - `imagen` (String)
  - `descripcion` (String)
  - `destacado` (Boolean)
  - `stock` (Number)
  - `talles` (Array)
  - `garantia` (String)
  - `activo` (Boolean)

### Class: Pedidos
- Columns:
  - `cliente` (String)
  - `telefono` (String)
  - `productos` (Array)
  - `total` (Number)
  - `estado` (String)
  - `direccion` (String)
  - `fecha` (String)
  - `timestamp` (Number)

### Class: Configuracion
- Columns:
  - `nombreTienda` (String)
  - `whatsapp` (String)
  - `direccion` (String)
  - `horarios` (String)
  - `mensajeWhatsApp` (String)

## 3. Obtener Credenciales
Ve a: App Settings → Security & Keys
- Application ID
- JavaScript Key
- REST API Key

## 4. Configurar Permisos
Para cada class:
- CLP (Class Level Permissions):
  - Productos: Public READ, Admin WRITE
  - Pedidos: Public CREATE, Admin READ/WRITE
  - Configuracion: Public READ, Admin WRITE