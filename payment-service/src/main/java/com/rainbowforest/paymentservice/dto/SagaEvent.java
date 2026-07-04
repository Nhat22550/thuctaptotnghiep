package com.rainbowforest.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SagaEvent {
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private BigDecimal amount;
    private String status;
    private String message;
}
