package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Order;
import java.util.List;

public interface OrderService {
    public Order saveOrder(Order order);
    public List<Order> getAllOrders();
    public Order getOrderById(Long id);
    public Order updateOrder(Long id, Order orderDetails);
    public void deleteOrder(Long id);
    public List<Order> getOrdersByUserId(Long userId);
}
