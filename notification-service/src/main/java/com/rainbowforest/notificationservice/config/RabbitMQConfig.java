package com.rainbowforest.notificationservice.config;

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

    public static final String QUEUE_NAME = "notification_queue";
    public static final String EXCHANGE_NAME = "saga.exchange"; // Using the same exchange

    @Bean
    public Queue notificationQueue() {
        return new Queue(QUEUE_NAME, false);
    }

    @Bean
    public TopicExchange sagaExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding bindingNotification(Queue notificationQueue, TopicExchange sagaExchange) {
        return BindingBuilder.bind(notificationQueue).to(sagaExchange).with("order.completed");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        org.springframework.amqp.support.converter.DefaultClassMapper classMapper = new org.springframework.amqp.support.converter.DefaultClassMapper() {
            @Override
            public Class<?> toClass(org.springframework.amqp.core.MessageProperties properties) {
                return com.rainbowforest.notificationservice.dto.OrderCompletedEvent.class;
            }
        };
        converter.setClassMapper(classMapper);
        return converter;
    }
}
