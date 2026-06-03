package com.rainbowforest.productcatalogservice.service;

import java.math.BigDecimal;
import java.util.List;

import com.rainbowforest.productcatalogservice.entity.Product;

public interface ProductService {
    public List<Product> getAllProduct();
    public List<Product> getAllProductByCategoryName(String category);
    public Product getProductById(Long id);
    public List<Product> getAllProductsByName(String name);
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    public Product addProduct(Product product);
    public Product saveProduct(Product product);
    public void deleteProduct(Long productId);
    public void deductStock(Long id, Integer quantity);
    public void addStock(Long id, Integer quantity);
}
