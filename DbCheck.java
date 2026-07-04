import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheck {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://dpg-d8pq59jtqb8s738ei6f0-a.singapore-postgres.render.com:5432/notification_db";
        String user = "nhat_db_server_msfu_user";
        String password = "FiHPWRw3srvSHJ7LA2KvVpYAMYV8zWCG";

        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM email_logs ORDER BY id DESC LIMIT 5");
            while (rs.next()) {
                System.out.println("ID: " + rs.getLong("id") + ", Order: " + rs.getLong("order_id") + 
                                   ", Status: " + rs.getString("status") + ", Error: " + rs.getString("error_message") + ", Email: " + rs.getString("recipient_email"));
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
