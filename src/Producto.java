import com.parse.ParseClassName;
import com.parse.ParseObject;

@ParseClassName("Producto")
public class Producto extends ParseObject {
    
    // Constructor vacío requerido por Parse
    public Producto() {
        super();
    }
    
    // Getters y Setters usando métodos de Parse
    public String getNombre() {
        return getString("nombre");
    }
    
    public void setNombre(String nombre) {
        put("nombre", nombre);
    }
    
    public double getPrecio() {
        return getDouble("precio");
    }
    
    public void setPrecio(double precio) {
        put("precio", precio);
    }
    
    public String getCategoria() {
        return getString("categoria");
    }
    
    public void setCategoria(String categoria) {
        put("categoria", categoria);
    }
    
    public String getImagen() {
        return getString("imagen");
    }
    
    public void setImagen(String imagen) {
        put("imagen", imagen);
    }
    
    public String getDescripcion() {
        return getString("descripcion");
    }
    
    public void setDescripcion(String descripcion) {
        put("descripcion", descripcion);
    }
    
    public boolean getDestacado() {
        return getBoolean("destacado");
    }
    
    public void setDestacado(boolean destacado) {
        put("destacado", destacado);
    }
    
    public int getStock() {
        return getInt("stock");
    }
    
    public void setStock(int stock) {
        put("stock", stock);
    }
    
    // Validación
    public boolean esValido() {
        return getNombre() != null && !getNombre().trim().isEmpty() &&
               getPrecio() >= 0;
    }
}