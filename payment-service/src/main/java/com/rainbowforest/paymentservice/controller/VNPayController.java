package com.rainbowforest.paymentservice.controller;

import com.rainbowforest.paymentservice.config.VNPayConfig;
import com.rainbowforest.paymentservice.entity.Payment;
import com.rainbowforest.paymentservice.feignclient.OrderClient;
import com.rainbowforest.paymentservice.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  VNPAY Payment Controller  –  EV Store
 *  API tạo URL thanh toán VNPAY Sandbox (v2.1.0)
 *
 *  Frontend gọi:    GET /api/payment/create_url?amount=28500000
 *  API Gateway:      /api/payment/** → StripPrefix=2 → service nhận /create_url
 *
 *  Thuật toán chữ ký:
 *    1. Đưa tất cả tham số vào Map
 *    2. Sắp xếp key theo Alphabet (A-Z)
 *    3. URL-encode CẢ fieldName VÀ fieldValue bằng US_ASCII
 *    4. Nối thành hashData: encodedKey=encodedValue&...
 *    5. Băm hashData bằng HmacSHA512 với hash-secret
 * ═══════════════════════════════════════════════════════════════════════
 */
@RestController
public class VNPayController {

    @Autowired
    private VNPayConfig vnPayConfig;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderClient orderClient;

