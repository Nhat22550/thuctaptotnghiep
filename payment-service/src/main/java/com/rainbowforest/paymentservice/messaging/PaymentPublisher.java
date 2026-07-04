package com.rainbowforest.paymentservice.messaging;

import com.rainbowforest.paymentservice.config.RabbitMQConfig;
import com.rainbowforest.paymentservice.dto.SagaEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishPaymentCompleted(SagaEvent event) {
        System.out.println("Publishing payment.completed event for Order ID: " + event.getOrderId());
        event.setStatus("PAYMENT_COMPLETED");
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "payment.completed", event);
    }

    public void publishPaymentFailed(SagaEvent event) {
        System.out.println("Publishing payment.failed event for Order ID: " + event.getOrderId());
        event.setStatus("PAYMENT_FAILED");
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "payment.failed", event);
    }
}
