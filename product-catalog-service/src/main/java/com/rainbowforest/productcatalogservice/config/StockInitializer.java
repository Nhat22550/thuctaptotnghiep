package com.rainbowforest.productcatalogservice.config;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class StockInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        List<Product> products = productRepository.findAll();
        boolean updated = false;
        for (Product product : products) {
            if (product.getStock() == null) {
                product.setStock(50);
                updated = true;
            }
        }
        if (updated) {
            productRepository.saveAll(products);
            System.out.println("=== [StockInitializer] Đã khởi tạo stock = 50 cho các sản phẩm bị null ===");
        }
    }
}
