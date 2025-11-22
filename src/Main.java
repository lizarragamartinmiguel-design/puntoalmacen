import com.parse.ParseException;
import com.parse.ParseQuery;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Inicializar la base de datos
        DatabaseConfig.initialize();
        
        // Crear y guardar un producto
        Producto producto = new Producto();
        producto.setNombre("Laptop Gaming");
        producto.setPrecio(1200.99);
        producto.setCategoria("Tecnología");
        producto.setStock(10);
        producto.setDestacado(true);
        
        try {
            producto.save();
            System.out.println("Producto guardado en Back4App!");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        
        // Consultar productos
        try {
            ParseQuery<Producto> query = ParseQuery.getQuery(Producto.class);
            query.whereEqualTo("destacado", true);
            List<Producto> productos = query.find();
            
            for (Producto prod : productos) {
                System.out.println("Producto: " + prod.getNombre() + " - $" + prod.getPrecio());
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }
}