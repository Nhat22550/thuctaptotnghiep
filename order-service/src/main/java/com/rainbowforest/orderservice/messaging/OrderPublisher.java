package com.rainbowforest.orderservice.messaging;

import com.rainbowforest.orderservice.config.RabbitMQConfig;
import com.rainbowforest.orderservice.dto.SagaEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishOrderCreated(SagaEvent event) {
        System.out.println("Publishing order.created event for Order ID: " + event.getOrderId());
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "order.created", event);
    }
}
