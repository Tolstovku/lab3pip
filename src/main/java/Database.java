import javax.annotation.PostConstruct;
import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@ManagedBean(name = "database")
@ApplicationScoped
public class Database implements Serializable {
    public static final String url = "jdbc:postgresql://127.0.0.1:5432/pip";
    public static final String USERNAME = "postgres";
    public static final String PASSWORD = "xna004";
    Connection conn;
    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    @PostConstruct
    public void init() {
        try {
            conn = DriverManager.getConnection(url, USERNAME, PASSWORD);
            conn.setAutoCommit(true);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    public Connection getDb() {
        return conn;
    }

    public void setDb(Connection conn) {
        this.conn = conn;
    }
}
