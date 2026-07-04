package com.rainbowforest.orderservice.messaging;

import com.rainbowforest.orderservice.config.RabbitMQConfig;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.dto.SagaEvent;
import com.rainbowforest.orderservice.repository.OrderRepository;
import com.rainbowforest.orderservice.dto.OrderCompletedEvent;
import com.rainbowforest.orderservice.service.PdfGenerationService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderConsumer {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Transactional
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consume(SagaEvent event) {
        System.out.println("Received event for Order ID: " + event.getOrderId() + ", status: " + event.getStatus());
        
        Optional<Order> orderOptional = orderRepository.findById(event.getOrderId());
        if (!orderOptional.isPresent()) return;
        
        Order order = orderOptional.get();

        switch (event.getStatus()) {
            case "PAYMENT_COMPLETED":
                order.setStatus("PAID");
                orderRepository.save(order);
                System.out.println("Order ID " + event.getOrderId() + " updated to PAID.");

                try {
                    // Generate PDF
                    byte[] pdfBytes = pdfGenerationService.generateInvoicePdf(order);
                    String pdfBase64 = Base64.getEncoder().encodeToString(pdfBytes);

                    // Publish order.completed event for notification-service
                    OrderCompletedEvent orderCompletedEvent = OrderCompletedEvent.builder()
                            .orderId(order.getId())
                            .recipientEmail(order.getUser().getUserName())
                            .customerName(order.getReceiverName() != null ? order.getReceiverName() : "Quý khách")
                            .pdfBase64(pdfBase64)
                            .build();

                    rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "order.completed", orderCompletedEvent);
                    System.out.println("Published order.completed event for Order ID: " + order.getId());
                } catch (Exception e) {
                    System.err.println("Failed to generate PDF or publish order.completed event: " + e.getMessage());
                    e.printStackTrace();
                }
                break;
            case "INVENTORY_FAILED":
            case "PAYMENT_FAILED":
                order.setStatus("CANCELED");
                orderRepository.save(order);
                System.out.println("Order ID " + event.getOrderId() + " updated to CANCELED due to " + event.getStatus());
                break;
            default:
                break;
        }
    }
}
