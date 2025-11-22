import com.parse.ParseClassName;
import com.parse.ParseObject;
import java.util.List;

@ParseClassName("Pedido")
public class Pedido extends ParseObject {
    
    public Pedido() {
        super();
    }
    
    public String getCliente() {
        return getString("cliente");
    }
    
    public void setCliente(String cliente) {
        put("cliente", cliente);
    }
    
    public String getTelefono() {
        return getString("telefono");
    }
    
    public void setTelefono(String telefono) {
        put("telefono", telefono);
    }
    
    public List<String> getProductos() {
        return getList("productos");
    }
    
    public void setProductos(List<String> productos) {
        put("productos", productos);
    }
    
    public double getTotal() {
        return getDouble("total");
    }
    
    public void setTotal(double total) {
        put("total", total);
    }
    
    public String getEstado() {
        return getString("estado");
    }
    
    public void setEstado(String estado) {
        put("estado", estado);
    }
    
    public String getDireccion() {
        return getString("direccion");
    }
    
    public void setDireccion(String direccion) {
        put("direccion", direccion);
    }
    
    public String getFecha() {
        return getString("fecha");
    }
    
    public void setFecha(String fecha) {
        put("fecha", fecha);
    }
}