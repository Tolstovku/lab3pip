import java.io.Serializable;

public class ResultRow implements Serializable {

    public ResultRow(Double x, Double y, Double r, Boolean match) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.match = match;
    }

    public ResultRow() {
    }

    private Double x, y, r;
    private Boolean match;

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public Boolean getMatch() {
        return match;
    }

    public String getMatchAsHitOrMiss() {
        return match ? "Hit" : "Miss";
    }

    public void setMatch(Boolean match) {
        this.match = match;
    }
}
