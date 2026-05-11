package com.rainbowforest.paymentservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service")
public interface OrderClient {

    @PutMapping("/orders/{id}/status")
    void updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
