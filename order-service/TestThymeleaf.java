import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

public class TestThymeleaf {
    public static void main(String[] args) {
        try {
            ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
            resolver.setPrefix("templates/");
            resolver.setSuffix(".html");
            resolver.setTemplateMode("HTML");
            
            TemplateEngine engine = new TemplateEngine();
            engine.setTemplateResolver(resolver);
            
            Context context = new Context();
            // Dummy order
            context.setVariable("order", new DummyOrder());
            
            String result = engine.process("invoice-template", context);
            System.out.println("SUCCESS. Length: " + result.length());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static class DummyOrder {
        public Long getId() { return 1L; }
        public String getReceiverName() { return "Test"; }
        public String getPhoneNumber() { return "123"; }
        public String getShippingAddress() { return "Address"; }
        public LocalDate getOrderedDate() { return LocalDate.now(); }
        public String getPaymentMethod() { return "VNPAY"; }
        public BigDecimal getTotal() { return new BigDecimal("100000"); }
        public List<Object> getItems() { return new ArrayList<>(); }
    }
}
