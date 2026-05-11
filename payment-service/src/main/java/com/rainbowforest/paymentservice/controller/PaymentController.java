package com.rainbowforest.paymentservice.controller;

import com.rainbowforest.paymentservice.entity.Payment;
import com.rainbowforest.paymentservice.feignclient.OrderClient;
import com.rainbowforest.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderClient orderClient;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return new ResponseEntity<>(paymentRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        try {
            payment.setPaymentDate(LocalDateTime.now());
            if (payment.getStatus() == null || payment.getStatus().isEmpty()) {
                payment.setStatus("SUCCESS");
            }
            
            Payment savedPayment = paymentRepository.save(payment);
            
            if ("SUCCESS".equalsIgnoreCase(savedPayment.getStatus())) {
                orderClient.updateOrderStatus(savedPayment.getOrderId(), "PAID");
            }

            return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
