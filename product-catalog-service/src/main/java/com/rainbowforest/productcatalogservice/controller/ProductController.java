package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping (value = "/products")
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        List<Product> products;
        if (minPrice != null && maxPrice != null) {
            products = productService.getProductsByPriceRange(minPrice, maxPrice);
        } else {
            products = productService.getAllProduct();
        }

        if (!products.isEmpty()) {
            return new ResponseEntity<>(products, headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK);
        }
        return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/products", params = "category")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam ("category") String category){
        List<Product> products = productService.getAllProductByCategoryName(category);
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable ("id") long id){
        Product product =  productService.getProductById(id);
        if(product != null) {
        	return new ResponseEntity<Product>(
        			product,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<Product>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products", params = "name")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam ("name") String name){
        List<Product> products =  productService.getAllProductsByName(name);
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/products/add-with-image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProductWithImage(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("productName") String productName,
            @RequestParam("price") java.math.BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value="batteryCapacity", required=false) String batteryCapacity,
            @RequestParam(value="maxRange", required=false) String maxRange,
            @RequestParam(value="topSpeed", required=false) Integer topSpeed,
            @RequestParam(value="color", required=false) String color,
            @RequestParam(value="motorPower", required=false) Integer motorPower,
            @RequestParam(value="segment", required=false) String segment) {
        try {
            // Lưu file
            java.io.File uploadDir = new java.io.File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll(" ", "_");
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir.getAbsolutePath(), fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Tạo Product
            Product product = new Product();
            product.setProductName(productName);
            product.setPrice(price);
            product.setDescription(description);
            
            com.rainbowforest.productcatalogservice.entity.Category category = new com.rainbowforest.productcatalogservice.entity.Category();
            category.setId(categoryId);
            product.setCategory(category);
            
            if(batteryCapacity != null) product.setBatteryCapacity(batteryCapacity);
            if(maxRange != null) product.setMaxRange(maxRange);
            if(topSpeed != null) product.setTopSpeed(topSpeed);
            if(color != null) product.setColor(color);
            if(motorPower != null) product.setMotorPower(motorPower);
            if(segment != null) product.setSegment(segment);
            
            product.setImageUrl("/uploads/" + fileName);

            Product savedProduct = productService.saveProduct(product);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/products/{id}/with-image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProductWithImage(
            @PathVariable("id") Long id,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam("productName") String productName,
            @RequestParam("price") java.math.BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value="batteryCapacity", required=false) String batteryCapacity,
            @RequestParam(value="maxRange", required=false) String maxRange,
            @RequestParam(value="topSpeed", required=false) Integer topSpeed,
            @RequestParam(value="color", required=false) String color,
            @RequestParam(value="motorPower", required=false) Integer motorPower,
            @RequestParam(value="segment", required=false) String segment) {
        try {
            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            existingProduct.setProductName(productName);
            existingProduct.setPrice(price);
            existingProduct.setDescription(description);
            
            com.rainbowforest.productcatalogservice.entity.Category category = new com.rainbowforest.productcatalogservice.entity.Category();
            category.setId(categoryId);
            existingProduct.setCategory(category);
            
            if(batteryCapacity != null) existingProduct.setBatteryCapacity(batteryCapacity);
            if(maxRange != null) existingProduct.setMaxRange(maxRange);
            if(topSpeed != null) existingProduct.setTopSpeed(topSpeed);
            if(color != null) existingProduct.setColor(color);
            if(motorPower != null) existingProduct.setMotorPower(motorPower);
            if(segment != null) existingProduct.setSegment(segment);

            if (file != null && !file.isEmpty()) {
                java.io.File uploadDir = new java.io.File("uploads");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll(" ", "_");
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir.getAbsolutePath(), fileName);
                java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                existingProduct.setImageUrl("/uploads/" + fileName);
            }

            Product updatedProduct = productService.saveProduct(existingProduct);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
