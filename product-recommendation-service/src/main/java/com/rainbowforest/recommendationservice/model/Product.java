package com.rainbowforest.recommendationservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table (name = "products")
public class Product {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    @Column (name = "product_name")
    private String productName;

    @Column (name = "price")
    private java.math.BigDecimal price;

    @Column (name = "description")
    private String description;

    @Column (name = "category")
    private String category;

    @Column (name = "battery_capacity")
    private String batteryCapacity;

    @Column (name = "max_range")
    private String maxRange;

    @Column (name = "top_speed")
    private Integer topSpeed;

    @Column (name = "color")
    private String color;

    @Column (name = "motor_power")
    private Integer motorPower;

    @Column (name = "image_url")
    private String imageUrl;

    @Column (name = "charge_time")
    private String chargeTime;

    @Column (name = "weight")
    private Integer weight;

    @OneToMany (mappedBy = "product")
    @JsonIgnore
    private List<Recommendation> recomendations;
    
    public Product() {
    	
    }

    public Product(String productName, List<Recommendation> recomendations) {
        this.productName = productName;
        this.recomendations = recomendations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public java.math.BigDecimal getPrice() {
        return price;
    }

    public void setPrice(java.math.BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBatteryCapacity() {
        return batteryCapacity;
    }

    public void setBatteryCapacity(String batteryCapacity) {
        this.batteryCapacity = batteryCapacity;
    }

    public String getMaxRange() {
        return maxRange;
    }

    public void setMaxRange(String maxRange) {
        this.maxRange = maxRange;
    }

    public Integer getTopSpeed() {
        return topSpeed;
    }

    public void setTopSpeed(Integer topSpeed) {
        this.topSpeed = topSpeed;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getMotorPower() {
        return motorPower;
    }

    public void setMotorPower(Integer motorPower) {
        this.motorPower = motorPower;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getChargeTime() {
        return chargeTime;
    }

    public void setChargeTime(String chargeTime) {
        this.chargeTime = chargeTime;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public List<Recommendation> getRecomendations() {
        return recomendations;
    }

    public void setRecomendations(List<Recommendation> recomendations) {
        this.recomendations = recomendations;
    }
}
