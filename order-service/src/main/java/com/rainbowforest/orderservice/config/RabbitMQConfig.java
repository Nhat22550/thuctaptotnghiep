package com.rainbowforest.orderservice.config;

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
    public static final String QUEUE_NAME = "order.queue";

    @Bean
    public TopicExchange sagaExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue orderQueue() {
        return new Queue(QUEUE_NAME);
    }

    @Bean
    public Binding bindingPaymentCompleted(Queue orderQueue, TopicExchange sagaExchange) {
        return BindingBuilder.bind(orderQueue).to(sagaExchange).with("payment.completed");
    }

    @Bean
    public Binding bindingInventoryFailed(Queue orderQueue, TopicExchange sagaExchange) {
        return BindingBuilder.bind(orderQueue).to(sagaExchange).with("inventory.failed");
    }

    @Bean
    public Binding bindingPaymentFailed(Queue orderQueue, TopicExchange sagaExchange) {
        return BindingBuilder.bind(orderQueue).to(sagaExchange).with("payment.failed");
    }

    @Bean
    public MessageConverter messageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        org.springframework.amqp.support.converter.DefaultClassMapper classMapper = new org.springframework.amqp.support.converter.DefaultClassMapper() {
            @Override
            public Class<?> toClass(org.springframework.amqp.core.MessageProperties properties) {
                return com.rainbowforest.orderservice.dto.SagaEvent.class;
            }
        };
        converter.setClassMapper(classMapper);
        return converter;
    }
}
