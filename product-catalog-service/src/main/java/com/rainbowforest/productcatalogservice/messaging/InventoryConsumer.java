package com.rainbowforest.productcatalogservice.messaging;

import com.rainbowforest.productcatalogservice.config.RabbitMQConfig;
import com.rainbowforest.productcatalogservice.dto.SagaEvent;
import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InventoryConsumer {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryPublisher inventoryPublisher;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    @Transactional
    public void consume(SagaEvent event) {
        System.out.println("Received event in Inventory: " + event.getStatus() + " for Order ID: " + event.getOrderId());

        if ("ORDER_CREATED".equals(event.getStatus())) {
            Optional<Product> optionalProduct = productRepository.findById(event.getProductId());
            
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                int requiredQty = event.getQuantity() != null ? event.getQuantity() : 1;
                
                if (product.getStock() >= requiredQty) {
                    product.setStock(product.getStock() - requiredQty);
                    productRepository.save(product);
                    System.out.println("Stock deducted. New stock: " + product.getStock());
                    
                    inventoryPublisher.publishInventoryReserved(event);
                } else {
                    System.out.println("Not enough stock for product " + event.getProductId());
                    event.setMessage("Not enough stock");
                    inventoryPublisher.publishInventoryFailed(event);
                }
            } else {
                System.out.println("Product not found: " + event.getProductId());
                event.setMessage("Product not found");
                inventoryPublisher.publishInventoryFailed(event);
            }
        } 
        else if ("PAYMENT_FAILED".equals(event.getStatus())) {
            // Compensation: Add stock back
            Optional<Product> optionalProduct = productRepository.findById(event.getProductId());
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                int qty = event.getQuantity() != null ? event.getQuantity() : 1;
                product.setStock(product.getStock() + qty);
                productRepository.save(product);
                System.out.println("Compensation applied. Stock restored by " + qty + ". New stock: " + product.getStock());
            }
        }
    }
}
