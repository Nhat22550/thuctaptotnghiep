package com.rainbowforest.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

@Configuration
public class AiConfig {

    public record OrderRequest(String productName, int quantity) {}

    @Bean
    @Description("Tạo đơn hàng mới và trả về đường link thanh toán VNPAY giả lập cho khách hàng. Function này PHẢI được gọi khi khách hàng đồng ý chốt đơn mua xe điện.")
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
