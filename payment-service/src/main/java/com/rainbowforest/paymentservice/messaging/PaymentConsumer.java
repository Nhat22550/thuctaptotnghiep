package com.rainbowforest.paymentservice.messaging;

import com.rainbowforest.paymentservice.config.RabbitMQConfig;
import com.rainbowforest.paymentservice.dto.SagaEvent;
import com.rainbowforest.paymentservice.entity.Payment;
import com.rainbowforest.paymentservice.service.PaymentService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentConsumer {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentPublisher paymentPublisher;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consume(SagaEvent event) {
        System.out.println("Received event in Payment: " + event.getStatus() + " for Order ID: " + event.getOrderId());

        if ("INVENTORY_RESERVED".equals(event.getStatus())) {
            try {
                // Xử lý thanh toán VNPAY (Mô phỏng)
                // Trong thực tế, bạn sẽ tạo link thanh toán, gửi cho frontend, và đợi VNPAY IPN gọi lại.
                
                // MÔ PHỎNG LỖI: Luôn ném ra Exception để test Rollback
                boolean simulateError = false;
                if (simulateError) {
                    throw new RuntimeException("Simulated Payment Error: Ngân hàng từ chối giao dịch!");
                }
                
                // Ở đây mô phỏng xử lý thành công.
                
                Payment payment = new Payment();
                payment.setOrderId(event.getOrderId());
                payment.setAmount(event.getAmount() != null ? event.getAmount().doubleValue() : 0.0);
                payment.setPaymentMethod("VNPAY");
                payment.setStatus("SUCCESS");
                payment.setPaymentDate(LocalDateTime.now());
                payment.setTransactionNo("TXN" + System.currentTimeMillis());
                
                paymentService.savePayment(payment);
                System.out.println("Payment processed successfully for Order ID: " + event.getOrderId());

                paymentPublisher.publishPaymentCompleted(event);
            } catch (Exception e) {
                e.printStackTrace();
                event.setMessage(e.getMessage());
                paymentPublisher.publishPaymentFailed(event);
            }
        }
    }
}
