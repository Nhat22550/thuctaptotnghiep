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

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.id = :id AND (p.stock IS NOT NULL AND p.stock >= :quantity)")
    int deductStock(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("quantity") Integer quantity);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Product p SET p.stock = p.stock + :quantity WHERE p.id = :id AND p.stock IS NOT NULL")
    int addStock(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("quantity") Integer quantity);
}
