package com.rainbowforest.notificationservice.messaging;

import com.rainbowforest.notificationservice.config.RabbitMQConfig;
import com.rainbowforest.notificationservice.domain.EmailLog;
import com.rainbowforest.notificationservice.dto.OrderCompletedEvent;
import com.rainbowforest.notificationservice.repository.EmailLogRepository;
import com.rainbowforest.notificationservice.service.EmailService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationConsumer {

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailLogRepository emailLogRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consumeOrderCompleted(OrderCompletedEvent event) {
        System.out.println("Received order.completed event for Order ID: " + event.getOrderId());

        EmailLog emailLog = EmailLog.builder()
                .orderId(event.getOrderId())
                .recipientEmail(event.getRecipientEmail())
                .subject("Xác nhận đơn hàng #" + event.getOrderId() + " - NHẬT EV")
                .status("PENDING")
                .sentAt(LocalDateTime.now())
                .build();
        
        emailLog = emailLogRepository.save(emailLog);

        try {
            emailService.sendOrderInvoiceEmail(
                    event.getRecipientEmail(),
                    event.getCustomerName(),
                    event.getOrderId(),
                    event.getPdfBase64()
            );

            EmailLog log = EmailLog.builder()
                    .orderId(event.getOrderId())
                    .recipientEmail(event.getRecipientEmail())
                    .status("SUCCESS")
                    .build();
            emailLogRepository.save(log);

            System.out.println("Successfully sent email for Order ID: " + event.getOrderId());
            try {
                java.nio.file.Files.writeString(java.nio.file.Paths.get("notification_success.log"), "Sent to " + event.getRecipientEmail());
            } catch(Exception ignored) {}
        } catch (Exception e) {
            System.err.println("Failed to send email for Order ID: " + event.getOrderId() + " Error: " + e.getMessage());
            
            try {
                java.nio.file.Files.writeString(java.nio.file.Paths.get("notification_error.log"), "Error for order " + event.getOrderId() + ": " + e.getMessage());
            } catch(Exception ignored) {}

            EmailLog log = EmailLog.builder()
                    .orderId(event.getOrderId())
                    .recipientEmail(event.getRecipientEmail())
                    .status("FAILED")
                    .errorMessage(e.getMessage())
                    .build();
            emailLogRepository.save(log);
        }
    }
}
