package com.rainbowforest.apigateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtHeaderFilter implements GlobalFilter, Ordered {

    private static final String JWT_SECRET = "nhat_ev_secret_key_2026_secure_random_string_longer_than_256_bits";
    private final SecretKey key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String userId = "";
                if (claims.get("userId") != null) {
                    userId = claims.get("userId").toString();
                }
                
                String role = claims.get("role", String.class);
                if (role == null) role = "";

                // Thêm headers X-User-Id và X-User-Role vào request forward xuống Microservice
                ServerHttpRequest request = exchange.getRequest().mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Role", role)
                        .build();

                return chain.filter(exchange.mutate().request(request).build());
            } catch (Exception e) {
                // Nếu token sai, cứ đi tiếp, Spring Security của Gateway sẽ lo việc ném 401
            }
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // Chạy trước khi forward request
    }
}
