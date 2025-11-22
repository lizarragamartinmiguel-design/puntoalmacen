import com.parse.Parse;
import com.parse.ParseObject;

public class DatabaseConfig {
    
    public static void initialize() {
        // Configurar Parse con tus llaves de Back4App
        Parse.initialize(new Parse.Configuration.Builder(this)
            .applicationId("sbbQLlkupAVhCVM3ZYz29GD18w4PeZa9em3brji9") // Application ID
            .clientKey("SKf9BSkUI4OjxBNYtIY99Gda7TuxOCzcEgsbi2st") // Client Key
            .server("https://parseapi.back4app.com/") // Server URL de Back4App
            .build()
        );
        
        // Registrar tus clases (tablas)
        ParseObject.registerSubclass(Producto.class);
        ParseObject.registerSubclass(Pedido.class);
        ParseObject.registerSubclass(Configuracion.class);
    }
}