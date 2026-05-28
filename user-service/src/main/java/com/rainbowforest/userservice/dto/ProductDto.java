package com.rainbowforest.userservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String productName;
    private BigDecimal price;
    private String description;
    private String batteryCapacity;
    private String maxRange;
    private Integer topSpeed;
    private String color;
    private Integer motorPower;
    private String segment;
    private String imageUrl;
}
