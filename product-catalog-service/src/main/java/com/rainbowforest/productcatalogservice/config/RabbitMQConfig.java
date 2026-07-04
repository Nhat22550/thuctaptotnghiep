package com.rainbowforest.productcatalogservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "saga.exchange";
    public static final String QUEUE_NAME = "inventory.queue";

    @Bean
    public TopicExchange sagaExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue inventoryQueue() {
        return new Queue(QUEUE_NAME);
    }

    @Bean
    public Binding bindingOrderCreated(Queue inventoryQueue, TopicExchange sagaExchange) {
        return BindingBuilder.bind(inventoryQueue).to(sagaExchange).with("order.created");
    }

    @Bean
    public Binding bindingPaymentFailed(Queue inventoryQueue, TopicExchange sagaExchange) {
        return BindingBuilder.bind(inventoryQueue).to(sagaExchange).with("payment.failed");
    }

    @Bean
    public MessageConverter messageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        org.springframework.amqp.support.converter.DefaultClassMapper classMapper = new org.springframework.amqp.support.converter.DefaultClassMapper() {
            @Override
            public Class<?> toClass(org.springframework.amqp.core.MessageProperties properties) {
                return com.rainbowforest.productcatalogservice.dto.SagaEvent.class;
            }
        };
        converter.setClassMapper(classMapper);
        return converter;
    }
}
