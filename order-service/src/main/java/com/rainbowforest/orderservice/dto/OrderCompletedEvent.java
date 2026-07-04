package com.rainbowforest.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCompletedEvent {
    private Long orderId;
    private String recipientEmail;
    private String customerName;
    private String pdfBase64; 
}
