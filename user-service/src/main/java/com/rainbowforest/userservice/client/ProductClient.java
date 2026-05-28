package com.rainbowforest.userservice.client;

import com.rainbowforest.userservice.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "product-catalog-service")
public interface ProductClient {
    @GetMapping("/products")
    List<ProductDto> getAllProducts();
}
