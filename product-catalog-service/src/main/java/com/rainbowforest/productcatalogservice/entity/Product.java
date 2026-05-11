package com.rainbowforest.productcatalogservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table (name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "product_name")
    @NotNull
    private String productName;

    @Column (name = "price")
    @NotNull
    private BigDecimal price;

    @Column (name = "description")
    private String description;

    @ManyToOne
    @JoinColumn (name = "category_id")
    @NotNull
    private Category category;

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

    @Column (name = "segment")
    private String segment;

    @Column (name = "charge_time")
    private String chargeTime;   // Ví dụ: "3.5 giờ", "2h 30m"

    @Column (name = "weight")
    private Integer weight;      // Đơn vị: kg

	public Product() {

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

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
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

	public String getSegment() {
		return segment;
	}

	public void setSegment(String segment) {
		this.segment = segment;
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
}
