package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Product;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.repository.UserRepository;
import com.rainbowforest.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders") // Mọi request /api/orders sẽ vào đây
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserClient userClient;

    @Autowired
    private com.rainbowforest.orderservice.feignclient.ProductClient productClient;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.rainbowforest.orderservice.service.PdfGenerationService pdfGenerationService;

    // 1. Lấy danh sách đơn hàng (FIX LỖI 405)
    // React gọi: GET http://localhost:8900/api/orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // 1.1 Lấy danh sách đơn hàng theo User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // 1.2 Lấy chi tiết một đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return new ResponseEntity<>(order, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 2. Thêm đơn hàng mới
    // React gọi: POST http://localhost:8900/api/orders
    @PostMapping
    public ResponseEntity<Order> saveOrderDirectly(@RequestBody Map<String, Object> payload) {
        try {
            Order order = new Order();
            order.setOrderedDate(LocalDate.now());

            // Lấy thông tin từ payload
            if (payload.containsKey("receiverName"))
                order.setReceiverName(payload.get("receiverName").toString());
            if (payload.containsKey("shippingAddress"))
                order.setShippingAddress(payload.get("shippingAddress").toString());
            if (payload.containsKey("phoneNumber"))
                order.setPhoneNumber(payload.get("phoneNumber").toString());
            if (payload.containsKey("total"))
                order.setTotal(new java.math.BigDecimal(payload.get("total").toString()));

            // Xử lý status theo paymentMethod
            String paymentMethod = payload.containsKey("paymentMethod")
                    ? payload.get("paymentMethod").toString() : "COD";
            
            order.setPaymentMethod(paymentMethod);

            if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                order.setStatus("PENDING");
                order.setDeliveryStatus("WAITING_PAYMENT");
            } else {
                String status = payload.containsKey("status")
                        ? payload.get("status").toString() : "PAID";
                order.setStatus(status);
                order.setDeliveryStatus("SHIPPING");
            }

            // Gắn user nếu có userId
            if (payload.containsKey("userId")) {
                try {
                    Long userId = Long.valueOf(payload.get("userId").toString());
                    User user = userClient.getUserById(userId);
                    if (user != null) {
                        User managedUser = userRepository.save(user);
                        order.setUser(managedUser);
                    }
                } catch (Exception ignored) {}
            }

            // Xử lý items
            if (payload.containsKey("items")) {
                List<Map<String, Object>> itemsList = (List<Map<String, Object>>) payload.get("items");
                List<Item> orderItems = new java.util.ArrayList<>();
                java.math.BigDecimal computedTotal = java.math.BigDecimal.ZERO;

                for (Map<String, Object> itemMap : itemsList) {
                    Item item = new Item();
                    item.setQuantity(Integer.parseInt(itemMap.get("quantity").toString()));
                    
                    // Lấy productId từ payload để query giá thực tế
                    Long originProductId = null;
                    if (itemMap.containsKey("productId")) {
                        originProductId = Long.valueOf(itemMap.get("productId").toString());
                    }
                    
                    Product productSnapshot = new Product();
                    
                    if (originProductId != null) {
                        try {
                            // Gọi qua product-catalog-service lấy giá chuẩn
                            java.util.Map<String, Object> realProduct = productClient.getProductById(originProductId);
                            if (realProduct != null) {
                                productSnapshot.setProductName(realProduct.get("productName").toString());
                                productSnapshot.setPrice(new java.math.BigDecimal(realProduct.get("price").toString()));
                                if (realProduct.containsKey("imageUrl") && realProduct.get("imageUrl") != null) {
                                    productSnapshot.setImage(realProduct.get("imageUrl").toString());
                                }
                            } else {
                                throw new RuntimeException("Product not found with id: " + originProductId);
                            }
                        } catch (Exception e) {
                            // Fallback to client if necessary or just fail? We should fail securely.
                            throw new RuntimeException("Error fetching product data from catalog", e);
                        }
                    } else {
                        // Nếu không truyền productId, fail order
                        throw new RuntimeException("Missing productId in order items");
                    }

                    // Tính subtotal dựa trên giá thực (đã gắn vào snapshot)
                    item.setSubTotal(productSnapshot.getPrice()
                            .multiply(new java.math.BigDecimal(item.getQuantity())));
                    
                    computedTotal = computedTotal.add(item.getSubTotal());
                    
                    item.setProduct(productSnapshot);
                    orderItems.add(item);
                }
                order.setItems(orderItems);
                // Ghi đè lại total bằng tổng tính toán an toàn
                order.setTotal(computedTotal);
            }

            Order saved = orderService.saveOrder(order);
            
            // Trừ kho cho đơn không phải VNPAY (COD)
            if (!"VNPAY".equalsIgnoreCase(paymentMethod) && saved.getItems() != null) {
                for (Item item : saved.getItems()) {
                    if (item.getProduct() != null && item.getProduct().getProductId() != null) {
                        try {
                            productClient.deductStock(item.getProduct().getProductId(), item.getQuantity());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(e.getMessage() != null ? e.getMessage() : e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 3. Cập nhật trạng thái đơn hàng (được gọi từ payment-service qua Feign)
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
        try {
            Order order = orderService.getOrderById(id);
            if (order != null) {
                // Kiểm tra nếu chuyển sang PAID thì tiến hành trừ kho
                if ("PAID".equalsIgnoreCase(status) && !"PAID".equalsIgnoreCase(order.getStatus())) {
                    if (order.getItems() != null) {
                        for (Item item : order.getItems()) {
                            if (item.getProduct() != null && item.getProduct().getProductId() != null) {
                                try {
                                    productClient.deductStock(item.getProduct().getProductId(), item.getQuantity());
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }
                }
                
                order.setStatus(status);
                orderService.saveOrder(order);
                return new ResponseEntity<>(order, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 4. Cập nhật thông tin đơn hàng
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable("id") Long id, @RequestBody Order orderDetails) {
        try {
            Order updatedOrder = orderService.updateOrder(id, orderDetails);
            if (updatedOrder != null) {
                return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 5. Xóa đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long id) {
        try {
            orderService.deleteOrder(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 6. Xuất hóa đơn PDF
    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable("id") Long id) {
        try {
            Order order = orderService.getOrderById(id);
            if (order == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            byte[] pdfBytes = pdfGenerationService.generateInvoicePdf(order);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}