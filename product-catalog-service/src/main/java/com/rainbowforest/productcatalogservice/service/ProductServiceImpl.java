package com.rainbowforest.productcatalogservice.service;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductByCategoryName(String category) {
        return productRepository.findAllByCategoryName(category);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.getOne(id);
    }

    @Override
    public List<Product> getAllProductsByName(String name) {
        return productRepository.findAllByProductName(name);
    }

    @Override
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public void deductStock(Long id, Integer quantity) {
        int updatedCount = productRepository.deductStock(id, quantity);
        if (updatedCount == 0) {
            throw new RuntimeException("Sản phẩm không tồn tại hoặc số lượng tồn kho không đủ để trừ: " + id);
        }
    }

    @Override
    public void addStock(Long id, Integer quantity) {
        int updatedCount = productRepository.addStock(id, quantity);
        if (updatedCount == 0) {
            throw new RuntimeException("Sản phẩm không tồn tại: " + id);
        }
    }
}
