package com.rainbowforest.productcatalogservice.messaging;

import com.rainbowforest.productcatalogservice.config.RabbitMQConfig;
import com.rainbowforest.productcatalogservice.dto.SagaEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishInventoryReserved(SagaEvent event) {
        System.out.println("Publishing inventory.reserved event for Order ID: " + event.getOrderId());
        event.setStatus("INVENTORY_RESERVED");
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "inventory.reserved", event);
    }

    public void publishInventoryFailed(SagaEvent event) {
        System.out.println("Publishing inventory.failed event for Order ID: " + event.getOrderId());
        event.setStatus("INVENTORY_FAILED");
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "inventory.failed", event);
    }
}
