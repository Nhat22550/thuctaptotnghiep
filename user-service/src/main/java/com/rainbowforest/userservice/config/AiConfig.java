package com.rainbowforest.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

@Configuration
public class AiConfig {

    public record OrderRequest(
        @JsonProperty(required = true, value = "productName") @JsonPropertyDescription("Tên của mẫu xe điện khách hàng muốn mua") String productName, 
        @JsonProperty(required = true, value = "quantity") @JsonPropertyDescription("Số lượng xe khách hàng muốn mua") int quantity
    ) {}


    @Bean
    @Description("Dùng để tạo link thanh toán VNPAY. CHỈ gọi 1 lần duy nhất khi khách đã đồng ý chốt đơn.")
    public Function<OrderRequest, String> createOrderFunction() {
        return request -> {
            // Giả lập tính toán đơn giá (Giả sử mặc định 50,000,000 VND / xe)
            long amount = request.quantity() * 50000000L;
            
            // Xử lý chuỗi tên sản phẩm để đưa vào URL
            String safeProductName = request.productName() != null ? request.productName().replace(" ", "+") : "Xe+Dien";
            
            // Giả lập đường link thanh toán VNPAY
            return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=" + amount 
                    + "&vnp_Command=pay&vnp_OrderInfo=Thanh+toan+don+hang+" + safeProductName;
        };
    }
}
