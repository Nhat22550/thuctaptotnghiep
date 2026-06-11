package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Discount;
import com.rainbowforest.orderservice.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    public Discount saveDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }

    public Optional<Discount> getDiscountById(Long id) {
        return discountRepository.findById(id);
    }

    public Discount validateDiscount(String code, BigDecimal orderSubtotal) {
        Optional<Discount> optDiscount = discountRepository.findByCode(code);
        if (!optDiscount.isPresent()) {
            throw new RuntimeException("Mã giảm giá không tồn tại");
        }

        Discount discount = optDiscount.get();

        if (!discount.isActive()) {
            throw new RuntimeException("Mã giảm giá đã bị vô hiệu hóa");
        }

        LocalDate now = LocalDate.now();
        if (discount.getStartDate() != null && now.isBefore(discount.getStartDate())) {
            throw new RuntimeException("Mã giảm giá chưa đến thời gian áp dụng");
        }

        if (discount.getEndDate() != null && now.isAfter(discount.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn");
        }

        if (discount.getMinOrderAmount() != null && orderSubtotal.compareTo(discount.getMinOrderAmount()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này");
        }

        return discount;
    }

    public BigDecimal calculateDiscountAmount(Discount discount, BigDecimal orderSubtotal) {
        if ("PERCENTAGE".equalsIgnoreCase(discount.getDiscountType())) {
            BigDecimal percentage = discount.getDiscountValue().divide(new BigDecimal("100"));
            return orderSubtotal.multiply(percentage);
        } else if ("FIXED".equalsIgnoreCase(discount.getDiscountType())) {
            return discount.getDiscountValue();
        }
        return BigDecimal.ZERO;
    }
}
