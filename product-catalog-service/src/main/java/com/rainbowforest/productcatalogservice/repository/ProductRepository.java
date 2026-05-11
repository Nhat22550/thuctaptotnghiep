package com.rainbowforest.productcatalogservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rainbowforest.productcatalogservice.entity.Product;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    public List<Product> findAllByCategoryName(String category);
    public List<Product> findAllByProductName(String name);
    public List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}
