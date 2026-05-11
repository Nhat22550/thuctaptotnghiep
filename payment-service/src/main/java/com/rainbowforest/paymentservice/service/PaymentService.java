package com.rainbowforest.paymentservice.service;

import com.rainbowforest.paymentservice.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment savePayment(Payment payment);
    List<Payment> getAllPayments();
}
