package com.rainbowforest.orderservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.rainbowforest.orderservice.domain.Product;

@FeignClient(name = "product-catalog-service", url = "http://localhost:8810/")
public interface ProductClient {

    @GetMapping(value = "/products/{id}")
    public java.util.Map<String, Object> getProductById(@PathVariable(value = "id") Long productId);

    @org.springframework.web.bind.annotation.PutMapping(value = "/products/{id}/deduct-stock")
    public void deductStock(@PathVariable(value = "id") Long id, @org.springframework.web.bind.annotation.RequestParam("quantity") Integer quantity);
}
