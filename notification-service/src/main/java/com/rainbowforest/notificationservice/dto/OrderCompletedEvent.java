package com.rainbowforest.notificationservice.dto;

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
    private String pdfBase64; // Base64 encoded PDF byte array
}