    @GetMapping("/create_url")
    public ResponseEntity<?> createPaymentUrl(
            @RequestParam("amount") long amount,
            @RequestParam(value = "orderId", required = false) String orderId,
            HttpServletRequest request
    ) {
        try {
            // ─── 1. Chuẩn bị dữ liệu cơ bản ─────────────────────────────────
            // Nếu có orderId thì dùng làm TxnRef, giúp liên kết VNPay ↔ Order
            String vnp_TxnRef  = (orderId != null && !orderId.isEmpty()) ? orderId : VNPayConfig.generateTxnRef();
            String vnp_IpAddr  = VNPayConfig.getIpAddress(request);

            // VNPAY yêu cầu amount nhân 100, chuyển thành chuỗi string
            String vnp_Amount = String.valueOf(amount * 100);

            // ─── 2. Tạo thời gian (Múi giờ Việt Nam) ─────────────────────────
            TimeZone vnTimeZone = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
            Calendar calendar   = Calendar.getInstance(vnTimeZone);

            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            formatter.setTimeZone(vnTimeZone);

            String vnp_CreateDate = formatter.format(calendar.getTime());
            calendar.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(calendar.getTime());

            // ─── 3. Đưa tất cả tham số bắt buộc vào Map ─────────────────────
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version",    "2.1.0");
            vnp_Params.put("vnp_Command",    "pay");
            vnp_Params.put("vnp_TmnCode",    vnPayConfig.getTmnCode());
            vnp_Params.put("vnp_Amount",     vnp_Amount);
            vnp_Params.put("vnp_CurrCode",   "VND");
            vnp_Params.put("vnp_TxnRef",     vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo",  "Thanh toan don hang xe dien EV STORE");
            vnp_Params.put("vnp_OrderType",  "other");
            vnp_Params.put("vnp_Locale",     "vn");
            vnp_Params.put("vnp_ReturnUrl",  vnPayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr",     vnp_IpAddr);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // ─── 4. Sắp xếp key theo Alphabet (A-Z) ─────────────────────────
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            // ─── 5. Tạo chuỗi hashData + query ───────────────────────────────
            //   BẮT BUỘC: Cả fieldName VÀ fieldValue đều phải URL-encode
            //             bằng URLEncoder.encode(..., US_ASCII)
            StringBuilder hashData = new StringBuilder();
            StringBuilder query    = new StringBuilder();

            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName  = itr.next();
                String fieldValue = vnp_Params.get(fieldName);

                if (fieldValue != null && !fieldValue.isEmpty()) {
                    // URL-encode cả key lẫn value bằng US_ASCII
                    String encodedName  = URLEncoder.encode(fieldName,  StandardCharsets.US_ASCII.toString());
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());

                    // Nối vào hashData (để băm)
                    hashData.append(encodedName).append('=').append(encodedValue);

                    // Nối vào query (để làm URL)
                    query.append(encodedName).append('=').append(encodedValue);

                    if (itr.hasNext()) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }

            // ─── 6. DEBUG LOG (Bắt buộc) ─────────────────────────────────────
            System.out.println("=== HASH DATA CHUẨN: " + hashData.toString());

            // ─── 7. Tạo chữ ký HmacSHA512 ────────────────────────────────────
            String vnp_SecureHash = VNPayConfig.hmacSHA512(
                    vnPayConfig.getHashSecret(),
                    hashData.toString()
            );

            System.out.println("=== SECURE HASH: " + vnp_SecureHash);

            // ─── 8. Ghép URL hoàn chỉnh ──────────────────────────────────────
            String queryUrl = vnPayConfig.getVnpUrl()
                    + "?" + query.toString()
                    + "&vnp_SecureHash=" + vnp_SecureHash;

            System.out.println("=== PAYMENT URL: " + queryUrl);

            // ─── 9. Trả JSON cho Frontend ─────────────────────────────────────
            Map<String, String> result = new LinkedHashMap<>();
            result.put("status",  "OK");
            result.put("message", "Success");
            result.put("url",     queryUrl);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new LinkedHashMap<>();
            error.put("status",  "ERROR");
            error.put("message", "Lỗi tạo URL thanh toán: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Endpoint xác thực kết quả thanh toán từ VNPay
    //  Frontend gọi:  GET /api/payment/vnpay_return?vnp_Amount=...&vnp_ResponseCode=00&...
    //  Gateway:        /api/payment/** → StripPrefix=2 → service nhận /vnpay_return
    // ═══════════════════════════════════════════════════════════════════════
    @GetMapping("/vnpay_return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request) {
        try {
            // ─── 1. Lấy toàn bộ tham số từ query string ─────────────────────
            Map<String, String> fields = new HashMap<>();
            Enumeration<String> paramNames = request.getParameterNames();
            while (paramNames.hasMoreElements()) {
                String paramName  = paramNames.nextElement();
                String paramValue = request.getParameter(paramName);
                if (paramValue != null && !paramValue.isEmpty()) {
                    fields.put(paramName, paramValue);
                }
            }

            // ─── 2. Tách chữ ký ra khỏi danh sách tham số ──────────────────
            String vnp_SecureHash = fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");   // Nếu có

            if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) {
                Map<String, String> err = new LinkedHashMap<>();
                err.put("status", "ERROR");
                err.put("message", "Thiếu chữ ký bảo mật (vnp_SecureHash)");
                return ResponseEntity.badRequest().body(err);
            }

            // ─── 3. Sắp xếp key theo Alphabet và tạo hashData ──────────────
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName  = itr.next();
                String fieldValue = fields.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    String encodedName  = URLEncoder.encode(fieldName,  StandardCharsets.US_ASCII.toString());
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());
                    hashData.append(encodedName).append('=').append(encodedValue);
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            // ─── 4. Tính lại chữ ký và so sánh ─────────────────────────────
            String calculatedHash = VNPayConfig.hmacSHA512(
                    vnPayConfig.getHashSecret(),
                    hashData.toString()
            );

            System.out.println("=== [VNPAY RETURN] Hash từ VNPay : " + vnp_SecureHash);
            System.out.println("=== [VNPAY RETURN] Hash tự tính  : " + calculatedHash);

            String vnp_ResponseCode = fields.get("vnp_ResponseCode");

            Map<String, Object> result = new LinkedHashMap<>();

            if (calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
                // Chữ ký hợp lệ → kiểm tra responseCode
                if ("00".equals(vnp_ResponseCode)) {
                    String txnRef = fields.get("vnp_TxnRef");
                    String transactionNo = fields.get("vnp_TransactionNo");
                    String vnpAmount = fields.get("vnp_Amount");

                    // ─── Lưu Payment record vào DB ──────────────────────────
                    try {
                        Payment payment = new Payment();
                        payment.setOrderId(Long.parseLong(txnRef));
                        payment.setAmount(Double.parseDouble(vnpAmount) / 100);
                        payment.setTransactionNo(transactionNo);
                        payment.setPaymentMethod("VNPAY");
                        payment.setStatus("SUCCESS");
                        payment.setPaymentDate(LocalDateTime.now());
                        paymentService.savePayment(payment);
                        System.out.println("=== [VNPAY] Payment saved: orderId=" + txnRef);
                    } catch (Exception ex) {
                        System.err.println("=== [VNPAY] Lỗi lưu Payment: " + ex.getMessage());
                        ex.printStackTrace();
                    }

                    // ─── Cập nhật Order status → PAID qua Feign ─────────────
                    try {
                        orderClient.updateOrderStatus(Long.parseLong(txnRef), "PAID");
                        System.out.println("=== [VNPAY] Order #" + txnRef + " updated to PAID");
                    } catch (Exception ex) {
                        System.err.println("=== [VNPAY] Lỗi cập nhật Order: " + ex.getMessage());
                        ex.printStackTrace();
                    }

                    result.put("status", "OK");
                    result.put("message", "Giao dịch thành công");
                    result.put("responseCode", vnp_ResponseCode);
                    result.put("transactionNo", transactionNo);
                    result.put("txnRef", txnRef);
                    result.put("amount", vnpAmount);
                    result.put("orderId", txnRef);
                    return ResponseEntity.ok(result);
                } else {
                    result.put("status", "FAILED");
                    result.put("message", "Giao dịch không thành công. Mã lỗi: " + vnp_ResponseCode);
                    result.put("responseCode", vnp_ResponseCode);
                    return ResponseEntity.ok(result);
                }
            } else {
                // Chữ ký KHÔNG hợp lệ → có thể bị giả mạo
                result.put("status", "INVALID_SIGNATURE");
                result.put("message", "Chữ ký bảo mật không hợp lệ. Giao dịch có thể bị giả mạo.");
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new LinkedHashMap<>();
            error.put("status", "ERROR");
            error.put("message", "Lỗi xác thực kết quả thanh toán: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
