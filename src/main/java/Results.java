// TODO СДЕЛАТЬ АЙДИ У СЕССИЙ
import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;

@ManagedBean(name = "results")
@SessionScoped
public class Results implements Serializable {
    private List<ResultRow> cachedResults = new LinkedList<ResultRow>();
    private double x;
    private double y;
    private double r;
    private boolean match;
    private boolean debugNotFucked = true;
    private final String sessionId = FacesContext.getCurrentInstance().getExternalContext()
            .getSessionId(false);


    @ManagedProperty(value = "#{database.db}")
    private Connection connection;


    @PostConstruct
    public void getAllResultsFromDb(){
        String query = String.format("SELECT * FROM RESULTS WHERE sessionId = '%s';", sessionId);
        ResultSet resultSet;

        try {
            Statement statement = connection.createStatement();
            resultSet = statement.executeQuery(query);

            while(resultSet.next()){
                ResultRow newResult = new ResultRow();
                newResult.setMatch(resultSet.getBoolean("match"));
                newResult.setX(resultSet.getDouble("x"));
                newResult.setY(resultSet.getDouble("y"));
                newResult.setR(resultSet.getDouble("r"));
                cachedResults.add(newResult);
            }
            resultSet.close();

        } catch (SQLException e) {
            e.printStackTrace();
            if (debugNotFucked) {
                createTable();
            }
            debugNotFucked = false;
        }

    }


    public void insertResult(){
        Locale.setDefault(Locale.US);
        match = areaCheck(x, y, r);
        ResultRow newResult = new ResultRow(x, y, r , match);
        cachedResults.add(newResult);

        String query = String.format("INSERT INTO RESULTS VALUES\n" +
                        "(default, %b, %f, %f, %f, '%s');",
                match, x, y, r, sessionId);
        System.out.println(query);
        try {
            Statement statement = connection.createStatement();
            statement.execute(query);

        } catch (SQLException e) {
            e.printStackTrace();
            if (debugNotFucked) {
                createTable();
                insertResult();
            }
            debugNotFucked = false;
        }

    }

    public void createTable(){
        String query = "CREATE TABLE RESULTS (\n" +
                "id serial PRIMARY KEY,\n" +
                "match boolean,\n" +
                "x real,\n" +
                "y real,\n" +
                "r real,\n" +
                "sessionId text);";
        try {
            Statement statement = connection.createStatement();
            statement.execute(query);

        } catch (SQLException e) {
            //e.printStackTrace();
        }
    }

    public boolean areaCheck(double x, double y, double r) {
        if (x >= 0 && y >= 0) {
            if (y <= r && x <= (r / 2)) {
                return true;
            }
        }

        if (x <= 0 && y <= 0) {
            if (Math.abs(y + x) < r / 2) {
                return true;
            }
        }

        if (x >= 0 && y <= 0) {
            if ((x * x + y * y) <= r * r) {
                return true;
            }
        }
        return false;
    }

    public Connection getConnection() {
        return connection;
    }

    public void setConnection(Connection connection) {
        this.connection = connection;
    }


    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public boolean getMatch() {
        return match;
    }

    public void setMatch(boolean match) {
        this.match = match;
    }

    public List<ResultRow> getCachedResults() {
        return cachedResults;
    }

    public void setCachedResults(List<ResultRow> cachedResults) {
        this.cachedResults = cachedResults;
    }
}
