package com.rainbowforest.recommendationservice.feignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "Order", url = "http://localhost:8813/")
public interface OrderClient {

    @GetMapping(value = "/orders/user/{userId}")
    public List<Map<String, Object>> getOrdersByUserId(@PathVariable("userId") Long userId);
}
