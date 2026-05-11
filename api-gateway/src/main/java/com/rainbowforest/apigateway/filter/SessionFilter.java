package com.rainbowforest.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class SessionFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(SessionFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return exchange.getSession().flatMap(session -> {
            logger.info("Session ID: {}", session.getId());
            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(builder -> builder.header("Cookie", session.getId()))
                    .build();
            return chain.filter(mutatedExchange);
        });
    }

    @Override
    public int getOrder() {
        return 10;
    }
}