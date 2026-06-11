package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.domain.Discount;
import com.rainbowforest.orderservice.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        return new ResponseEntity<>(discountService.getAllDiscounts(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount) {
        return new ResponseEntity<>(discountService.saveDiscount(discount), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Discount> updateDiscount(@PathVariable("id") Long id, @RequestBody Discount discountDetails) {
        Optional<Discount> optDiscount = discountService.getDiscountById(id);
        if (optDiscount.isPresent()) {
            Discount discount = optDiscount.get();
            discount.setCode(discountDetails.getCode());
            discount.setDiscountType(discountDetails.getDiscountType());
            discount.setDiscountValue(discountDetails.getDiscountValue());
            discount.setMinOrderAmount(discountDetails.getMinOrderAmount());
            discount.setActive(discountDetails.isActive());
            discount.setStartDate(discountDetails.getStartDate());
            discount.setEndDate(discountDetails.getEndDate());
            return new ResponseEntity<>(discountService.saveDiscount(discount), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable("id") Long id) {
        discountService.deleteDiscount(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateDiscount(@PathVariable("code") String code, @RequestParam("orderTotal") BigDecimal orderTotal) {
        try {
            Discount discount = discountService.validateDiscount(code, orderTotal);
            BigDecimal discountAmount = discountService.calculateDiscountAmount(discount, orderTotal);
            
            // Đảm bảo không giảm quá số tiền đơn hàng
            if (discountAmount.compareTo(orderTotal) > 0) {
                discountAmount = orderTotal;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("discount", discount);
            response.put("discountAmount", discountAmount);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("valid", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}
